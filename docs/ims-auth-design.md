# IMS Authentication — Design Document

## Overview

The ASO Suggestion Lifecycle dashboard uses Adobe IMS (Identity Management Service) for user authentication via the **OAuth 2.0 Authorization Code + PKCE** flow. This replaces an earlier implementation that used the `imslib.min.js` CDN SDK with the `llmo-dashboard` client ID.

### Why PKCE?

- **No backend required** — the EDS site is fully static (HTML/JS). PKCE eliminates the need for a `client_secret`, so the authorization code can be exchanged for tokens entirely in the browser.
- **More secure than implicit flow** — tokens are never exposed in URL fragments.
- **Supports refresh tokens** — longer sessions without re-authentication.

---

## IMS Client Registration

| Field | Value |
|-------|-------|
| Client ID | `aso-dashboard` |
| Client type | Public (no client_secret) |
| Grant types | `authorization_code`, `refresh_token` |
| Redirect URIs | `http://localhost:3000/ims/callback`, `https://aso-lifecycle.stage.adobe.com/ims/callback`, `https://aso-lifecycle.adobe.com/ims/callback` |
| Scopes | `openid`, `AdobeID`, `read_organizations`, `additional_info.roles`, `additional_info.projectedProductContext` |

---

## Auth Flow

```
1. User clicks "Sign in with Adobe"
2. Browser generates PKCE code_verifier + code_challenge
3. Browser stores code_verifier in sessionStorage
4. Browser redirects to:
   https://ims-na1.adobelogin.com/ims/authorize/v3
     ?client_id=aso-dashboard
     &redirect_uri=https://origin/ims/callback
     &scope=openid,AdobeID,...
     &response_type=code
     &code_challenge=<sha256_hash>
     &code_challenge_method=S256

5. User authenticates on Adobe IMS login page
6. IMS redirects to /ims/callback?code=ABC123

7. Callback page:
   a. Extracts ?code= from URL
   b. Retrieves code_verifier from sessionStorage
   c. POSTs to IMS token endpoint:
      POST https://ims-na1.adobelogin.com/ims/token/v3
      grant_type=authorization_code
      client_id=aso-dashboard
      code=ABC123
      code_verifier=<original_verifier>
      redirect_uri=https://origin/ims/callback
   d. Receives { access_token, refresh_token, expires_in }
   e. Fetches user profile from IMS /ims/profile/v1
   f. Stores everything in sessionStorage
   g. Redirects to /suggestion-lifecycle.html

8. Dashboard page loads:
   a. initIMS() checks sessionStorage for valid token
   b. If valid → IMS mode (show customer/site selectors)
   c. If expired + refresh token → attempt silent refresh
   d. If no token → dev mode (demo data)
```

---

## Auth State Shape

Stored in `sessionStorage` under key `aso_ims_auth`:

```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyR...",
  "expiresAt": 1738700000000,
  "profile": {
    "email": "user@adobe.com",
    "name": "First Last",
    "userId": "ABC123@AdobeID"
  },
  "imsOrgId": "ORG123@AdobeOrg"
}
```

### Why sessionStorage?

- Tokens are scoped to the browser tab/session — closing the tab clears them.
- More secure than localStorage for sensitive tokens.
- Matches the pattern used by the LLMO dashboard's `imslib` SDK.

---

## Token Lifecycle

### Auto-refresh

A `setInterval` runs every 2 minutes:
- If the access token expires within 10 minutes, it calls `refreshAccessToken()`.
- `refreshAccessToken()` POSTs to `/ims/token/v3` with `grant_type=refresh_token`.
- On success, the new token + expiration is stored and `onAuthStateChange` listeners are notified.
- On failure, the user's session degrades gracefully (they'll be prompted to re-login on next API call).

### Sign-out

- Clears `sessionStorage` (auth state + any legacy `imslib` keys).
- Optionally redirects to the IMS logout endpoint.
- Resets the dashboard to dev mode.

---

## IMS Org → SpaceCat Org → Sites Discovery

```
IMS access token
    │
    ├─→ GET https://llmo.experiencecloud.live/api/v1/auth/orgs
    │     → Returns IMS orgs the user can access (with optional SpaceCat org IDs)
    │
    ├─→ (Fallback) GET https://spacecat.experiencecloud.live/api/v1/organizations
    │     → Returns all SpaceCat orgs, matched by imsOrgId
    │
    └─→ GET https://spacecat.experiencecloud.live/api/v1/organizations/{orgId}/sites
          → Returns sites for the selected org
```

This flow is handled by `scripts/services/org-site-service.js` (`buildCustomerSiteTree(token)`). No changes were needed — it accepts a Bearer token and calls the relevant APIs.

---

## File Inventory

### Changed files

| File | Change | Description |
|------|--------|-------------|
| `scripts/auth/ims-config.js` | Rewrite | New client ID, PKCE config, IMS endpoint URLs, redirect URI builder |
| `scripts/auth/ims-auth.js` | Rewrite | PKCE implementation, token storage, refresh, profile fetch, listener system |
| `suggestion-lifecycle.html` | Update | Simplified auth init, removed SDK status logic, cleaner sign-in/sign-out |

### New files

| File | Description |
|------|-------------|
| `ims/callback.html` | OAuth callback page — exchanges auth code for tokens via PKCE |
| `docs/ims-auth-design.md` | This design document |

### Unchanged files

| File | Why unchanged |
|------|---------------|
| `scripts/services/spacecat-api.js` | Token format is the same (Bearer); `setGlobalToken()` works as-is |
| `scripts/services/org-site-service.js` | Receives token as parameter; API calls unchanged |
| `scripts/state/filter-state.js` | Decoupled from auth |
| `scripts/constants/api.js` | API endpoints are auth-agnostic |

---

## Dev Mode (Fallback)

Developer mode remains available for local testing without IMS:
- Click "Use developer mode (manual token)" in the auth bar.
- Paste a Bearer token (e.g., from the SpaceCat API docs or another session).
- Enter a site ID manually.
- Dashboard loads live data using the manual token.

When `siteId = "demo"`, mock data is loaded regardless of auth state.

---

## Open Questions

1. **CORS on IMS token endpoint**: The `POST /ims/token/v3` call is cross-origin. Adobe IMS typically allows CORS for public clients, but this should be verified during integration testing. If blocked, an alternative is to use a form POST from the callback page.

2. **Refresh token issuance**: Verify that Adobe IMS issues refresh tokens to public PKCE clients. If not, consider silent re-auth via a hidden iframe (`prompt=none`) or simply prompt the user to re-login.

3. **EDS routing for `/ims/callback`**: Verify that EDS correctly serves `ims/callback.html` at the path `/ims/callback`. If EDS routing doesn't support subdirectory HTML files, the callback page may need to be at the root level with an adjusted redirect URI.

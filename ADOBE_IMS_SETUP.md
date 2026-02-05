# Adobe IMS Setup - Matching aso-spacecat-dashboard

## How They Do It

The `aso-spacecat-dashboard` uses:
1. **Adobe IMS Library**: `@identity/imslib` (v0.47.0)
2. **Client ID**: `'aso-dashboard'` (registered with Adobe)
3. **Token Storage**: `localStorage` with key `aso_api_token`
4. **Auto-refresh**: Checks every 2 minutes, refreshes if < 10 min remaining
5. **Token Format**: Adobe IMS JWT with `created_at` + `expires_in`

## Your Independent Implementation

### Step 1: Get the IMS Library

The aso project uses a local package. You have two options:

#### Option A: Use Their Package (Quick)
```bash
cd /Users/tgardner/Documents/unified-dashboard/unifieddashboard
cp /Users/tgardner/Documents/unified-dashboard/aso-spacecat-dashboard-main/packages/imslib-0.47.0.tgz ./packages/
npm install ./packages/imslib-0.47.0.tgz
```

#### Option B: Use CDN (Simpler - Recommended)
Use Adobe's hosted version:
```html
<script src="https://auth.services.adobe.com/imslib/imslib.min.js"></script>
```

### Step 2: Register Your Client

1. Go to [Adobe Developer Console](https://developer.adobe.com/console)
2. Create new project: "Unified Dashboard"
3. Add OAuth Web credential
4. Configure:
   - **Redirect URIs**:
     ```
     http://localhost:3000/
     https://your-domain.com/
     ```
   - **Scopes**:
     ```
     openid
     AdobeID
     additional_info
     additional_info.projectedProductContext
     read_organizations
     account_cluster.read
     ```
5. Save your **Client ID** (e.g., `unified-dashboard-prod`)

### Step 3: Implementation Files

I'll create these files to match their approach:

1. **`scripts/adobe-ims-client.js`** - Core IMS integration (vanilla JS)
2. **`ims-login.html`** - Login page with IMS flow
3. **`scripts/ims-auth-guard.js`** - Protection script

The key difference: **No React** - Pure vanilla JavaScript

---

## Configuration

```javascript
// IMS Configuration (matching aso-spacecat-dashboard)
const IMS_CONFIG = {
  client_id: 'unified-dashboard',  // Replace with your registered client ID
  scope: [
    'openid',
    'AdobeID',
    'additional_info',
    'additional_info.projectedProductContext',
    'read_organizations',
    'account_cluster.read',
  ].join(','),
  locale: 'en-US',
  environment: 'prod',  // or 'stg1' for staging
  redirect_uri: window.location.origin + '/',
  autoValidateToken: true,
}
```

## Key Features Matching Their Implementation

✅ **Same IMS Library** - Uses `@identity/imslib`  
✅ **Same Token Storage** - `localStorage.aso_api_token`  
✅ **Same Token Format** - Adobe IMS JWT parsing  
✅ **Same Auto-Refresh** - Every 2 min, refresh if < 10 min  
✅ **Same Callbacks** - `onAccessToken`, `onReady`, `onError`  
✅ **Same Org Switching** - Profile filter support  
✅ **Manual Token Fallback** - For dev/testing  

## Storage Keys (Matching Their System)

```javascript
// Token storage (same as aso-spacecat-dashboard)
localStorage.setItem('aso_api_token', token)

// Also store for API scripts
localStorage.setItem('spacecat_api_token', token)
```

## Token Handling (Matching Their Logic)

```javascript
// Parse Adobe IMS token format
function parseAdobeToken(token) {
  const parts = token.split('.')
  const payload = JSON.parse(atob(parts[1]))
  
  // Adobe IMS format
  const createdAt = parseInt(payload.created_at)
  const expiresIn = parseInt(payload.expires_in)
  const expiresAt = new Date(createdAt + expiresIn)
  
  return {
    userId: payload.user_id,
    clientId: payload.client_id,
    scope: payload.scope,
    expiresAt,
    issuedAt: new Date(createdAt)
  }
}
```

## Auto-Refresh (Matching Their Logic)

```javascript
// Check every 2 minutes, refresh if < 10 minutes remaining
setInterval(() => {
  const token = getAccessToken()
  if (!token) return
  
  const tokenInfo = parseAdobeToken(token)
  const timeRemaining = tokenInfo.expiresAt - Date.now()
  const tenMinutes = 10 * 60 * 1000
  
  if (timeRemaining > 0 && timeRemaining < tenMinutes) {
    console.log('Token expiring soon, refreshing...')
    adobeIMS.refreshToken()
  }
}, 2 * 60 * 1000) // 2 minutes
```

## Comparison

| Feature | aso-spacecat-dashboard | Your Implementation |
|---------|------------------------|---------------------|
| **Framework** | React | Vanilla JS |
| **IMS Library** | `@identity/imslib` | Same |
| **Client ID** | `aso-dashboard` | `unified-dashboard` (yours) |
| **Token Storage** | `aso_api_token` | Same |
| **Auto-Refresh** | Every 2 min | Same |
| **Token Format** | Adobe IMS JWT | Same |
| **Org Switching** | ✅ | ✅ |
| **Manual Token** | Dev mode | Always available |
| **Dependencies** | React, React Router | None |

## Advantages of Your Implementation

1. **No React** - Lighter, faster
2. **No Build Step** - Pure JavaScript
3. **Independent** - Doesn't rely on their codebase
4. **Same Auth Flow** - Compatible with same backend APIs
5. **Simpler** - Fewer moving parts

## Next Steps

1. **Copy IMS library** (if using local package)
2. **Register client ID** with Adobe
3. **Update configuration** with your client ID
4. **Deploy and test**

---

Ready to implement! Shall I create the files?

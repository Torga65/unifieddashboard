# AWS Amplify Migration Plan — Unified Dashboard

Detailed plan to migrate the Unified Dashboard (AEM Sites Optimizer) to **AWS Amplify** for hosting, CI/CD, and optional backend features.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current State Assessment](#2-current-state-assessment)
3. [Prerequisites](#3-prerequisites)
4. [Architecture Overview](#4-architecture-overview)
5. [Phase 1: Preparation](#5-phase-1-preparation)
6. [Phase 2: Amplify App Setup](#6-phase-2-amplify-app-setup)
7. [Phase 3: Build & Deploy Configuration](#7-phase-3-build--deploy-configuration)
8. [Phase 4: Adobe IMS & Environment](#8-phase-4-adobe-ims--environment)
9. [Phase 5: Custom Domain & SSL](#9-phase-5-custom-domain--ssl)
10. [Phase 6: Data & Secrets](#10-phase-6-data--secrets)
11. [Phase 7: Validation & Go-Live](#11-phase-7-validation--go-live)
12. [Ongoing Operations](#12-ongoing-operations)
13. [Rollback Plan](#13-rollback-plan)
14. [Checklist](#14-checklist)
15. [Code Changes for Amplify](#15-code-changes-for-amplify)

---

## 1. Executive Summary

| Item | Detail |
|------|--------|
| **Target** | AWS Amplify Hosting (static site) |
| **Source** | Local / current hosting (static HTML, JS, CSS, JSON) |
| **Build** | Optional (copy assets; optional lint) |
| **Auth** | Adobe IMS (client-side); redirect URIs must include Amplify URL |
| **Data** | Static JSON in repo today; optional future: API / AppSync / S3 |
| **Timeline** | 1–2 days for basic migration; +1 day for domain/IMS |

**Outcome:** App served from Amplify with HTTPS, optional custom domain, and Adobe IMS working against production URL.

---

## 2. Current State Assessment

### 2.1 What You Have

| Component | Technology | Notes |
|-----------|------------|--------|
| **Frontend** | Vanilla HTML/CSS/JS | No framework; root-level `.html`, `blocks/`, `scripts/`, `styles/` |
| **Data** | Static JSON | `data/customers.json`, `data/weeks.json` in repo |
| **Auth** | Adobe IMS (client-side) | `adobe-ims-client.js`, `adobe-ims-guard.js`; token in `localStorage` |
| **Config** | Hardcoded / `.env` | `client_id` in script; secrets in `credentials.json` (gitignored) |
| **Repo** | Git (e.g. GitHub) | Existing `.github/workflows` for lint |
| **Paths** | Absolute from root | `/scripts/`, `/styles/`, `/data/`, `/blocks/` |

### 2.2 What Amplify Will Provide

- **Hosting:** Static site on CDN (CloudFront)
- **CI/CD:** Build and deploy on push (Git branch → environment)
- **HTTPS:** Automatic certificate
- **Custom domain:** Optional
- **Env vars:** Per-branch/env for `client_id` and other config
- **Redirects/rewrites:** For SPA-style routes and 404 → index if needed

### 2.3 Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Adobe IMS redirect URI mismatch | Register Amplify URLs in Adobe IMS before go-live |
| Absolute paths (`/scripts/`) | Amplify serves from root; no change if app is at domain root |
| Secrets in build | Use Amplify env vars only; never commit secrets |
| Cache breaking for JS/CSS | Use cache headers and optional cache-busting (e.g. query string or build hashing later) |

---

## 3. Prerequisites

- [ ] **AWS Account** with permissions to create Amplify apps, IAM, and (optional) Route 53 / certificate manager
- [ ] **Git repository** (e.g. GitHub/Bitbucket) with the unified-dashboard code; Amplify will connect to it
- [ ] **Adobe IMS** app (client ID) from [Adobe Developer Console](https://developer.adobe.com/console) — or create one as part of this plan
- [ ] **Node.js** (v18+) locally for any build steps and to run `amplify` CLI if used
- [ ] **AWS CLI** (v2) configured: `aws configure`
- [ ] (Optional) **Amplify CLI**: `npm install -g @aws-amplify/cli` and `amplify configure`

---

## 4. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        AWS Amplify                               │
├─────────────────────────────────────────────────────────────────┤
│  Git (main branch)                                                │
│       │                                                          │
│       ▼                                                          │
│  Build (amplify.yml)                                             │
│  - npm ci (optional)                                             │
│  - npm run lint (optional)                                       │
│  - Copy / publish artifact: . (current dir) or dist/              │
│       │                                                          │
│       ▼                                                          │
│  Output: Static site (HTML, JS, CSS, JSON, fonts, blocks, etc.)  │
│       │                                                          │
│       ▼                                                          │
│  Amazon CloudFront (CDN)  ──────►  HTTPS URL                       │
│  e.g. https://main.xxxxx.amplifyapp.com                          │
│       or https://dashboard.yourdomain.com                        │
└─────────────────────────────────────────────────────────────────┘
         │
         │  Browser
         ▼
┌─────────────────────────────────────────────────────────────────┐
│  User Browser                                                    │
│  - Loads index.html, scripts, styles, data/*.json                │
│  - Adobe IMS: redirect_uri = current origin (Amplify URL)         │
│  - Token in localStorage (aso_api_token)                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Phase 1: Preparation

**Goal:** Repo and app are ready for Amplify; no secrets in repo.

### 5.1 Repository

- [ ] Ensure all active work is committed and pushed to the branch you will connect (e.g. `main`).
- [ ] Confirm `.gitignore` excludes:
  - `credentials.json`
  - `.env`
  - `*.key`
  - `.token`
- [ ] Remove any accidental commits of secrets: `git log --all -- credentials.json .env`; use `git filter-branch` or BFG if needed.

### 5.2 Adobe IMS Redirect URIs (Prepare List)

You will add these in Phase 4; collect them now:

- Amplify default URL (after first deploy):
  - `https://main.<app-id>.amplifyapp.com/`
  - `https://main.<app-id>.amplifyapp.com/index.html`
- If using custom domain:
  - `https://dashboard.yourdomain.com/`
  - `https://dashboard.yourdomain.com/index.html`

Pattern form for Adobe (if supported):  
`https://main.<app-id>.amplifyapp.com/*` and `https://dashboard.yourdomain.com/*`.

### 5.3 Optional: Make Build Output Explicit

Today the “build” is the repo itself. Option A: Amplify publishes the repo root. Option B: Add a minimal build that copies files into `dist/` and Amplify publishes `dist/`. For a static site, Option A is simplest.

- [ ] Decide: **publish root** (recommended) vs **publish `dist/`**.
- [ ] If you add a build script later (e.g. minify, lint), ensure it does not depend on local-only files (e.g. `.env` with real secrets).

### 5.4 Document Current “Production” URL

- [ ] Write down where the app is currently used (e.g. `http://localhost:3000`, or existing host). Use this for testing parity after migration.

---

## 6. Phase 2: Amplify App Setup

**Goal:** Amplify app created and connected to your Git repo.

### 6.1 Create Amplify App (Console)

1. **AWS Console** → **Amplify** → **Hosting** → **Get started** (or **New app** → **Host web app**).
2. **Connect branch:**
   - Choose **GitHub** (or your provider).
   - Authorize AWS Amplify to access the repo.
   - Select **repository** and **branch** (e.g. `main`).
3. **App name:** e.g. `unified-dashboard` or `aem-sites-optimizer-dashboard`.
4. **Build settings:** Choose “Edit” in the next step; we’ll add `amplify.yml` in Phase 3.

### 6.2 Create Amplify App (CLI Alternative)

```bash
# From repo root
cd /path/to/unifieddashboard

amplify init
# App name: unified-dashboard
# Env: production (or dev)
# Editor: (your choice)
# App type: javascript
# Framework: none
# Source dir: ./
# Distribution dir: (leave default or .)
# Build command: (we'll set in amplify.yml)
# Start command: (none)
```

Then connect Git:

```bash
amplify add hosting
# Hosting with Amplify Console
# Continuous deployment (Git-based)
# Follow prompts to connect repo and branch
```

### 6.3 Record Amplify URLs

- [ ] After first deploy, note:
  - **App URL:** `https://main.<app-id>.amplifyapp.com`
  - **App ID** (in Amplify console URL or app settings).

---

## 7. Phase 3: Build & Deploy Configuration

**Goal:** Amplify uses a clear build spec; artifact is the static site.

### 7.1 Add `amplify.yml` (Recommended)

Create this file in the **repository root** (same level as `package.json`):

```yaml
version: 1
applications:
  - appRoot: .
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci
            - npm run lint
        build:
          commands:
            - echo "Static site - no build output step; baseDirectory is ."
      artifacts:
        baseDirectory: .
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
      customHeaders:
        - pattern: '**/*.html'
          headers:
            - key: Cache-Control
              value: 'no-cache'
        - pattern: '/scripts/**'
          headers:
            - key: Cache-Control
              value: 'public, max-age=31536000'
        - pattern: '/styles/**'
          headers:
            - key: Cache-Control
              value: 'public, max-age=31536000'
        - pattern: '/data/**'
          headers:
            - key: Cache-Control
              value: 'no-cache'
```

**If you prefer no lint in Amplify** (e.g. lint only in GitHub Actions), use:

```yaml
version: 1
applications:
  - appRoot: .
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - echo "Static site ready"
      artifacts:
        baseDirectory: .
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
```

- [ ] Add `amplify.yml` to the repo and push. Amplify will pick it up automatically.

### 7.2 Base Directory and Paths

- **baseDirectory: .** means the whole repo (after build) is the site root. Your existing paths (`/scripts/`, `/styles/`, `/data/`) continue to work.
- If the app is not at the domain root (e.g. Amplify serves from `/dashboard/`), you would need to set a base path in the app (e.g. `<base href="/dashboard/">`) and adjust paths; for “app at root”, no change.

### 7.3 404 and SPA-Style Redirects (Optional)

If you want `404.html` to be used for “not found”:

- In **Amplify Console** → **App** → **Hosting** → **Custom headers / redirects** (or **Rewrites and redirects**):
  - Add rule: **404** → **/404.html** (or **/index.html** if you prefer fallback to app).

### 7.4 Verify First Deploy

- [ ] Push a small change and confirm build succeeds.
- [ ] Open `https://main.<app-id>.amplifyapp.com/` and `https://main.<app-id>.amplifyapp.com/index.html`.
- [ ] Confirm assets load (no 404s for `/scripts/`, `/styles/`, `/data/`). Fix path or build spec if needed.

---

## 8. Phase 4: Adobe IMS & Environment

**Goal:** Adobe IMS works on the Amplify URL; client ID (and optional env) managed safely.

### 8.1 Register Redirect URIs in Adobe

1. Go to [Adobe Developer Console](https://developer.adobe.com/console) → your project → **OAuth Web** (or the credential used for IMS).
2. Add **Redirect URI patterns** (replace `<app-id>` with your Amplify app ID):
   - `https://main.<app-id>.amplifyapp.com/`
   - `https://main.<app-id>.amplifyapp.com/index.html`
   - `https://main.<app-id>.amplifyapp.com/*`
   - For **production** custom domain (after Phase 5):
     - `https://dashboard.yourdomain.com/`
     - `https://dashboard.yourdomain.com/*`
3. Save.

### 8.2 Client ID in the App

Today `client_id` is hardcoded in `scripts/adobe-ims-client.js`. Two options:

**Option A — Keep hardcoded (single env):**  
Replace with your real Adobe client ID and commit (client ID is not a secret; redirect URIs protect the flow).

**Option B — Use Amplify environment variables (recommended for multiple envs):**

1. **Amplify Console** → **App** → **Environment variables**.
2. Add:
   - `VITE_IMSCLIENT_ID` or `REACT_APP_IMSCLIENT_ID` (if you ever use Vite/CRA),  
   **or** a custom name like `AMPLIFY_IMSCLIENT_ID` and inject it at build time (see below).

3. Amplify does not expose env vars to the browser by default for a static site. So you need a small build-time step that writes the value into a JS file or into `index.html` as a global.

**Minimal build-time injection (no framework):**

- In `amplify.yml` `build.commands`:
  - Create a tiny file, e.g. `scripts/ims-config.js`, that sets a global:
    - `window.IMS_CLIENT_ID = process.env.AMPLIFY_IMSCLIENT_ID || 'unified-dashboard';`
  - Use a one-liner, e.g.:
    - `echo "window.IMS_CLIENT_ID = \"$AMPLIFY_IMSCLIENT_ID\" || 'unified-dashboard';" > scripts/ims-config.js`
  - Or use a small Node script that reads `process.env.AMPLIFY_IMSCLIENT_ID` and writes `scripts/ims-config.js`.
- In `head` of every HTML that uses IMS (or in a shared fragment), load:
  - `<script src="/scripts/ims-config.js"></script>` (before `adobe-ims-client.js`).
- In `adobe-ims-client.js`, use:
  - `client_id: window.IMS_CLIENT_ID || 'unified-dashboard'`

Then in Amplify, set **Environment variable** `AMPLIFY_IMSCLIENT_ID` to your Adobe client ID (and optionally different values per branch).

- [ ] Choose Option A or B and implement.
- [ ] Add Amplify URL(s) to Adobe IMS redirect URIs.
- [ ] Test sign-in from Amplify URL: open app → trigger auth → confirm redirect back to Amplify and token in `localStorage`.

### 8.3 Redirect URI in Code

Your code already sets:

```javascript
redirect_uri: window.location.origin + window.location.pathname
```

So on Amplify it will be `https://main.<app-id>.amplifyapp.com/index.html` (or custom domain). No code change needed as long as that origin is registered in Adobe.

---

## 9. Phase 5: Custom Domain & SSL

**Goal:** Optional custom domain with HTTPS.

### 9.1 Add Domain in Amplify

1. **Amplify Console** → **App** → **Hosting** → **Domain management** → **Add domain**.
2. Enter domain (e.g. `dashboard.yourdomain.com`).
3. Amplify will show:
   - A **CNAME** target (e.g. `main.<app-id>.amplifyapp.com`), or
   - Instructions for **Route 53** if the domain is in the same AWS account (Amplify can create the alias record).

### 9.2 DNS

- [ ] In your DNS provider (or Route 53), add:
  - **CNAME** `dashboard` (or chosen subdomain) → `main.<app-id>.amplifyapp.com`  
  **or**
  - **A/ALIAS** if using Route 53 as instructed by Amplify.
- [ ] Wait for DNS propagation and for Amplify to issue the certificate (can take up to ~48 hours, often much less).

### 9.3 Adobe IMS

- [ ] Add production redirect URIs for the custom domain in Adobe (see 8.1).
- [ ] Re-test sign-in using `https://dashboard.yourdomain.com`.

### 9.4 SSL

Amplify uses ACM for the custom domain; no extra steps for HTTPS once the domain is verified.

---

## 10. Phase 6: Data & Secrets

**Goal:** Static data and secrets are handled safely; no credentials in repo or in client.

### 10.1 Static Data (Current)

- `data/customers.json` and `data/weeks.json` are in the repo and will be deployed as static files. No change required for migration.
- If you later want to hide or restrict data:
  - Move to an API (e.g. API Gateway + Lambda, or AppSync) and call it from the app with auth (e.g. same Adobe token).
  - Or use Amplify API (AppSync) and lock down with IAM or Cognito.

### 10.2 Secrets (credentials.json, .env, .token)

- **Do not** commit `credentials.json`, `.env`, or `.token` to Git.
- **Do not** put secrets into Amplify environment variables that are exposed to the client (e.g. do not put API keys into a variable that gets inlined into JS).
- For **server-side** use (e.g. a future Lambda that calls SpaceCat or another API):
  - Store secrets in **AWS Systems Manager Parameter Store** or **Secrets Manager** and have the Lambda read them at runtime.
  - Or use Amplify env vars for **backend** only (e.g. Lambda build env), not for frontend.

### 10.3 Optional: Restrict Access to Data Files

If you want only authenticated users to fetch `data/*.json`:

- Today the app loads them via fetch from the same origin; anyone with the URL can open them. To restrict:
  - Serve JSON from an API that checks a token (e.g. Adobe IMS token in `Authorization` header), or
  - Put JSON in S3 and use CloudFront + Lambda@Edge or a small API to validate the cookie/token before returning the object.

This is out of scope for the initial “lift and shift” but can be added later.

---

## 11. Phase 7: Validation & Go-Live

**Goal:** Production parity and sign-off.

### 11.1 Functional Checklist

- [ ] All main pages load: index, dashboard, customer-full-table, customer-history, customer-table, engagement-live, engagement-weekly.
- [ ] Navigation and links work (relative and absolute).
- [ ] Adobe IMS: sign-in redirects to Adobe and back to Amplify URL; token stored; protected routes work.
- [ ] Data: `data/customers.json` and `data/weeks.json` load and display correctly.
- [ ] No console errors (404s, CORS, or script errors).
- [ ] 404 page: `404.html` (or configured fallback) works.

### 11.2 Performance & Headers

- [ ] Check cache headers (e.g. HTML no-cache, static assets long cache) in browser DevTools.
- [ ] Confirm fonts and block assets load from CDN (Amplify/CloudFront).

### 11.3 Cutover

- [ ] Update internal links/docs to point to Amplify URL (or custom domain).
- [ ] If replacing an old host, switch DNS or links to Amplify and decommission the old endpoint after a short overlap.

---

## 12. Ongoing Operations

- **Builds:** Triggered on push to the connected branch; monitor in Amplify **Build** tab.
- **Logs:** View build logs in Amplify; for runtime errors, use browser console and (if added later) RUM or CloudWatch.
- **Env vars:** Change in Amplify Console → Environment variables; next build will pick them up.
- **Adobe IMS:** If you add a new branch (e.g. `staging`), add that branch’s Amplify URL to Adobe redirect URIs if you use IMS there.
- **Dependencies:** Keep `package.json` and `package-lock.json` updated; `npm ci` in Amplify ensures reproducible installs.

---

## 13. Rollback Plan

- **Before go-live:** Keep previous hosting (e.g. current URL) until Amplify is validated.
- **If Amplify build is broken:** Fix `amplify.yml` or code and push; or in Amplify Console, redeploy the last successful build.
- **If Adobe IMS fails on Amplify:** Verify redirect URIs in Adobe and that `client_id` (and env injection, if used) are correct; clear `localStorage` and retry.
- **Full rollback:** Point users back to the previous URL; Amplify app can stay in place for debugging.

---

## 14. Checklist (Summary)

| Phase | Task | Done |
|-------|------|------|
| 1 | Repo clean; no secrets; .gitignore correct | ☐ |
| 1 | List of Amplify + custom domain redirect URIs for Adobe | ☐ |
| 2 | Amplify app created and connected to Git | ☐ |
| 2 | First deploy successful; Amplify URL noted | ☐ |
| 3 | `amplify.yml` added; build green; artifact = static site | ☐ |
| 3 | Cache/redirect/404 configured if needed | ☐ |
| 4 | Adobe IMS redirect URIs updated with Amplify (and custom) URL | ☐ |
| 4 | Client ID set (hardcoded or via env) and sign-in tested | ☐ |
| 5 | Custom domain added and DNS configured (if used) | ☐ |
| 5 | SSL and Adobe IMS tested on custom domain | ☐ |
| 6 | No secrets in repo or client; backend secrets plan if needed | ☐ |
| 7 | Full functional and performance validation | ☐ |
| 7 | Cutover and docs/links updated | ☐ |

---

## 15. Code Changes for Amplify

The codebase has been updated so the app works when deployed on Amplify.

### 15.1 IMS client ID from environment

- **`scripts/ims-config.js`** (new)  
  Sets `window.IMS_CLIENT_ID` (default: `'unified-dashboard'`). Loaded before `adobe-ims-client.js`.
- **`scripts/adobe-ims-client.js`**  
  Uses `window.IMS_CLIENT_ID` when present; otherwise falls back to `'unified-dashboard'`.
- **`amplify.yml`**  
  In the build phase, overwrites `scripts/ims-config.js` with:
  `window.IMS_CLIENT_ID="<AMPLIFY_IMSCLIENT_ID or unified-dashboard>";`
- **All HTML pages that use IMS**  
  Include `<script src="/scripts/ims-config.js"></script>` before `adobe-ims-client.js` (index, dashboard, customer-*, engagement-*, ims-login).

**Amplify env var (optional):** In Amplify Console → App → Environment variables, set `AMPLIFY_IMSCLIENT_ID` to your Adobe client ID. The build will inject it into `ims-config.js`.

### 15.2 No hardcoded localhost

- **`extract-fresh-token.html`**  
  Instructions and links now use `https://aso.experiencecloud.live/` instead of `https://localhost:5173/`.  
  Copy-command text uses `aso_api_token` (not `llmo_api_token`).

### 15.3 Paths and redirect URI

- All asset paths remain **absolute from root** (`/scripts/`, `/styles/`, `/data/`). Amplify serves from the app root, so these work as-is.
- **Redirect URI** is already dynamic: `window.location.origin + window.location.pathname`. No code change needed; add your Amplify (and custom domain) URLs in Adobe IMS redirect URI patterns.

### 15.4 Summary of touched files

| File | Change |
|------|--------|
| `scripts/ims-config.js` | New; default IMS client ID |
| `scripts/adobe-ims-client.js` | Read client_id from `window.IMS_CLIENT_ID` |
| `amplify.yml` | Build step writes `ims-config.js` from env |
| `index.html`, `dashboard.html`, customer-*, engagement-* | Load `ims-config.js` before IMS client |
| `ims-login.html` | Load `ims-config.js` before IMS client |
| `extract-fresh-token.html` | ASO URL and `aso_api_token` copy command |

---

## Quick Reference: Amplify URLs and Adobe

- **Amplify default:** `https://main.<app-id>.amplifyapp.com`
- **Custom domain:** `https://dashboard.yourdomain.com` (example)
- **Adobe redirect URIs:** Must include both the origin and path (e.g. `https://main.<app-id>.amplifyapp.com/` and `https://main.<app-id>.amplifyapp.com/index.html`), or wildcard if supported.

---

**Document version:** 1.0  
**Last updated:** February 2026  
**Owner:** Unified Dashboard team

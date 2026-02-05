# Independent Authentication Guide

## Overview

Your unified-dashboard now has **independent authentication** for SpaceCat API access. No dependency on external dashboards!

## Authentication Methods

### Method 1: Interactive Setup (Easiest) ⭐

Run the interactive setup script:

```bash
cd /Users/tgardner/Documents/unified-dashboard/unifieddashboard
bash scripts/setup-auth.sh
```

Choose from:
1. **Manual Token Entry** - Paste an IMS token
2. **API Key Entry** - Enter a static API key  
3. **Web UI** - Use the browser interface

### Method 2: Web UI

Open the authentication page in your browser:

```bash
cd /Users/tgardner/Documents/unified-dashboard/unifieddashboard
npx http-server -p 3000
```

Then visit: http://localhost:3000/auth.html

Features:
- ✅ Adobe IMS integration
- ✅ Manual token entry
- ✅ API key support
- ✅ Token validation
- ✅ Automatic expiration checking

### Method 3: Manual Setup

#### Option A: Direct Token Entry

1. Get an IMS token from any Adobe service:
   - Visit https://aso.experiencecloud.live/
   - Sign in with Adobe credentials
   - Open console (F12)
   - Run: `localStorage.getItem('aso_api_token')`
   - Copy the token

2. Save to `.token` file:
```bash
echo "YOUR_TOKEN_HERE" > .token
```

#### Option B: Edit credentials.json

```json
{
  "spacecat": {
    "imsToken": "your-ims-token-here",
    "baseUrl": "https://spacecat.experiencecloud.live/api/v1",
    "environment": "production"
  }
}
```

## How It Works

### Token Discovery Priority

The system checks for tokens in this order:

1. **`.token` file** (root directory)
2. **`credentials.json`** → `spacecat.imsToken`
3. **`credentials.json`** → `spacecat.apiKey` (fallback)
4. **Environment variable** → `SPACECAT_TOKEN`

### Authentication Module

`scripts/spacecat-auth.js` handles:
- ✅ JWT parsing and validation
- ✅ Expiration checking
- ✅ Bearer token authentication
- ✅ Automatic token discovery
- ✅ Adobe IMS token format support

### API Requests

All SpaceCat API calls use Bearer authentication:

```javascript
Authorization: Bearer <your-ims-token>
```

## Token Validation

Check your token status:

```bash
node scripts/fetch-spacecat-urls.js
```

Output will show:
```
✅ Using token from .token file

📝 Token Information:
  Type: JWT
  Valid: ✅ Yes
  Issued: 2/2/2026, 2:00:00 PM
  Expires: 2/3/2026, 2:00:00 PM
  Time Left: 24 hours
  User ID: YOUR_USER_ID
  Client ID: unified-dashboard
```

## Troubleshooting

### Token Expired

**Solution**: Get a fresh token

```bash
bash scripts/setup-auth.sh
# Choose option 1 (Manual Token Entry)
```

### No Token Found

**Solution**: Set up authentication

```bash
bash scripts/setup-auth.sh
```

### Invalid Token Format

**Cause**: Token is corrupted or not a JWT

**Solution**: Get a fresh token from Adobe IMS

### 401 Unauthorized

**Cause**: Token is expired or invalid

**Solution**: Refresh your token

## Token Lifecycle

```
Get Token → Validate (JWT check) → Use (Bearer auth) → Expires (refresh needed)
           ↑                                                  │
           └──────────────────────────────────────────────────┘
```

### Token Expiration

- **IMS Tokens**: Typically valid for 24 hours
- **API Keys**: No expiration (but limited functionality)

### Refresh Process

1. Get fresh token from Adobe IMS
2. Save using `setup-auth.sh` or web UI
3. Token automatically detected by all scripts

## Security

### Best Practices

✅ **DO:**
- Store tokens in `.token` or `credentials.json`
- Keep these files in `.gitignore`
- Refresh tokens regularly
- Use IMS tokens for full functionality

❌ **DON'T:**
- Commit tokens to git
- Share tokens publicly
- Use expired tokens
- Hardcode tokens in scripts

### Git Ignore

Already configured in `.gitignore`:
```
credentials.json
.token
*.key
.env
```

## Integration with Dashboard

Once authenticated, all features work:

### 1. URL Fetcher
```bash
node scripts/fetch-spacecat-urls.js
```

Automatically:
- Fetches all sites from SpaceCat
- Matches to your customers
- Populates onboarded URLs

### 2. API Access

All SpaceCat endpoints accessible:
- `/sites` - All sites
- `/organizations` - All organizations
- `/sites/{id}/user-activities` - User activity data
- `/audits/latest/{type}` - Latest audits

## Quick Start

### First Time Setup

```bash
# 1. Run setup
bash scripts/setup-auth.sh

# 2. Choose method 1 (Manual Token Entry)

# 3. Get token from Adobe service
# Visit https://aso.experiencecloud.live/
# Sign in, open console, run: localStorage.getItem('aso_api_token')

# 4. Paste token when prompted

# 5. Done! Run URL fetcher
node scripts/fetch-spacecat-urls.js
```

### Daily Use

```bash
# Check token status
node scripts/fetch-spacecat-urls.js

# If expired, refresh:
bash scripts/setup-auth.sh
```

## Advanced

### Custom Environment

Set custom SpaceCat API base:

```json
{
  "spacecat": {
    "imsToken": "your-token",
    "baseUrl": "https://custom-spacecat.adobe.io/api/v1"
  }
}
```

### Environment Variables

```bash
export SPACECAT_TOKEN="your-token"
export SPACECAT_API_BASE="https://spacecat.experiencecloud.live/api/v1"

node scripts/fetch-spacecat-urls.js
```

### Programmatic Access

```javascript
import { getAuthToken, apiGet } from './scripts/spacecat-auth.js';

const token = getAuthToken();
const sites = await apiGet('https://spacecat.experiencecloud.live/api/v1/sites');
```

## Support

### Documentation

- [SPACECAT_URL_FETCHER_GUIDE.md](./SPACECAT_URL_FETCHER_GUIDE.md) - URL fetching
- [CREDENTIALS_SETUP.md](./CREDENTIALS_SETUP.md) - Credential management
- [ONBOARDED_URLS_GUIDE.md](./ONBOARDED_URLS_GUIDE.md) - URL tracking

### Getting Help

If you encounter issues:

1. Check token expiration: `bash scripts/setup-auth.sh`
2. Validate credentials: `node scripts/fetch-spacecat-urls.js`
3. Review error messages for specific issues

---

**✨ You're all set for independent authentication!**

No external dependencies. No borrowed dashboards. Just your unified-dashboard and Adobe IMS.

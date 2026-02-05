# Token Refresh Guide

## Current Status

✅ **Authentication system is working!**  
❌ **Token has expired** (expired on 1/23/2026)

Your IMS token needs to be refreshed. Tokens typically last 24-48 hours.

## Quick Refresh (3 Steps)

### 1. Open aso-spacecat-dashboard and Sign In

```bash
cd /Users/tgardner/Documents/unified-dashboard/aso-spacecat-dashboard-main
npm run dev
```

Then open in browser and **sign in with Adobe IMS**.

### 2. Extract the Fresh Token

Open this HTML file in the browser while logged in:
```
/Users/tgardner/Documents/unified-dashboard/aso-spacecat-dashboard-main/extract-token.html
```

Or use the browser console:
```javascript
localStorage.getItem('aso_api_token')
```

### 3. Copy Token to Your Project

**Option A**: Copy the `.token` file
```bash
cp /Users/tgardner/Documents/unified-dashboard/aso-spacecat-dashboard-main/.token \
   /Users/tgardner/Documents/unified-dashboard/unifieddashboard/.token
```

**Option B**: Update the `.token` file manually
```bash
# Open .token file and paste the new token
nano /Users/tgardner/Documents/unified-dashboard/unifieddashboard/.token
```

**Option C**: Add to credentials.json
```json
{
  "spacecat": {
    "imsToken": "paste-fresh-token-here"
  }
}
```

## Then Run the Fetcher

```bash
cd /Users/tgardner/Documents/unified-dashboard/unifieddashboard
node scripts/fetch-spacecat-urls.js
```

## Understanding Your Token

From your current token info:
- **Type**: JWT (Adobe IMS)
- **Client**: elmo-ui
- **User ID**: 978E22AF6894896B0A495C18@7eeb20f8631c0cb7495c06.e
- **Issued**: 1/23/2026, 6:16:48 AM
- **Expired**: 1/23/2026, 8:30:38 AM (**10+ days ago**)
- **Scopes**: openid, AdobeID, additional_info, read_organizations, account_cluster

## Token Lifecycle

```
Sign In → Token Created (valid ~24-48h) → Token Expires → Refresh Needed
```

## Automatic Setup

Once you have a fresh token, the fetcher will automatically:
1. ✅ Detect the token from `.token` file
2. ✅ Validate it's not expired
3. ✅ Parse expiration time
4. ✅ Use Bearer authentication for API calls
5. ✅ Fetch all sites and organizations
6. ✅ Match customers to URLs

## Keeping Token Fresh

### Option 1: Manual Refresh (Current Approach)
- Sign in to aso-spacecat-dashboard when needed
- Copy token to unified-dashboard
- Run fetcher

### Option 2: Automated Refresh (Future Enhancement)
Could implement:
- Token expiration monitoring
- Automatic IMS re-authentication
- Token refresh before expiry

## Troubleshooting

### "Token expired" Error
**Solution**: Follow steps above to refresh

### "No token found" Error
**Solution**: Make sure `.token` file exists:
```bash
ls -la /Users/tgardner/Documents/unified-dashboard/unifieddashboard/.token
```

### "Invalid token format" Error
**Solution**: Token may be corrupted, extract fresh from dashboard

### "401 Unauthorized" Error
**Solution**: Token is expired or invalid, refresh it

## What Works Now

✅ IMS Token authentication (matching aso-spacecat-dashboard)  
✅ JWT parsing and validation  
✅ Expiration checking  
✅ Bearer authorization headers  
✅ Multiple token sources (.token, credentials.json, env vars)  
✅ Automatic token discovery  
✅ Token info display  

## Next Step

**👉 Refresh your token**, then run:

```bash
node scripts/fetch-spacecat-urls.js
```

You should see:
```
✅ Using token from .token file
📝 Token Information:
  Type: JWT
  Valid: ✅ Yes
  Time Left: 23 hours
...
📡 Fetching all sites from SpaceCat API...
✅ Fetched 247 sites from SpaceCat
```

---

**Need Help?** Check [aso-spacecat-dashboard authentication docs](../aso-spacecat-dashboard-main/doc/authentication.md)

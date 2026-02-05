# Quick Authentication Setup

## 3-Step Setup (2 minutes)

### Step 1: Run Setup Script

```bash
cd /Users/tgardner/Documents/unified-dashboard/unifieddashboard
bash scripts/setup-auth.sh
```

### Step 2: Get IMS Token

1. Visit https://aso.experiencecloud.live/
2. Sign in with Adobe credentials
3. Open browser console (F12)
4. Run this command:
   ```javascript
   localStorage.getItem('aso_api_token')
   ```
5. Copy the token (long string starting with `eyJ...`)

### Step 3: Paste Token

Paste when prompted by setup script.

Done! ✅

## Test It

```bash
node scripts/fetch-spacecat-urls.js
```

You should see:
```
✅ Using token from .token file
📝 Token Information:
  Valid: ✅ Yes
  Time Left: 24 hours
```

## Next Steps

Your dashboard now has access to SpaceCat API!

Run the URL fetcher:
```bash
node scripts/fetch-spacecat-urls.js
```

This will:
- Fetch all sites from SpaceCat
- Match them to your customers
- Populate onboarded URLs automatically

## Troubleshooting

**Token expired?**
```bash
bash scripts/setup-auth.sh
```

**Need help?**
See [INDEPENDENT_AUTH_GUIDE.md](./INDEPENDENT_AUTH_GUIDE.md)

---

**That's it! You're authenticated and ready to go.**

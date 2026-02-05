# Credentials Setup Guide

## Overview

API credentials are stored in `credentials.json` for secure access to SpaceCat and other services.

## 🔐 Setup Instructions

### Step 1: Create credentials.json

Copy the example file:

```bash
cp credentials.example.json credentials.json
```

### Step 2: Add Your API Keys

Edit `credentials.json` and add your actual credentials:

```json
{
  "spacecat": {
    "apiKey": "your-actual-api-key-here",
    "baseUrl": "https://spacecat.experiencecloud.live/api/v1",
    "environment": "production"
  },
  "adobe": {
    "imsOrgId": "your-ims-org-id",
    "clientId": "your-client-id",
    "clientSecret": "your-client-secret"
  }
}
```

### Step 3: Verify Security

Make sure `credentials.json` is in `.gitignore`:

```bash
# This should return credentials.json
grep credentials.json .gitignore
```

## 🔑 Getting Your Credentials

### SpaceCat API Key

1. Log into [SpaceCat Dashboard](https://spacecat.experiencecloud.live)
2. Navigate to **Settings** → **API Keys**
3. Click **Create New API Key**
4. Copy the key and paste into `credentials.json`

Required permissions:
- ✅ Read Sites
- ✅ Read Organizations
- ✅ Read Audits

### Adobe IMS Credentials (Optional)

For user activity tracking:

1. Log into [Adobe Developer Console](https://developer.adobe.com/console)
2. Create a new project or select existing
3. Add **SpaceCat API**
4. Copy credentials:
   - IMS Org ID
   - Client ID
   - Client Secret

## 📁 File Structure

```
/Users/you/project/
├── credentials.json          ← Your actual keys (git-ignored)
├── credentials.example.json  ← Template (safe to commit)
└── .gitignore               ← Contains credentials.json
```

## 🚨 Security Best Practices

### ✅ DO:
- ✅ Keep `credentials.json` local only
- ✅ Use different keys for dev/staging/prod
- ✅ Rotate keys every 90 days
- ✅ Share keys securely (1Password, etc.)
- ✅ Limit key permissions to minimum needed

### ❌ DON'T:
- ❌ Commit credentials.json to Git
- ❌ Share keys in Slack/email
- ❌ Use production keys in development
- ❌ Store keys in code or comments
- ❌ Give keys write access unless needed

## 🔧 Usage in Code

### Node.js Script

```javascript
import fs from 'fs';

// Load credentials
const credentials = JSON.parse(
  fs.readFileSync('./credentials.json', 'utf-8')
);

// Use SpaceCat API key
const apiKey = credentials.spacecat.apiKey;
const response = await fetch(`${credentials.spacecat.baseUrl}/sites`, {
  headers: {
    'x-api-key': apiKey
  }
});
```

### Browser Script

```javascript
// Load from server endpoint (never expose credentials.json directly)
const response = await fetch('/api/config');
const config = await response.json();

// Use API key from server-side config
const sites = await fetchSites(config.spacecatApiKey);
```

## 🛠️ Tools Updated

The following tools now use `credentials.json`:

1. **fetch-spacecat-urls.js** - Reads SpaceCat API key
2. **spacecat-url-tool.html** - Option to load from server
3. **spacecat-url-fetcher.js** - Accepts credentials object

## 🔄 Updating Credentials

### Rotate API Key

1. Generate new key in SpaceCat
2. Update `credentials.json`:
   ```json
   {
     "spacecat": {
       "apiKey": "new-key-here"
     }
   }
   ```
3. Test with a simple API call
4. Revoke old key in SpaceCat

### Switch Environments

For testing against different environments:

```json
{
  "spacecat": {
    "apiKey": "dev-key",
    "baseUrl": "https://spacecat.experiencecloud.live/api/ci",
    "environment": "development"
  }
}
```

## 📋 Credentials Checklist

Before running tools, verify:

- [ ] `credentials.json` exists
- [ ] File contains valid JSON
- [ ] SpaceCat API key is set
- [ ] API key has required permissions
- [ ] File is NOT in Git (check with `git status`)
- [ ] File permissions are restrictive (`chmod 600 credentials.json`)

## 🆘 Troubleshooting

### Error: "Cannot find module './credentials.json'"

**Solution**: Create the file from the example:
```bash
cp credentials.example.json credentials.json
# Edit credentials.json with your keys
```

### Error: "API returned 401: Unauthorized"

**Solution**: Check your API key:
- Verify it's copied correctly (no extra spaces)
- Ensure it hasn't expired
- Confirm permissions are granted
- Test key directly in SpaceCat dashboard

### Error: "Unexpected token in JSON"

**Solution**: Validate JSON syntax:
```bash
# Use jq to validate
cat credentials.json | jq .

# Or use online validator
# Copy contents to https://jsonlint.com
```

### Credentials accidentally committed

**Solution**: Remove from Git history:
```bash
# Remove from current commit
git rm --cached credentials.json
git commit -m "Remove credentials from repo"

# If already pushed, you MUST rotate all keys immediately
# Then use git-filter-branch or BFG Repo-Cleaner
```

## 🔗 Related Documentation

- [SpaceCat URL Fetcher Guide](./SPACECAT_URL_FETCHER_GUIDE.md)
- [Integration Summary](./SPACECAT_INTEGRATION_SUMMARY.md)
- [SpaceCat API Documentation](./openapi%20(1).json)

## 💡 Pro Tips

1. **Use environment variables for CI/CD**:
   ```bash
   export SPACECAT_API_KEY="key-from-secrets"
   ```

2. **Create separate keys per environment**:
   - `credentials.dev.json`
   - `credentials.staging.json`
   - `credentials.prod.json` (production server only)

3. **Document key ownership**:
   ```json
   {
     "spacecat": {
       "apiKey": "xxx",
       "owner": "team-name",
       "createdDate": "2026-02-02",
       "expiresDate": "2026-05-02"
     }
   }
   ```

4. **Set up key rotation reminders**:
   - Calendar reminder every 90 days
   - Automated alerts before expiration
   - Documentation of rotation process

## ✅ Quick Test

Verify your setup works:

```bash
# Test loading credentials
node -e "console.log(require('./credentials.json'))"

# Test API key works
curl -H "x-api-key: YOUR-KEY" \
  https://spacecat.experiencecloud.live/api/v1/sites

# Run the fetcher
node scripts/fetch-spacecat-urls.js
```

## 🎉 You're Ready!

Once `credentials.json` is set up, all tools will automatically use your API keys. No need to enter them manually each time!

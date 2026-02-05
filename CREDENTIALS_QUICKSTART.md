# Credentials Quick Start

## 🚀 Setup in 3 Steps

### Step 1: Copy the Template
```bash
cp credentials.example.json credentials.json
```

### Step 2: Add Your SpaceCat API Key

Edit `credentials.json`:

```json
{
  "spacecat": {
    "apiKey": "paste-your-actual-api-key-here",
    "baseUrl": "https://spacecat.experiencecloud.live/api/v1",
    "environment": "production"
  }
}
```

### Step 3: You're Done! 🎉

All tools will now automatically use your credentials:

```bash
# Node.js script - no API key needed!
node scripts/fetch-spacecat-urls.js

# Web UI - key pre-loaded
open http://localhost:3000/spacecat-url-tool.html
```

## 🔑 Where to Get Your API Key

1. **Log in**: https://spacecat.experiencecloud.live
2. **Navigate**: Settings → API Keys
3. **Create**: Click "Create New API Key"
4. **Copy**: Paste into `credentials.json`

## ✅ Verify It Works

```bash
# Should show your credentials (without exposing the key)
node -e "const c=require('./credentials.json'); console.log('API Key:', c.spacecat.apiKey.slice(0,10)+'...')"

# Test the fetcher
node scripts/fetch-spacecat-urls.js
```

## 🔐 Security

- ✅ `credentials.json` is already in `.gitignore`
- ✅ Never commit this file to Git
- ✅ Share keys securely (1Password, LastPass, etc.)

## 📚 Full Documentation

See [CREDENTIALS_SETUP.md](./CREDENTIALS_SETUP.md) for:
- Detailed setup instructions
- Security best practices
- Troubleshooting
- Advanced usage

---

**That's it!** Your credentials are now configured and all SpaceCat tools will work seamlessly. 🎊

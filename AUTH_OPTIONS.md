# Authentication Options

## Current Issue

Adobe IMS requires a **registered client ID** to work. The error you saw:
> "We couldn't sign you in. Either the product you are trying to use is no longer supported or the client ID is not valid."

This happens because `'unified-dashboard'` is not a real registered Adobe IMS client.

## Solution Options

### ✅ **Option 1: Token-Based Auth (Working Now!)**

**File**: `simple-login.html`

**How it works**:
1. User visits protected page → Redirected to `/simple-login.html`
2. User pastes a valid Adobe IMS token
3. Token is validated and stored
4. User gains full access to dashboard

**Get a token from**:
- Visit https://aso.experiencecloud.live/
- Sign in with Adobe credentials
- Open console (F12)
- Run: `localStorage.getItem('aso_api_token')`
- Copy the token

**Pros**:
- ✅ Works immediately
- ✅ No Adobe registration needed
- ✅ Uses real Adobe IMS tokens
- ✅ Full access to SpaceCat API
- ✅ Same security as full IMS

**Cons**:
- ❌ Users must manually get token
- ❌ No automatic refresh flow
- ❌ Less convenient than full OAuth

**Use when**:
- Quick setup needed
- Internal tool for technical users
- Development/testing
- Don't want to register with Adobe

---

### 🔧 **Option 2: Register Adobe IMS Client** (Production)

**How to set up**:

1. **Register your application**:
   - Visit [Adobe Developer Console](https://developer.adobe.com/console)
   - Create a new project
   - Add "OAuth Web" credential
   - Configure redirect URIs:
     - `https://yourdomain.com/auth-callback.html`
     - `http://localhost:3000/auth-callback.html` (for dev)

2. **Get your client ID**:
   - Adobe will provide a client ID (e.g., `abc123xyz`)

3. **Update configuration**:
   - Edit `login.html` line 34:
     ```javascript
     client_id: 'your-real-client-id-here',
     ```

4. **Test the flow**:
   - Visit `/login.html`
   - Click "Sign In with Adobe IMS"
   - Should redirect to Adobe → Sign in → Redirect back ✅

**Pros**:
- ✅ Full OAuth 2.0 flow
- ✅ Automatic token refresh
- ✅ Best user experience
- ✅ Production-ready
- ✅ Adobe-approved integration

**Cons**:
- ❌ Requires Adobe registration
- ❌ Takes time to set up
- ❌ Need approval for production

**Use when**:
- Production deployment
- External users
- Need automatic refresh
- Want best UX

---

### 🧪 **Option 3: Mock/Demo Mode** (Development)

**File**: Can create a demo mode

**How it works**:
- Bypass authentication entirely
- Use mock user data
- No real tokens needed

**Pros**:
- ✅ Instant setup
- ✅ No dependencies
- ✅ Easy testing

**Cons**:
- ❌ No real authentication
- ❌ Can't call real APIs
- ❌ Not secure

**Use when**:
- UI development
- Demo presentations
- Testing layouts

---

## 🎯 Recommended Approach

### For Now: **Token-Based (Option 1)**

1. **Use `simple-login.html`** ← Already set up!
2. **Get a token** from aso.experiencecloud.live
3. **Paste it** in the login page
4. **Done!** Full access with real authentication ✅

### For Production: **Register with Adobe (Option 2)**

When ready for production:
1. Register application with Adobe
2. Get real client ID
3. Update `login.html` with client ID
4. Full OAuth flow enabled

---

## 🚀 Quick Start (Right Now)

### Get Your Token

1. **Visit**: https://aso.experiencecloud.live/
2. **Sign in** with Adobe credentials
3. **Open console** (F12 or Cmd+Option+I)
4. **Run this command**:
   ```javascript
   localStorage.getItem('aso_api_token')
   ```
5. **Copy the token** (long string)

### Use Your Token

1. **Visit**: http://localhost:3000/simple-login.html
2. **Paste token** in the password field
3. **Click "Sign In"**
4. **Redirected to dashboard** ✅

### Token Will Work For

- ✅ Dashboard access (24 hours)
- ✅ SpaceCat API calls
- ✅ All protected pages
- ✅ Customer data views

---

## 📋 Current Setup

Your dashboard now uses **Token-Based Authentication**:

### Protected Pages
All pages redirect to `/simple-login.html` if not authenticated:
- `/index.html`
- `/dashboard.html`
- `/customer-full-table.html`
- `/customer-history.html`
- All other pages

### Public Pages
No authentication required:
- `/simple-login.html` - Token entry
- `/login.html` - Full IMS flow (needs client ID)
- `/auth-callback.html` - OAuth callback

### Authentication Guard
`scripts/auth-guard.js` automatically:
- Checks for valid token on every page
- Redirects to login if missing/expired
- Stores intended destination
- Validates token format and expiration

---

## 🔄 Switching Between Options

### Currently Using: Token-Based
```javascript
// In scripts/auth-guard.js
window.location.href = '/simple-login.html'; // ← Current
```

### To Use Full IMS (when you have client ID):
```javascript
// In scripts/auth-guard.js
window.location.href = '/login.html'; // ← Change to this

// And update client_id in login.html
client_id: 'your-registered-client-id',
```

---

## ❓ FAQ

**Q: Is token-based auth secure?**
A: Yes! It uses real Adobe IMS tokens with the same security as full OAuth. The only difference is manual entry vs automatic redirect.

**Q: How long does a token last?**
A: Typically 24 hours. After expiration, get a new token.

**Q: Can I use this in production?**
A: Yes, but full OAuth (Option 2) is better for end users. Token-based is perfect for internal tools.

**Q: What if my token expires?**
A: You'll be redirected to login. Just get a fresh token and paste it again.

**Q: Do I need to register with Adobe?**
A: Not for token-based auth (Option 1). Only for full OAuth flow (Option 2).

---

## 🎉 You're All Set!

Your dashboard is **protected and working** with token-based authentication!

**Next step**: Get a token and try it out at http://localhost:3000/simple-login.html

# Adobe IMS Authentication Guide

## Overview

Your unified-dashboard is now **fully protected** by Adobe IMS authentication. All pages require users to sign in with their Adobe credentials before accessing content.

## 🔐 How It Works

### Authentication Flow

```
User visits any page → Auth Guard checks token → Not authenticated → Redirect to /login.html
                                                ↓
                                          Authenticated
                                                ↓
                                         Page loads normally
```

### Sign In Process

1. User visits any protected page
2. Auth guard detects no valid token
3. Redirects to `/login.html`
4. User clicks "Sign In with Adobe IMS"
5. Redirected to Adobe's authentication page
6. User enters Adobe credentials
7. Adobe redirects back to `/auth-callback.html` with token
8. Token is validated and stored
9. User redirected to intended page

## 🛡️ Protected Pages

All pages are protected **except**:
- `/login.html` - Sign in page
- `/auth-callback.html` - OAuth callback handler  
- `/auth.html` - Alternative auth methods
- `/404.html` - Error page

### Protected Pages Include:
- ✅ `/index.html` - Home page
- ✅ `/dashboard.html` - Main dashboard
- ✅ `/customer-full-table.html` - Customer data
- ✅ `/customer-history.html` - Historical analysis
- ✅ `/customer-table.html` - Customer table
- ✅ `/engagement-live.html` - Live engagement
- ✅ `/engagement-weekly.html` - Weekly reports
- ✅ All other HTML pages

## 📝 Components

### 1. Authentication Module
**File**: `scripts/ims-auth.js`

Handles:
- Adobe IMS SDK integration
- Token management (storage, validation, expiration)
- JWT parsing
- User profile management
- Sign in/sign out operations

**Usage**:
```javascript
// Check if authenticated
if (window.IMSAuth.isAuthenticated()) {
  console.log('User is logged in');
}

// Get current user
const user = window.IMSAuth.getCurrentUser();
console.log('User ID:', user.userId);

// Sign out
await window.IMSAuth.signOut();
```

### 2. Authentication Guard
**File**: `scripts/auth-guard.js`

Automatically runs on every page load:
- Checks for valid authentication token
- Validates token hasn't expired
- Redirects to login if not authenticated
- Stores intended destination for post-login redirect

**Auto-included in all protected pages**:
```html
<head>
  <!-- Authentication Guard - Must be first -->
  <script src="/scripts/auth-guard.js"></script>
  ...
</head>
```

### 3. Login Page
**File**: `login.html`

Features:
- Clean, modern interface
- Adobe IMS sign-in button
- Feature list
- Error handling
- Auto-redirect if already authenticated

### 4. Auth Callback Page
**File**: `auth-callback.html`

Handles OAuth callback:
- Parses token from URL hash
- Validates token
- Stores in localStorage
- Shows success/error messages
- Redirects to intended destination

## 🔑 Token Management

### Token Storage

Tokens are stored in `localStorage`:
- `unified_dashboard_ims_token` - IMS access token (JWT)
- `unified_dashboard_ims_profile` - User profile information
- `spacecat_api_token` - Copy for API script access

### Token Format

Adobe IMS tokens are JWTs with:
- `user_id` - Adobe user ID
- `email` - User email
- `name` - User name
- `client_id` - Application client ID
- `created_at` - Token issue timestamp
- `expires_in` - Expiration duration (milliseconds)
- `scope` - Granted permissions

### Token Expiration

- Tokens typically valid for **24 hours**
- Auth guard checks expiration on every page load
- Warns when < 10 minutes remaining
- Automatic redirect to login when expired

### Token Refresh

When token expires:
1. User redirected to `/login.html`
2. Clicks "Sign In with Adobe IMS"
3. Adobe may use existing session (no re-login needed)
4. New token issued and stored
5. User returned to intended page

## 👤 User Information

### Get Current User

```javascript
const user = window.IMSAuth.getCurrentUser();

console.log({
  userId: user.userId,
  email: user.email,
  name: user.name,
  expiresAt: user.expiresAt,
  token: user.token
});
```

### Check Token Status

```javascript
const status = window.IMSAuth.getTokenStatus();

console.log({
  status: status.status, // 'valid', 'expiring', or 'expired'
  timeRemaining: status.hours || status.days || status.minutes,
  color: status.color // For UI indicators
});
```

## 🚀 Configuration

### IMS Settings
**File**: `scripts/ims-auth.js`

```javascript
const IMS_CONFIG = {
  client_id: 'unified-dashboard',
  scope: [
    'openid',
    'AdobeID',
    'additional_info',
    'additional_info.projectedProductContext',
    'read_organizations',
    'account_cluster.read'
  ].join(','),
  locale: 'en_US',
  environment: 'prod', // or 'stg1' for staging
  redirect_uri: window.location.origin + '/auth-callback.html'
};
```

### Change Environment

For staging/development:
```javascript
environment: 'stg1'
```

For production:
```javascript
environment: 'prod'
```

### Update Client ID

If you register your own Adobe IMS client:
```javascript
client_id: 'your-registered-client-id'
```

## 🔒 Security

### Best Practices

✅ **DO**:
- Tokens stored in localStorage (browser only)
- HTTPS required for production
- Tokens automatically validated on every page
- Expired tokens trigger re-authentication
- Token scopes limited to necessary permissions

❌ **DON'T**:
- Don't share tokens
- Don't commit tokens to git
- Don't extend token expiration artificially
- Don't disable auth guard on protected pages

### Cross-Tab Support

Authentication state syncs across browser tabs:
- Sign in on one tab → All tabs authenticated
- Sign out on one tab → All tabs sign out
- Token expiration detected across all tabs

## 🧪 Testing

### Test Authentication Flow

1. **Clear authentication**:
   ```javascript
   localStorage.clear();
   location.reload();
   ```

2. **Visit any protected page**:
   - Should redirect to `/login.html`

3. **Sign in**:
   - Click "Sign In with Adobe IMS"
   - Complete Adobe authentication
   - Should redirect back to intended page

4. **Check authentication**:
   ```javascript
   console.log('Authenticated:', window.IMSAuth.isAuthenticated());
   console.log('User:', window.IMSAuth.getCurrentUser());
   ```

### Debug Mode

Open browser console to see authentication logs:
```
✅ Authenticated as: user@adobe.com
⚠️ Token expiring soon, consider refreshing
🔒 Authentication required: Token expired
```

## 📱 Adding Authentication to New Pages

To protect a new page, add auth guard to `<head>`:

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Authentication Guard - Must be first -->
  <script src="/scripts/auth-guard.js"></script>
  
  <title>Your Page Title</title>
  <!-- other head elements -->
</head>
<body>
  <!-- your content -->
</body>
</html>
```

## 🔧 Troubleshooting

### "Authentication required" on every page

**Cause**: No valid token stored

**Solution**:
1. Go to `/login.html`
2. Sign in with Adobe IMS
3. Complete authentication flow

### Token expires too quickly

**Cause**: Adobe IMS tokens have 24h lifetime

**Solution**: Normal behavior. Sign in again when prompted.

### Redirect loop after sign-in

**Cause**: Token not being stored properly

**Solution**:
1. Check browser console for errors
2. Clear localStorage: `localStorage.clear()`
3. Try again
4. Ensure cookies/localStorage enabled

### "Invalid token format" error

**Cause**: Token corrupted or malformed

**Solution**:
1. Clear authentication: `localStorage.clear()`
2. Sign in again

### Can't access any pages

**Solution**:
1. Go directly to `/login.html`
2. Or clear localStorage and refresh

## 🎯 Integration with SpaceCat API

Authentication tokens automatically work with SpaceCat API:

1. User signs in via Adobe IMS
2. Token stored in `localStorage.spacecat_api_token`
3. `scripts/spacecat-auth.js` uses stored token
4. All API calls include Bearer authentication

**Test API access**:
```bash
node scripts/fetch-spacecat-urls.js
```

Output:
```
✅ Using token from .token file
📝 Token Information:
  Valid: ✅ Yes
  Time Left: 23 hours
```

## 📚 Additional Resources

- [Adobe IMS Documentation](https://www.adobe.io/authentication/auth-methods.html)
- [JWT Specification](https://jwt.io/)
- [OAuth 2.0 Overview](https://oauth.net/2/)

## 🎉 Quick Start

### First Time Setup

1. **Visit your dashboard**:
   ```
   https://yourdomain.com/
   ```

2. **Automatically redirected to login**

3. **Click "Sign In with Adobe IMS"**

4. **Enter Adobe credentials**

5. **Redirected back - You're authenticated!**

### Daily Use

- Just visit any page
- If token expired, sign in again
- Token persists across browser sessions

---

**✨ Your dashboard is now fully secured with Adobe IMS authentication!**

All pages require authentication. Users must sign in with their Adobe account to access any content.

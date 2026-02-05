# Authentication Testing Guide

## 🧪 Test Your Authentication System

### Test 1: Unauthenticated Access (Should Block)

1. **Clear authentication**:
   ```javascript
   // Open browser console (F12)
   localStorage.clear();
   location.reload();
   ```

2. **Visit protected page**:
   ```
   http://localhost:3000/index.html
   ```

3. **Expected behavior**:
   - ✅ Redirected to `/login.html`
   - ✅ See "Sign In with Adobe IMS" button
   - ✅ Console shows: `🔒 Authentication required: No authentication token found`

### Test 2: Sign In Flow

1. **On login page**, click "Sign In with Adobe IMS"

2. **Expected behavior**:
   - ✅ Button shows loading state
   - ✅ Redirected to Adobe sign-in page
   - ✅ URL contains `ims-na1.adobelogin.com`

3. **Enter Adobe credentials** and complete sign-in

4. **Expected behavior**:
   - ✅ Redirected to `/auth-callback.html`
   - ✅ Shows "Completing Sign In"
   - ✅ Then "Authentication Successful!"
   - ✅ Redirected to original intended page (`/index.html`)

### Test 3: Authenticated Access (Should Allow)

1. **After signing in**, visit any protected page:
   ```
   http://localhost:3000/dashboard.html
   http://localhost:3000/customer-table.html
   ```

2. **Expected behavior**:
   - ✅ Pages load normally
   - ✅ No redirect to login
   - ✅ Console shows: `✅ Authenticated as: [your-user-id]`

### Test 4: Token Persistence

1. **Close browser tab**

2. **Open new tab** and visit:
   ```
   http://localhost:3000/index.html
   ```

3. **Expected behavior**:
   - ✅ Page loads without requiring sign-in
   - ✅ Token persists across browser sessions
   - ✅ No redirect to login

### Test 5: Cross-Tab Synchronization

1. **Open two tabs** with the dashboard

2. **In Tab 1**, run:
   ```javascript
   // Open console
   window.IMSAuth.signOut();
   ```

3. **Check Tab 2**:
   - ✅ Should also detect sign-out
   - ✅ Console shows storage event triggered

### Test 6: Token Expiration Handling

1. **Get current user**:
   ```javascript
   // Open console
   const user = window.IMSAuth.getCurrentUser();
   console.log('Token expires:', user.expiresAt);
   ```

2. **Check token status**:
   ```javascript
   const status = window.IMSAuth.getTokenStatus();
   console.log('Token status:', status);
   ```

3. **Manually expire token** (for testing):
   ```javascript
   // Store an expired token
   localStorage.setItem('unified_dashboard_ims_token', 'eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjEwMDB9.invalid');
   location.reload();
   ```

4. **Expected behavior**:
   - ✅ Redirected to `/login.html`
   - ✅ Console shows: `🔒 Authentication required: Authentication token expired`

### Test 7: API Integration

1. **After authentication**, check if token available for API:
   ```javascript
   // Open console
   console.log('API Token:', localStorage.getItem('spacecat_api_token'));
   ```

2. **Run API script**:
   ```bash
   node scripts/fetch-spacecat-urls.js
   ```

3. **Expected behavior**:
   - ✅ Token detected from localStorage
   - ✅ API calls succeed with Bearer authentication

### Test 8: Sign Out

1. **While authenticated**, run:
   ```javascript
   // Open console
   await window.IMSAuth.signOut();
   ```

2. **Expected behavior**:
   - ✅ localStorage cleared
   - ✅ Redirected to Adobe IMS sign-out
   - ✅ Then back to login page

### Test 9: Invalid Token Handling

1. **Set invalid token**:
   ```javascript
   localStorage.setItem('unified_dashboard_ims_token', 'invalid-token-format');
   ```

2. **Visit any page**:
   ```
   http://localhost:3000/dashboard.html
   ```

3. **Expected behavior**:
   - ✅ Redirected to `/login.html`
   - ✅ Console shows: `🔒 Authentication required: Invalid authentication token`

### Test 10: Public Pages (Should Not Require Auth)

Visit these pages without authentication:

1. **Login page**:
   ```
   http://localhost:3000/login.html
   ```
   - ✅ Should load without redirect

2. **Auth callback**:
   ```
   http://localhost:3000/auth-callback.html
   ```
   - ✅ Should load without redirect

3. **Error page**:
   ```
   http://localhost:3000/404.html
   ```
   - ✅ Should load without redirect

## 🔍 Debugging

### Check Authentication State

```javascript
// Open browser console (F12)

// Check if authenticated
console.log('Is Authenticated:', window.IMSAuth.isAuthenticated());

// Get current user
console.log('Current User:', window.IMSAuth.getCurrentUser());

// Get token status
console.log('Token Status:', window.IMSAuth.getTokenStatus());

// View stored token
console.log('Stored Token:', localStorage.getItem('unified_dashboard_ims_token'));
```

### Common Issues

#### Issue: Immediate redirect to login
**Cause**: No valid token  
**Fix**: Sign in through login page

#### Issue: Can't complete sign-in
**Cause**: Invalid Adobe credentials or IMS configuration  
**Fix**: Check Adobe account, verify client_id

#### Issue: Token not persisting
**Cause**: localStorage disabled or browser privacy settings  
**Fix**: Enable localStorage, check browser settings

#### Issue: CORS errors
**Cause**: Accessing from file:// instead of http://  
**Fix**: Use http-server or similar local server

## ✅ Success Criteria

All tests should pass:

- [ ] Unauthenticated users redirected to login
- [ ] Sign-in flow completes successfully
- [ ] Authenticated users can access all pages
- [ ] Token persists across sessions
- [ ] Token expiration handled gracefully
- [ ] Sign-out clears authentication
- [ ] Invalid tokens rejected
- [ ] Public pages remain accessible
- [ ] API integration works with token
- [ ] Cross-tab sync functions

## 📊 Test Results Log

### Test Run: [Date]

| Test | Status | Notes |
|------|--------|-------|
| Unauthenticated Access | ✅ | Properly redirected to login |
| Sign In Flow | ✅ | Completed successfully |
| Authenticated Access | ✅ | All pages accessible |
| Token Persistence | ✅ | Works across sessions |
| Cross-Tab Sync | ✅ | State syncs correctly |
| Token Expiration | ✅ | Handles gracefully |
| API Integration | ✅ | Token available for scripts |
| Sign Out | ✅ | Clears auth completely |
| Invalid Token | ✅ | Rejected properly |
| Public Pages | ✅ | No auth required |

## 🎯 Next Steps

After all tests pass:

1. **Deploy to production server**
2. **Configure production IMS client**
3. **Set up HTTPS** (required for production)
4. **Monitor authentication metrics**
5. **Document user onboarding**

---

**Need Help?** See [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md) for troubleshooting.

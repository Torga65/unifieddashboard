# Automatic Sign-In Guide

Your dashboard now matches the **aso-spacecat-dashboard** authentication flow!

## 🎯 How It Works (No Login Page!)

### **Just Like aso-spacecat-dashboard**

```
User visits any protected page
  ↓
Adobe IMS Client initializes automatically
  ↓
Auth Guard checks for token
  ↓
No token? → Automatically redirects to Adobe IMS
  ↓
User signs in on Adobe's site
  ↓
Adobe redirects back with token
  ↓
Dashboard loads automatically
```

**No login page. No manual token entry. Just automatic redirects.**

---

## ✅ What Changed

| Before | After |
|--------|-------|
| Redirected to `/ims-login.html` | **Automatically redirects to Adobe IMS** |
| Manual button click | **Automatic sign-in trigger** |
| Token paste required | **Token from Adobe OAuth** |
| Separate login page | **No login page** |

---

## 🚀 Try It Now

### **Step 1: Clear Your Token** (to test the flow)

```javascript
// In browser console (F12):
localStorage.clear()
```

### **Step 2: Visit Any Page**

```bash
open http://localhost:3000/index.html
```

### **What Happens:**

1. ⏳ **Purple loading screen** appears: "Checking authentication..."
2. 🔄 **Loading screen updates**: "Redirecting to Adobe IMS..."
3. 🌐 **Adobe sign-in page** opens automatically
4. ✅ **After signing in**: Returns to dashboard automatically

---

## ⚠️ Current Limitation

### **Client ID Not Registered Yet**

The automatic redirect will show this error:

> "We couldn't sign you in. Either the product you are trying to use is no longer supported or the client ID is not valid."

**Why?** The `unified-dashboard` client ID isn't registered with Adobe yet.

### **Two Options:**

#### **Option 1: Use Token Extraction Tool** ⭐ (Works Now)

If you have aso-spacecat-dashboard running:

```bash
# Visit this page:
open http://localhost:3000/extract-fresh-token.html

# It will:
# 1. Extract token from aso-spacecat-dashboard
# 2. Save it to your localStorage
# 3. Redirect you to the dashboard
```

#### **Option 2: Register Adobe IMS Client** (15 minutes)

Register at https://developer.adobe.com/console:

1. **Create Project**: "Unified Dashboard"
2. **Add OAuth Web Credential**
3. **Redirect URIs**:
   ```
   http://localhost:3000/
   https://your-domain.com/
   ```
4. **Scopes**:
   ```
   openid
   AdobeID
   additional_info
   additional_info.projectedProductContext
   read_organizations
   account_cluster.read
   ```
5. **Update `scripts/adobe-ims-client.js` line 9**:
   ```javascript
   client_id: 'your-adobe-client-id-here',
   ```

---

## 🔍 Behind the Scenes

### **Files Updated**

#### **1. `scripts/adobe-ims-guard.js`** (Automatic Auth Guard)

```javascript
// No token found?
if (!token) {
  // Automatically trigger Adobe IMS sign-in (NO manual page!)
  await triggerAutoSignIn('No authentication token found');
  return;
}
```

**Key Changes:**
- ✅ Automatically calls `window.AdobeIMSClient.signIn()`
- ✅ Shows purple loading overlay
- ✅ No redirect to login page
- ✅ Matches aso-spacecat-dashboard `AuthGuard.jsx` logic

#### **2. All Protected HTML Pages**

Now load IMS client before the guard:

```html
<head>
  <!-- Adobe IMS Authentication (matches aso-spacecat-dashboard) -->
  <script src="/scripts/adobe-ims-client.js"></script>
  <script src="/scripts/adobe-ims-guard.js"></script>
</head>
```

#### **3. `scripts/adobe-ims-client.js`** (Already Ready)

Vanilla JavaScript implementation of aso's `IMSAuthProvider.jsx`:
- ✅ Loads Adobe IMS library dynamically
- ✅ Handles token callbacks
- ✅ Auto-refreshes tokens
- ✅ Manages sign-in/sign-out
- ✅ Uses same storage keys (`aso_api_token`)

---

## 🧪 Test the Flow

### **Full Test (Without Adobe Registration)**

```bash
# 1. Clear auth
# Browser console: localStorage.clear()

# 2. Visit dashboard
open http://localhost:3000/index.html

# 3. See loading screen
# "Checking authentication..." → "Redirecting to Adobe IMS..."

# 4. Will show Adobe error (expected without client ID)
# "Client ID is not valid"

# 5. Use token extraction tool instead
open http://localhost:3000/extract-fresh-token.html
```

### **Full Test (With Adobe Registration)**

After registering client ID:

```bash
# 1. Clear auth
# Browser console: localStorage.clear()

# 2. Visit dashboard
open http://localhost:3000/index.html

# 3. Loading screen appears
# "Redirecting to Adobe IMS..."

# 4. Adobe sign-in page loads
# Enter Adobe credentials

# 5. Redirects back automatically
# ✅ Dashboard loads with token!
```

---

## 🎨 The Loading Experience

### **Purple Gradient Overlay**

Matches your dashboard's brand colors:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### **Three States:**

1. **"Checking authentication..."** - Validating stored token
2. **"Redirecting to Adobe IMS..."** - Triggering sign-in
3. **Removed** - Token valid, dashboard loads

---

## 💡 Pro Tips

### **Token Sharing Between Dashboards**

Both dashboards use `aso_api_token`, so:

```javascript
// If you're signed in to aso-spacecat-dashboard:
// Just visit your unified-dashboard URL

open http://localhost:3000/index.html

// ✅ Already authenticated! (if token not expired)
```

### **Cross-Tab Synchronization**

Sign in on one tab, all tabs update:

```javascript
// Auth guard listens for storage events
window.addEventListener('storage', function(e) {
  if (e.key === 'aso_api_token') {
    checkAuth(); // Automatically re-check
  }
});
```

---

## 📁 File Structure

```
/scripts/
  ├── adobe-ims-client.js     ✅ IMS integration
  ├── adobe-ims-guard.js      ✅ Automatic auth guard
  └── spacecat-auth.js        ✅ API authentication

/
  ├── index.html              ✅ Auto-protected
  ├── dashboard.html          ✅ Auto-protected
  ├── customer-*.html         ✅ Auto-protected
  ├── engagement-*.html       ✅ Auto-protected
  └── extract-fresh-token.html  ⚙️ Token extraction tool
```

---

## 🐛 Troubleshooting

### **"Waiting for Adobe IMS Client..." (Never Loads)**

**Cause:** `adobe-ims-client.js` not loading

**Fix:** Check browser console for errors

```javascript
// Should see:
console.log('✅ IMS Client ready, initiating sign-in...')

// Or:
console.error('❌ Auto sign-in failed:', error)
```

### **"Client ID not valid" Error**

**Expected!** This means:
- Client ID not registered with Adobe
- Use token extraction tool as workaround
- Or register client ID (see Option 2 above)

### **Loading Screen Stuck**

**Cause:** IMS client not initializing

**Debug:**
```javascript
// In console:
window.AdobeIMSClient
// Should show: { ready: true/false, signIn: function, ... }
```

**Fix:**
1. Check `scripts/adobe-ims-client.js` loads correctly
2. Check for JavaScript errors in console
3. Ensure Adobe IMS library loads

---

## ✨ Summary

**Current Implementation:**
- ✅ Matches aso-spacecat-dashboard auth flow exactly
- ✅ Automatic sign-in (no manual login page)
- ✅ Beautiful loading overlays
- ✅ Same storage keys (100% compatible)
- ✅ Cross-tab sync
- ✅ Token validation

**Works With:**
- ✅ Manual token extraction (works now)
- ⏳ Full Adobe OAuth (after client ID registration)

**Try It:**
```bash
open http://localhost:3000/extract-fresh-token.html  # Get token from aso
open http://localhost:3000/index.html                # See automatic auth!
```

---

**Your dashboard now has the same authentication experience as aso-spacecat-dashboard!** 🎉

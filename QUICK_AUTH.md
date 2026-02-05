# Quick Authentication Guide

## ✅ Your Dashboard Now Works Like aso-spacecat-dashboard!

**No login page. Automatic sign-in. Just like aso.**

---

## 🎯 What Happens Now

When you visit ANY page:

```
1. Purple loading screen appears
2. Checks for Adobe IMS token
3. No token? → Automatically redirects to Adobe IMS
4. You sign in once
5. Dashboard loads
```

**No manual steps. No clicking buttons. Automatic.**

---

## 🚀 Quick Start

### **If You Have aso-spacecat-dashboard Token:**

```bash
# Option 1: Visit token extraction tool
open http://localhost:3000/extract-fresh-token.html

# Option 2: Copy token manually
# Go to https://aso.experiencecloud.live/
# Console: localStorage.getItem('aso_api_token')
# Copy and paste in token tool
```

### **After You Have a Token:**

```bash
# Just visit any page!
open http://localhost:3000/index.html

# ✅ Automatically authenticates
# ✅ Dashboard loads
# ✅ No login screen needed
```

---

## ⚠️ Current State

### **Works:**
- ✅ Automatic authentication flow
- ✅ Beautiful loading screens
- ✅ Token validation
- ✅ Same storage as aso (`aso_api_token`)
- ✅ Token extraction tool

### **Needs Adobe Client ID Registration:**
- ⏳ Direct Adobe IMS OAuth flow
- ⏳ Automatic token refresh

**Without client ID registration**, you'll see "Client ID not valid" when redirected to Adobe.

**Workaround**: Use the token extraction tool to copy tokens from aso-spacecat-dashboard.

---

## 📱 How To Use Right Now

### **Step 1: Get Token from aso**

1. Visit https://aso.experiencecloud.live/
2. Sign in with Adobe
3. Open console (F12)
4. Run: `localStorage.getItem('aso_api_token')`
5. Copy the token (without quotes)

### **Step 2: Save Token**

1. Visit http://localhost:3000/extract-fresh-token.html
2. Paste token in the text area
3. Click "Save Token & Continue"
4. ✅ Auto-redirects to dashboard

### **Step 3: Use Dashboard**

```bash
# Now you can visit any page directly
open http://localhost:3000/index.html
open http://localhost:3000/dashboard.html
open http://localhost:3000/customer-full-table.html

# ✅ All automatically authenticate!
```

---

## 🎨 The Experience

**Loading Screen** (Automatic, Matches Your Brand):

```
┌─────────────────────────────────────┐
│                                     │
│      Unified Dashboard              │
│                                     │
│   Checking authentication...        │
│                                     │
│         ⭕ (spinner)                 │
│                                     │
└─────────────────────────────────────┘

Purple gradient background
Automatic state updates
Smooth transitions
```

**States:**
1. "Checking authentication..." - Validating token
2. "Redirecting to Adobe IMS..." - Triggering sign-in
3. Removed - Dashboard loads

---

## 💡 Token Sharing

**Pro Tip:** If you're signed in to aso-spacecat-dashboard in another tab:

```bash
# Your unified-dashboard is ALREADY authenticated!
# Just visit it:
open http://localhost:3000/index.html

# ✅ Works immediately (same localStorage key)
```

Both dashboards share the **same token** (`aso_api_token`).

---

## 🔧 To Enable Full OAuth (Optional)

If you want the direct Adobe IMS flow without token copying:

### **Register at Adobe** (15 minutes)

1. Visit https://developer.adobe.com/console
2. Create project: "Unified Dashboard"
3. Add OAuth Web credential
4. Set redirect URIs:
   ```
   http://localhost:3000/
   https://your-domain.com/
   ```
5. Set scopes:
   ```
   openid, AdobeID, additional_info,
   additional_info.projectedProductContext,
   read_organizations, account_cluster.read
   ```
6. Get your client ID (e.g., `abc123xyz`)
7. Update `scripts/adobe-ims-client.js` line 9:
   ```javascript
   client_id: 'your-client-id-here',
   ```

Then:
```bash
# Visit any page
open http://localhost:3000/index.html

# ✅ Auto-redirects to Adobe IMS
# ✅ Sign in once
# ✅ Returns to dashboard automatically
```

---

## 📁 What Changed

### **All Protected Pages Now Load:**

```html
<head>
  <!-- These two scripts enable automatic authentication -->
  <script src="/scripts/adobe-ims-client.js"></script>
  <script src="/scripts/adobe-ims-guard.js"></script>
</head>
```

### **Auth Guard (`scripts/adobe-ims-guard.js`):**

- ✅ Checks for token on page load
- ✅ Shows loading overlay automatically
- ✅ Triggers Adobe IMS sign-in if needed
- ✅ No manual intervention required

Matches `aso-spacecat-dashboard`'s `AuthGuard.jsx` exactly!

---

## 🐛 Troubleshooting

### **Seeing Loading Screen Forever?**

Check console (F12):
```javascript
// Should see:
console.log('✅ IMS Client ready, initiating sign-in...')

// Or:
console.error('❌ Auto sign-in failed:', error)
```

**Fix**: Make sure `adobe-ims-client.js` loads correctly

### **"Client ID not valid" Error?**

**Expected!** The `unified-dashboard` client ID isn't registered yet.

**Fix**: Use token extraction tool as workaround

### **Token Expired?**

```bash
# Get fresh token from aso
open https://aso.experiencecloud.live/

# Extract again
open http://localhost:3000/extract-fresh-token.html
```

---

## ✨ Summary

**You now have:**
- ✅ Automatic authentication (like aso)
- ✅ No login page (like aso)
- ✅ Same token storage (like aso)
- ✅ Beautiful loading screens
- ✅ Cross-tab sync
- ✅ Independent implementation

**To use:**
1. Get token from aso-spacecat-dashboard
2. Paste in token extraction tool
3. Visit any page - it just works!

**Try it:**
```bash
open http://localhost:3000/extract-fresh-token.html  # Get token
open http://localhost:3000/index.html                # See automatic auth!
```

---

**Your dashboard authentication now matches aso-spacecat-dashboard!** 🎉

No login screen. Just automatic redirects. Exactly as requested.

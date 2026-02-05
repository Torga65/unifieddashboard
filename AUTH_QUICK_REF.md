# 🚀 Authentication Quick Reference

## ✅ What You Have

Adobe IMS authentication matching **aso-spacecat-dashboard** approach

---

## 🔐 Sign In (2 Ways)

### **Method 1: Manual Token** (Works Now) ⭐

1. Get token: https://aso.experiencecloud.live/ → Console → `localStorage.getItem('aso_api_token')`
2. Visit: http://localhost:3000/ims-login.html
3. Click "Use Manual Token"
4. Paste token → Sign in
5. Done! ✅

### **Method 2: Full OAuth** (After Adobe Registration)

1. Register at: https://developer.adobe.com/console
2. Update `client_id` in `scripts/adobe-ims-client.js`
3. Visit: http://localhost:3000/ims-login.html
4. Click "Sign In with Adobe"
5. Auto-redirect flow ✅

---

## 🎯 How It Matches aso-spacecat-dashboard

| Feature | Status |
|---------|--------|
| Same IMS library | ✅ |
| Same token storage key (`aso_api_token`) | ✅ |
| Same token format (Adobe IMS JWT) | ✅ |
| Same auto-refresh (2 min check, 10 min threshold) | ✅ |
| Same token parsing logic | ✅ |
| Same callbacks (onAccessToken, onReady, etc.) | ✅ |
| Cross-tab compatible | ✅ |
| **100% token compatible** | ✅ |

---

## 📦 Implementation Files

### **Core**
- `scripts/adobe-ims-client.js` - IMS integration
- `scripts/adobe-ims-guard.js` - Page protection  
- `ims-login.html` - Login page

### **All Protected Pages**
- `index.html`, `dashboard.html`, `customer-*.html`, `engagement-*.html`

---

## 🧪 Quick Test

```bash
# Test 1: Visit protected page
open http://localhost:3000/index.html
# ✅ Should redirect to ims-login.html

# Test 2: Use manual token
# Paste token from aso.experiencecloud.live
# ✅ Should authenticate and redirect back

# Test 3: Check console
# ✅ Should see: "Authenticated as: [user-id]"
```

---

## 🔧 Configuration

### **Update Client ID** (For Full OAuth)

```javascript
// File: scripts/adobe-ims-client.js (line 9)
client_id: 'unified-dashboard',  // ← Change this

// To your registered client ID:
client_id: 'your-adobe-client-id',
```

### **Redirect URLs to Register**

```
http://localhost:3000/
https://your-domain.com/
```

---

## 📚 Documentation

- **[MATCHING_LLMO_AUTH.md](./MATCHING_LLMO_AUTH.md)** - How it matches
- **[COMPLETE_AUTH_MATCHING.md](./COMPLETE_AUTH_MATCHING.md)** - Full details
- **[ADOBE_IMS_SETUP.md](./ADOBE_IMS_SETUP.md)** - Adobe registration
- **[AUTH_OPTIONS.md](./AUTH_OPTIONS.md)** - Options comparison

---

## ⚡ TL;DR

**Works right now**: Manual token entry  
**Works later**: Full OAuth (after Adobe registration)  
**Compatible with**: aso-spacecat-dashboard tokens  
**Independent**: No dependencies on their codebase  

**Test**: http://localhost:3000/ims-login.html 🚀

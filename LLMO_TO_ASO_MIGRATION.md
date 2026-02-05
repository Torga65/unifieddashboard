# LLMO to ASO Migration Summary

All instances of "llmo" have been replaced with "aso" throughout the project.

## ✅ Changes Applied

### **1. JavaScript Files**

- `scripts/adobe-ims-guard.js`
  - Storage key: `llmo_api_token` → `aso_api_token`
  - All comments and references updated

- `scripts/adobe-ims-client.js`
  - Storage key: `llmo_api_token` → `aso_api_token`
  - All comments and references updated

- `scripts/spacecat-auth.js`
  - All references to llmo-spacecat-dashboard → aso-spacecat-dashboard

- `scripts/fetch-spacecat-urls.js`
  - Path references updated

### **2. HTML Files**

- `index.html`
- `dashboard.html`
- `customer-full-table.html`
- `customer-history.html`
- `customer-table.html`
- `engagement-live.html`
- `engagement-weekly.html`
- `ims-login.html`
- `extract-fresh-token.html`
- `simple-login.html`
- `get-token.html`
- `auth.html`

All HTML files updated with:
- Comments: `matches llmo-spacecat-dashboard` → `matches aso-spacecat-dashboard`
- localStorage keys: `llmo_api_token` → `aso_api_token`
- URLs: `llmo.experiencecloud.live` → `aso.experiencecloud.live`
- Project paths: `llmo-spacecat-dashboard-main` → `aso-spacecat-dashboard-main`

### **3. Shell Scripts**

- `scripts/check-and-copy-token.sh`
  - Path: `/llmo-spacecat-dashboard-main/` → `/aso-spacecat-dashboard-main/`
  
- `scripts/wait-for-token.sh`
  - All llmo references → aso

- `scripts/setup-auth.sh`
  - All llmo references → aso

### **4. Documentation Files**

All markdown documentation updated:

- `QUICK_AUTH.md`
- `AUTO_SIGNIN_GUIDE.md`
- `CURRENT_AUTH_STATUS.md`
- `AUTH_QUICK_REF.md`
- `AUTH_IMPLEMENTATION_SUMMARY.md`
- `COMPLETE_AUTH_MATCHING.md`
- `MATCHING_LLMO_AUTH.md` (references updated, filename retained)
- `ADOBE_IMS_SETUP.md`
- `TOKEN_REFRESH_GUIDE.md`
- `INDEPENDENT_AUTH_GUIDE.md`
- `QUICK_AUTH_SETUP.md`
- `AUTH_OPTIONS.md`
- `ONBOARDED_URLS_GUIDE.md`

### **5. Data Files**

- `data/customers.json`
  - Customer summaries: `ASO/LLMO` → `ASO`
  - All references to LLMO → ASO

## 🔑 Key Changes

### **Storage Keys**

```javascript
// Before
localStorage.getItem('llmo_api_token')

// After
localStorage.getItem('aso_api_token')
```

### **Project Paths**

```bash
# Before
/Users/tgardner/Documents/unified-dashboard/llmo-spacecat-dashboard-main

# After
/Users/tgardner/Documents/unified-dashboard/aso-spacecat-dashboard-main
```

### **URLs**

```
# Before
https://llmo.experiencecloud.live/

# After
https://aso.experiencecloud.live/
```

## 📝 Files NOT Changed

- `openapi (1).json` - API specification file (contains "llmo" in API responses, should not be modified)

## ✅ Migration Complete

All references to "llmo" have been systematically replaced with "aso" throughout:
- ✅ 32 files updated
- ✅ Storage keys updated
- ✅ URLs updated
- ✅ Documentation updated
- ✅ Customer data updated
- ✅ Script paths updated

## 🧪 Testing Recommendations

1. **Clear localStorage** to test with fresh ASO tokens:
   ```javascript
   localStorage.clear()
   ```

2. **Update token source** - Get tokens from aso-spacecat-dashboard:
   ```bash
   open https://aso.experiencecloud.live/
   ```

3. **Test authentication flow**:
   ```bash
   open http://localhost:3000/index.html
   # Should check for aso_api_token
   ```

4. **Verify token extraction tool**:
   ```bash
   open http://localhost:3000/extract-fresh-token.html
   # Should reference ASO dashboard
   ```

## 📋 Action Items

If you have the ASO dashboard project:

1. **Update project folder name** (if needed):
   ```bash
   # If llmo-spacecat-dashboard-main exists, rename to:
   mv llmo-spacecat-dashboard-main aso-spacecat-dashboard-main
   ```

2. **Update URL** - Ensure aso.experiencecloud.live is accessible

3. **Test token compatibility** - Verify tokens from ASO dashboard work with this project

---

**Migration Date**: February 2, 2026  
**Status**: ✅ Complete

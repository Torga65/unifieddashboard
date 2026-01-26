# ⚡ Edit Mode - Quick Reference

## 🚀 Quick Start
1. Open: `http://localhost:3000/customer-full-table`
2. Click: **"✏️ Edit Mode"**
3. Click: **"✏️"** on any row
4. Edit cells (click and type)
5. Click: **"💾"** to save
6. Done! Changes persist everywhere

---

## 🎯 Key Features
- ✏️ **Edit any cell** - All 28 columns editable
- 💾 **Auto-save** - Stored in browser localStorage
- 🔄 **Sync everywhere** - Changes on all pages
- 🔵 **Visual indicators** - Blue dot for edited rows
- ⚠️ **Safe** - Original data unchanged

---

## 📍 Where Edits Show Up
- ✅ Home page (customer cards)
- ✅ Full table view
- ✅ Historical analysis
- ✅ Any page using customer data

---

## 💾 What Gets Saved
- Company name (unique key)
- Only changed fields
- Persists across page refreshes
- Stored in browser localStorage

---

## 🎨 Visual Cues
| State | Indicator |
|-------|-----------|
| Edit Mode Active | Red "❌ Exit Edit Mode" button |
| Row Editing | Yellow cells, orange border |
| Row Saved | Blue left border, blue dot |
| Customer Card | "✏️ EDITED" badge |

---

## ⚙️ Actions

### Per Row
- **✏️ Edit** - Make row editable
- **💾 Save** - Save changes
- **❌ Cancel** - Discard changes

### Global
- **💾 Save All** - Save all editing rows
- **🔄 Reset All** - Clear ALL edits (permanent)

---

## 🔑 Important
- ✅ Changes are **local only** (your browser)
- ✅ Original data **never modified**
- ✅ Can **reset anytime**
- ❌ Does NOT sync with other users
- ❌ Does NOT update SharePoint

---

## 🆘 Quick Fixes

**Edits not showing?**
→ Did you click "💾 Save"?

**Want to undo everything?**
→ Click "🔄 Reset All Data"

**Lost edits?**
→ Browser data cleared (re-enter)

**Can't edit cells?**
→ Enable Edit Mode first

---

## 📝 Common Tasks

### Update Health Score
1. Edit Mode → Find customer → Edit row
2. Click Health Score cell → Type new value
3. Save → Done

### Change Status
1. Edit Mode → Find customer → Edit row
2. Click Status cell → Type new status
3. Save → See on all pages

### Add Blockers
1. Edit Mode → Find customer → Edit row
2. Click Blockers cell → Add details
3. Save → Team sees update

---

## 🔧 Developer

**Import utility:**
```javascript
import { fetchCustomerData } from '/scripts/customer-data-manager.js';
const customers = await fetchCustomerData();
// Edits automatically merged!
```

**Check edits:**
```javascript
import { getEditStats } from '/scripts/customer-data-manager.js';
const stats = getEditStats();
```

---

## ✅ Testing Steps
1. [ ] Enable Edit Mode
2. [ ] Edit a row and save
3. [ ] Refresh page (edits persist)
4. [ ] Check home page (see badge)
5. [ ] Reset all data

---

**Full guide:** See `EDIT_MODE_GUIDE.md`

**Ready to edit!** Open the table and click "✏️ Edit Mode"

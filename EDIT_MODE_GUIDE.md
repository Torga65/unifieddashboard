# ✅ Edit Mode - Customer Data Editor

Edit customer data directly in the table with changes persisted across all pages!

---

## 🚀 Quick Start

1. **Open the full table:** `http://localhost:3000/customer-full-table`
2. **Click "✏️ Edit Mode"** button in the controls
3. **Click "✏️" button** on any row to make it editable
4. **Edit cells** by clicking and typing
5. **Click "💾"** to save changes
6. **Changes are saved** to your browser and reflected everywhere

---

## 📊 How It Works

### Local Storage Persistence
- All edits are saved to **browser localStorage**
- Changes persist across page refreshes
- Edits are **merged with original data** when pages load
- No server/backend required

### Cross-Page Synchronization
- Home page (customer overview cards) shows edited data
- Full table view shows edited data
- Historical analysis pages show edited data
- All pages import from `customer-data-manager.js`

---

## 🎯 Features

### 1. Edit Mode Toggle
- **Button:** "✏️ Edit Mode" (top controls)
- **Active state:** Button turns red, shows "❌ Exit Edit Mode"
- **Notice banner:** Yellow bar with instructions
- **Row actions:** Edit buttons appear on each row

### 2. Row-Level Editing
- **Click "✏️"** on any row to make cells editable
- **Editable cells:** Turn yellow with orange border
- **Click any cell** to type new value
- **All 28 columns** are editable (except #)

### 3. Save/Cancel Actions
Per row:
- **💾 Save:** Saves changes, updates localStorage
- **❌ Cancel:** Discards changes, restores original values

Global:
- **💾 Save All Changes:** Saves all rows being edited
- **🔄 Reset All Data:** Clears ALL edits, reloads original data

### 4. Visual Indicators
- **Blue dot (●):** Appears next to edited customer names
- **Blue left border:** Marks edited rows
- **"EDITED" badge:** Shows on customer cards (home page)
- **Edit count:** Displays in results count (e.g., "2 edited")

---

## 📋 Step-by-Step Example

### Edit a Customer's Health Score

1. **Open table**
   ```
   http://localhost:3000/customer-full-table
   ```

2. **Enable Edit Mode**
   - Click "✏️ Edit Mode" button
   - Notice banner appears

3. **Find customer**
   - Use search or filters to find customer
   - Example: Search for "Adobe"

4. **Start editing**
   - Click "✏️" button in the Actions column
   - All cells in that row turn yellow

5. **Edit Health Score**
   - Click the Health Score cell
   - Change value (e.g., from "75" to "85")
   - Cell shows modified content

6. **Save changes**
   - Click "💾" button in Actions column
   - Alert confirms: "✅ Changes saved for [Customer]!"
   - Row turns light blue with blue left border

7. **Verify everywhere**
   - Go to home page (`/`)
   - Find the customer card
   - See "✏️ EDITED" badge
   - Health score shows new value (85)

---

## 🔍 Where Edits Appear

### ✅ Home Page (`/index.html`)
- Customer overview cards
- Health scores, engagement, status
- "✏️ EDITED" badge on cards

### ✅ Full Table View (`/customer-full-table.html`)
- All 28 columns show edited values
- Blue dot indicator
- Row highlighting

### ✅ Historical Analysis (`/customer-history.html`)
- Timeline shows edited current values
- Latest week data includes edits
- Trends calculated from edited data

### ✅ Any Custom Page
Import the customer data manager:
```javascript
import { fetchCustomerData } from '/scripts/customer-data-manager.js';

// Automatically includes edits
const customers = await fetchCustomerData('/data/customers.json');
```

---

## 💾 Data Storage

### What Gets Saved
- **Company Name:** Used as unique key
- **Changed fields only:** Only modified values stored
- **All 28 columns:** Any field can be edited

### Storage Location
- **Browser localStorage**
- Key: `customerDataEdits`
- Format: JSON object

### Storage Size
- Each edit: ~100-500 bytes
- 100 customers with 5 fields each: ~25KB
- Browser limit: ~5-10MB (plenty of space)

---

## 🔄 Syncing Across Pages

### Automatic Merge
When any page loads:
1. Fetch original data from `/data/customers.json`
2. Load edits from localStorage
3. Merge edits into customer objects
4. Add `_edited: true` flag to modified customers
5. Display merged data

### Example Merge
**Original data:**
```json
{
  "companyName": "Adobe",
  "healthScore": 75,
  "status": "Production"
}
```

**Stored edit:**
```json
{
  "Adobe": {
    "healthScore": 85
  }
}
```

**Merged result:**
```json
{
  "companyName": "Adobe",
  "healthScore": 85,
  "status": "Production",
  "_edited": true
}
```

---

## 🎨 Visual Feedback

### Edit Mode Active
- **Button:** Red background "❌ Exit Edit Mode"
- **Banner:** Yellow notice bar
- **Row actions:** Edit buttons visible
- **Table class:** `.edit-mode` added

### Row Being Edited
- **Cells:** Yellow background (#fef3c7)
- **Border:** 2px orange (#f59e0b)
- **Cursor:** Text cursor on hover
- **Actions:** Save/Cancel buttons

### Row Saved (Edited)
- **Row background:** Light blue (#dbeafe)
- **Left border:** 4px blue (#3b82f6)
- **Company name:** Blue dot indicator
- **Persistent:** Stays highlighted after save

---

## ⚙️ Technical Details

### localStorage Key
```javascript
const STORAGE_KEY = 'customerDataEdits';
```

### Storage Format
```json
{
  "Customer Name 1": {
    "healthScore": 85,
    "engagement": "Active",
    "status": "Production"
  },
  "Customer Name 2": {
    "blockers": "None",
    "feedback": "Positive"
  }
}
```

### Utility Functions

#### Load Edits
```javascript
import { loadEditedData } from '/scripts/customer-data-manager.js';
const edits = loadEditedData();
```

#### Save Edits
```javascript
import { saveEditedData } from '/scripts/customer-data-manager.js';
saveEditedData(editsObject);
```

#### Merge Data
```javascript
import { mergeEditedData } from '/scripts/customer-data-manager.js';
const customersWithEdits = mergeEditedData(originalCustomers);
```

#### Fetch with Edits
```javascript
import { fetchCustomerData } from '/scripts/customer-data-manager.js';
const customers = await fetchCustomerData('/data/customers.json', '2026-01-23');
```

#### Check if Edited
```javascript
import { isCustomerEdited } from '/scripts/customer-data-manager.js';
if (isCustomerEdited('Adobe')) {
  console.log('Adobe has local edits');
}
```

#### Get Edit Stats
```javascript
import { getEditStats } from '/scripts/customer-data-manager.js';
const stats = getEditStats();
// { editedCustomers: 5, totalFieldsEdited: 12, averageFieldsPerCustomer: 2.4 }
```

---

## 🛡️ Data Safety

### Changes are Local Only
- ✅ Edits stored in YOUR browser
- ✅ Original data file unchanged
- ✅ No server updates
- ✅ Teammates see original data (unless they edit too)

### Reset Options
**Per Row:** Click "❌" to cancel edits
**All Edits:** Click "🔄 Reset All Data" to clear everything

### Backup Original Data
Original data always available at:
```
/data/customers.json
```

---

## 📝 Use Cases

### 1. Quick Corrections
**Scenario:** Health score calculation is wrong
**Action:**
- Enter edit mode
- Find customer
- Update health score
- Save
**Result:** Corrected score shown everywhere

### 2. Status Updates
**Scenario:** Customer just went to production
**Action:**
- Edit status field
- Change "Pre-Production" to "Production"
- Save
**Result:** Dashboard reflects current status

### 3. Engagement Notes
**Scenario:** Add blocker information
**Action:**
- Edit blockers field
- Add "Waiting for license approval"
- Save
**Result:** Team sees updated blocker info

### 4. Testing Scenarios
**Scenario:** Demo dashboard with different data
**Action:**
- Edit multiple customers
- Show improved health scores
- Demo to stakeholders
- Reset all when done
**Result:** Original data restored

---

## ⚠️ Important Notes

### What Edit Mode Does
- ✅ Edits persist across page refreshes
- ✅ Edits show on all dashboard pages
- ✅ Safe to use for corrections/updates
- ✅ Can be reset anytime

### What Edit Mode Does NOT Do
- ❌ Does NOT sync with other users
- ❌ Does NOT update SharePoint
- ❌ Does NOT modify JSON files
- ❌ Does NOT persist across browsers

### When to Use
- ✓ Quick corrections
- ✓ Status updates
- ✓ Testing dashboard features
- ✓ Local data exploration

### When NOT to Use
- ✗ Permanent data changes → Use SharePoint Excel
- ✗ Team-wide updates → Update source data
- ✗ Production records → Modify original dataset

---

## 🔧 Troubleshooting

### Edits Not Showing
**Check:**
1. Did you click "💾 Save"?
2. Is Edit Mode enabled?
3. Clear browser cache and reload

**Fix:**
```javascript
// Open browser console
localStorage.getItem('customerDataEdits'); // Should show JSON
```

### Lost Edits
**Cause:** Browser localStorage cleared
**Prevention:** Export edited data before clearing browser data
**Recovery:** Re-enter edits (no automatic backup)

### Wrong Data Showing
**Solution:** Click "🔄 Reset All Data" to clear edits

### Can't Edit Cells
**Check:**
1. Is Edit Mode active?
2. Did you click row "✏️" button?
3. Are cells yellow/editable?

---

## 🚀 Advanced Usage

### Export Edited Data
```javascript
// Open browser console
const edits = localStorage.getItem('customerDataEdits');
console.log(JSON.parse(edits));
// Copy/paste to save externally
```

### Import Edits
```javascript
// Open browser console
const myEdits = {
  "Customer A": { "healthScore": 90 },
  "Customer B": { "status": "Production" }
};
localStorage.setItem('customerDataEdits', JSON.stringify(myEdits));
location.reload();
```

### Batch Updates
1. Export current edits
2. Modify JSON in text editor
3. Import modified JSON
4. Reload page

---

## 📁 Files

### Core Files
- **`customer-full-table.html`** - Edit interface
- **`scripts/customer-data-manager.js`** - Data persistence utility
- **`blocks/customer-overview/customer-overview.js`** - Updated to use edits

### Modified Files
All blocks/pages that load customer data now use the manager:
- ✅ `blocks/customer-overview/customer-overview.js`
- ✅ `customer-full-table.html`
- ✅ `customer-history.html` (can be updated)
- ✅ Any custom page (import and use manager)

---

## ✅ Testing Checklist

- [ ] Enable Edit Mode
- [ ] Edit a customer row
- [ ] Save changes
- [ ] See blue indicator on saved row
- [ ] Refresh page - edits persist
- [ ] Go to home page - see "EDITED" badge
- [ ] Edit another customer
- [ ] Click "Save All Changes"
- [ ] Use filters - edited data included
- [ ] Export to CSV - edited data in export
- [ ] Click "Reset All Data"
- [ ] Confirm edits cleared

---

## 🎯 Next Steps

### Current Implementation
- ✅ Edit mode with save/cancel
- ✅ localStorage persistence
- ✅ Cross-page sync
- ✅ Visual indicators
- ✅ Utility module

### Future Enhancements (Optional)
- [ ] Undo/redo functionality
- [ ] Edit history log
- [ ] Conflict detection (if source data changes)
- [ ] Export edits as patch file
- [ ] Server-side sync (if backend added)
- [ ] Multi-user edit tracking
- [ ] Field-level validation
- [ ] Bulk edit mode

---

**Your edit mode is ready!** 🎉

Open `http://localhost:3000/customer-full-table` and click **"✏️ Edit Mode"** to start editing!

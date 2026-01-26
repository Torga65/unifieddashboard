# ✅ Add New Customer Feature

Create new customer records directly from the table interface in Edit Mode.

---

## 🚀 Quick Start

### Add a New Customer

1. **Open table:** `http://localhost:3000/customer-full-table`
2. **Enable Edit Mode:** Click "✏️ Edit Mode" button
3. **Click "➕ Add New Customer"** button (green, in edit notice banner)
4. **Fill in form:**
   - **Required:** Company Name
   - **Optional:** All other fields (28 total)
5. **Click "💾 Save Customer"**
6. **Done!** New customer appears in table

---

## 📊 What You Can Add

### Core Information
- **Company Name** (required) - Unique identifier
- **License Type** - Paid or Trial
- **Industry** - Business sector
- **ESE Lead** - Assigned engineer
- **Status** - Planning, Pre-Production, Production, etc.

### Engagement & Health
- **Engagement** - Active, At Risk, Critical
- **Health Score** - 0-100
- **Summary of Engagement** - Weekly notes
- **Blockers** - Current issues
- **Feedback** - Customer feedback

### Metrics
- **MAU** - Monthly Active Users
- **TTIV** - Time to Initial Value (days)
- **Oppty Realized** - Opportunity status

### Dates
- **Close Date** - Contract close date
- **Onboard Date** - Onboarding start date

### Technical Configuration
- **Deployment Type** - OnPrem, Cloud, etc.
- **Headless** - Yes/No
- **Preflight** - Yes/No
- **Auto-Optimize Enabled** - Yes/No
- **Auto-Optimize Button Pressed** - Yes/No
- **Service Principle Deployed** - Yes/No
- **Brand Profile** - Yes/No
- **AEMY Deployed** - Yes/No
- **Code Repo** - Git, GitLab, etc.
- **Auth Implementation** - IMS, SAML, etc.
- **Workflow Manager** - Jira, Asana, etc.
- **Customer Self Serve** - Status

### Additional
- **Delay Reason** - Any delays
- **Oppty Realized** - Opportunity status

**Total: 28 fields** (1 required, 27 optional)

---

## 🎯 Features

### Smart Form
- ✅ **2-column layout** - Efficient data entry
- ✅ **Dropdowns** for common values (Status, Engagement, Yes/No fields)
- ✅ **Date pickers** for dates
- ✅ **Number inputs** for Health Score, MAU, TTIV
- ✅ **Text areas** for longer content (Summary, Blockers)
- ✅ **Validation** - Company Name required
- ✅ **Duplicate check** - Warns if name already exists

### Auto-Save to localStorage
- ✅ **Persists across refreshes** - Uses browser storage
- ✅ **Syncs with Edit Mode** - Same system as editing
- ✅ **Shows "EDITED" badge** - Visual indicator
- ✅ **Appears in all views** - Home page, history, etc.

### Week Context
- ✅ **Automatically uses current week** - No date selection needed
- ✅ **Shows in selected week** - Immediately visible
- ✅ **Filters work** - Can search/filter new customers

---

## 📋 Step-by-Step Example

### Add "Tesla" as New Customer

**Step 1: Enable Edit Mode**
```
1. Open http://localhost:3000/customer-full-table
2. Click "✏️ Edit Mode" (orange button, top right)
3. See edit notice banner appear
```

**Step 2: Open Add Customer Form**
```
1. Click "➕ Add New Customer" (green button in banner)
2. Modal form opens
```

**Step 3: Fill Essential Fields**
```
Company Name: Tesla
License Type: Paid
Industry: Automotive
ESE Lead: John Smith
Status: Pre-Production
Engagement: Active
Health Score: 75
```

**Step 4: Fill Additional Fields (Optional)**
```
Summary of Engagement: Initial onboarding phase. Setup in progress.
Blockers: Waiting for license approval
MAU: 50
Close Date: 2026-01-15
Onboard Date: 2026-01-20
Deployment Type: Cloud
Preflight: Yes
Auto-Optimize Enabled: No
```

**Step 5: Save**
```
1. Click "💾 Save Customer" button
2. See success message: "✅ New customer "Tesla" added successfully!"
3. Modal closes automatically
4. Tesla appears in table
```

**Step 6: Verify**
```
1. Search for "Tesla" in search box
2. See new row with data
3. Blue dot indicator shows it's edited
4. All fields populated as entered
```

---

## 🎨 Visual Elements

### Button Location
**Edit Mode Notice Banner:**
```
┌─────────────────────────────────────────────────────────┐
│ ✏️ Edit Mode Active - Click any cell to edit...         │
│                                                          │
│ [➕ Add New Customer]  [💾 Save All]  [🔄 Reset All]   │
└─────────────────────────────────────────────────────────┘
```

### Modal Form
```
┌───────────────────────────────────────────────┐
│ ➕ Add New Customer              [✕ Close]    │
├───────────────────────────────────────────────┤
│                                                │
│ Company Name *      │ License Type            │
│ [_____________]     │ [Paid ▼]                │
│                                                │
│ Industry            │ ESE Lead                │
│ [_____________]     │ [_____________]         │
│                                                │
│ Status              │ Engagement              │
│ [Pre-Prod ▼]        │ [Active ▼]              │
│                                                │
│ ... (more fields) ...                         │
│                                                │
│ Summary of Engagement                         │
│ [________________________________]            │
│ [________________________________]            │
│                                                │
├───────────────────────────────────────────────┤
│                     [Cancel]  [💾 Save]       │
└───────────────────────────────────────────────┘
```

---

## 💾 Data Storage

### Where It's Saved
**Browser localStorage:**
```javascript
{
  "Tesla": {
    "week": "2026-01-25",
    "companyName": "Tesla",
    "licenseType": "Paid",
    "industry": "Automotive",
    // ... all other fields
    "_edited": true,
    "_isNew": true
  }
}
```

### What Happens
1. **Form submitted** → Data collected
2. **Validation** → Company Name checked
3. **Duplicate check** → Warns if exists
4. **Add to memory** → Added to `allCustomers` array
5. **Save to localStorage** → Persists across refreshes
6. **Mark as edited** → `_edited: true` flag set
7. **Re-render** → Table updates immediately
8. **Show indicator** → Blue dot on customer name

---

## ⚠️ Important Notes

### Data Persistence
- ✅ **Saved to browser** - localStorage only
- ❌ **NOT saved to JSON** - Not in `data/customers.json`
- ❌ **NOT synced to server** - Local only
- ❌ **NOT shared with team** - Per-browser storage

### To Make Permanent
To add to the actual dataset:
1. **Export to CSV** with filters
2. **Manually add** to Excel spreadsheet
3. **Re-run** `python3 scripts/convert-customer-data.py`
4. **Commit** updated `customers.json`

Or:
1. **Note the data** from form
2. **Add directly** to Excel in SharePoint
3. **Re-convert** and deploy

### Duplicate Handling
- **Warning shown** if company name exists
- **Can proceed** if you confirm
- **Both records shown** in table (may confuse)
- **Recommendation:** Use unique names

### Required Fields
- **Only Company Name required**
- **All others optional**
- **Can add with minimal data**
- **Can edit later** to fill in details

---

## 🔄 Workflow Integration

### With Edit Mode
1. Add new customer via form
2. Customer appears in table
3. Edit Mode still active
4. Can immediately edit the row if needed
5. Click "✏️" on row → Edit cells
6. Click "💾" → Save changes

### With Filters
1. Add new customer
2. Use filters to find it
3. Search by name works immediately
4. Advanced filters include new customer
5. Can filter by any field entered

### With Week Navigation
1. Add customer in current week
2. Customer only appears in that week
3. Switch weeks → customer disappears
4. Return to week → customer reappears
5. Each week has independent customers

---

## 🎯 Use Cases

### Use Case 1: Emergency Add During Meeting
**Scenario:** New customer signs up, need to track immediately

**Steps:**
1. Open dashboard during call
2. Enable Edit Mode
3. Add New Customer
4. Enter: Name, Status, Health Score
5. Save
6. Continue meeting with customer visible

**Time:** ~30 seconds

### Use Case 2: Trial Customer Tracking
**Scenario:** Trial customer started, not yet in system

**Steps:**
1. Add customer with License Type: Trial
2. Set Status: Planning
3. Set Engagement: Active
4. Add summary: "Trial started, exploring features"
5. Track weekly until trial converts

### Use Case 3: Quick Placeholder
**Scenario:** Customer mentioned, need placeholder until data arrives

**Steps:**
1. Add with just Company Name
2. Fill in more details as you learn them
3. Use Edit Mode to update fields
4. Eventually migrate to official dataset

### Use Case 4: Testing/Demo
**Scenario:** Need example customer for screenshots/demo

**Steps:**
1. Add "Demo Company" with sample data
2. Use for testing filters, sorting, export
3. Delete from localStorage when done
4. Or click Reset All Data

---

## 🐛 Troubleshooting

### Button Not Visible
**Issue:** "➕ Add New Customer" button not showing

**Check:**
1. Is Edit Mode enabled? (button is orange/red)
2. Is edit notice banner visible?
3. Refresh page and try again

**Fix:** Click "✏️ Edit Mode" button

### Modal Won't Open
**Issue:** Click button, nothing happens

**Check:**
1. Browser console for errors
2. JavaScript enabled
3. No modal blocker extensions

**Fix:** Refresh page, try again

### Data Not Saving
**Issue:** Customer added but disappears

**Check:**
1. Did you click "💾 Save Customer"?
2. Did you see success message?
3. Is localStorage enabled?

**Fix:** 
```javascript
// Check localStorage in console
localStorage.getItem('customerDataEdits')
```

### Duplicate Warning
**Issue:** "Customer already exists" warning

**Options:**
1. **Change name** - Use different company name
2. **Proceed anyway** - Click "OK" to add duplicate
3. **Cancel** - Don't add, check existing customer

**Recommended:** Add unique identifier (e.g., "Tesla - West")

### Customer Not in Filters
**Issue:** Added customer doesn't appear in Industry filter

**Reason:** Filter options populated at page load

**Fix:** Refresh page to repopulate filter options

---

## ✅ Testing Checklist

Before first use:
- [ ] Open table in browser
- [ ] Enable Edit Mode
- [ ] See "➕ Add New Customer" button
- [ ] Click button, modal opens
- [ ] Form has all 28 fields
- [ ] Enter Company Name (required)
- [ ] Click Save
- [ ] See success message
- [ ] Customer appears in table
- [ ] Blue dot indicator visible
- [ ] Search for customer name works
- [ ] Refresh page
- [ ] Customer still there (localStorage)
- [ ] Export to CSV includes customer
- [ ] Click Reset All Data (optional)
- [ ] Customer removed (if reset)

---

## 📊 Field Reference

### Quick Copy Template
For manual entry:

```
Company Name: _______________
License Type: [Paid/Trial]
Industry: _______________
ESE Lead: _______________
Status: [Planning/Pre-Production/Production/Active/Inactive]
Engagement: [Active/At Risk/Critical]
Health Score: ___ (0-100)
Close Date: YYYY-MM-DD
Onboard Date: YYYY-MM-DD
Deployment Type: _______________
Summary: _______________
MAU: ___
TTIV: ___ days
Blockers: _______________
```

### All Fields List
1. Company Name (required)
2. License Type
3. Industry
4. ESE Lead
5. Status
6. Delay Reason
7. Close Date
8. Onboard Date
9. Deployment Type
10. Headless
11. Engagement
12. Blockers
13. Feedback
14. Health Score
15. Summary of Engagement
16. MAU
17. TTIV
18. Oppty Realized
19. Preflight
20. Auto-Optimize Enabled
21. Auto-Optimize Button Pressed
22. Service Principle Deployed
23. Brand Profile
24. AEMY Deployed
25. Code Repo
26. Auth Implementation
27. Workflow Manager
28. Customer Self Serve

---

## 🎯 Summary

### What You Get
- ✅ **Add customers in-browser** - No backend needed
- ✅ **Full 28-field form** - All data capturable
- ✅ **localStorage persistence** - Survives refreshes
- ✅ **Edit Mode integration** - Works seamlessly
- ✅ **Filter compatibility** - Searchable immediately
- ✅ **Visual indicators** - Blue dot shows edited
- ✅ **Validation** - Prevents errors
- ✅ **Duplicate detection** - Warns on conflicts

### Quick Commands
```
1. Enable Edit Mode
2. Click "➕ Add New Customer"
3. Fill Company Name (required)
4. Fill other fields (optional)
5. Click "💾 Save Customer"
6. Done!
```

---

**Your Add Customer feature is ready!** 🎉

Enable Edit Mode and click "➕ Add New Customer" to start adding records!

**Note:** Remember that customers added this way are stored in your browser only. To make them permanent in the dataset, add them to the Excel spreadsheet and re-convert the data.

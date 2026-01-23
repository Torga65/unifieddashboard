# Quick Start: Upload to SharePoint

## 🚀 Fast Track (15 minutes)

### Step 1: Open SharePoint (2 min)
```
https://adobe.sharepoint.com/sites/AEMSitesOptimizerTeam/Shared%20Documents/Unified%20Dashboard
```

### Step 2: Create Minimal Set (10 min)

Create **just these 2 documents** to start:

#### A) weekly-current.docx

**Content to paste:**
```
Weekly Engagement Report
========================

Customer engagement data for the current week.

---
week: 2026-01-23
---

[Insert a 2x2 table here]
Then mark it as "Weekly Engagement" block
Add attribute: data-source="/data/customers.json"
```

#### B) index.docx

**Content to paste:**
```
AEM Sites Optimizer Dashboard
==============================

Welcome to the Unified Customer Engagement Dashboard.

[Insert paragraph: "Customer Overview"]
Mark as "Customer Overview" block
Add attribute: data-source="/data/customers.json"

Quick Links
-----------
- Weekly Reports
- All Customers  
- Executive Summary
```

### Step 3: Test (3 min)

```bash
# Local terminal
aem up

# Open browser
http://localhost:3000/
http://localhost:3000/weekly-current
```

---

## ✅ Done!

You now have:
- ✅ Home page with customer cards
- ✅ Weekly engagement table
- ✅ Real data from your JSON

Add more pages later using the templates in this folder.

---

## Next Steps (Optional)

- Create `all-customers.docx` (full dashboard view)
- Create `executive-summary.docx` (AI insights)
- Create weekly snapshots in `weekly/` folder
- Create client profiles in `clients/` folder

See `SETUP_GUIDE.md` for detailed instructions.

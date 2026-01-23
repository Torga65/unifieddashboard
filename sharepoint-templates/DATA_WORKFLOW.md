# Data Workflow

How customer data flows from SharePoint Excel to your dashboard.

---

## 📊 Data Source

### Excel File Location

**SharePoint Path:**
```
/Unified Dashboard/clients/AEM_Sites_Optimizer-CustomerExperience.xlsx
```

**Direct Link:**
```
https://adobe.sharepoint.com/sites/AEMSitesOptimizerTeam/Shared%20Documents/Unified%20Dashboard/clients/AEM_Sites_Optimizer-CustomerExperience.xlsx
```

### Excel Structure

- **16 sheets** (one per week)
- **Sheet names**: Dates like "9/17/2025", "9/24/2025", etc.
- **Row 2**: Column headers
- **Row 3+**: Customer data
- **598 total records** across all sheets

---

## 🔄 Data Flow

```
SharePoint Excel
    ↓
Download to local
    ↓
Python Conversion Script
    ↓
/data/customers.json (598 records, normalized)
/data/weeks.json (16 available weeks)
    ↓
EDS Blocks (Weekly Engagement, Customer Overview)
    ↓
Dashboard Pages
```

---

## 🛠 Update Process

### When Excel is Updated in SharePoint

```bash
# 1. Download Excel from SharePoint
# Click the link above, download to ~/Downloads/

# 2. Copy to project data folder
cp ~/Downloads/AEM_Sites_Optimizer-CustomerExperience.xlsx data/

# 3. Run conversion script
cd /Users/tgardner/Documents/unified-dashboard/unifieddashboard
python3 scripts/convert-customer-data.py

# 4. Verify output
cat data/customers.json | python3 -m json.tool | head -50

# 5. Test locally
aem up
# Open: http://localhost:3000/

# 6. Commit changes
git add data/customers.json data/weeks.json
git commit -m "Update customer data from SharePoint"
git push
```

---

## 📁 Output Files

### /data/customers.json

**Structure:**
```json
{
  "data": [
    {
      "companyName": "ASO - Australian Postal Corporation",
      "week": "2026-01-23",
      "status": "Production",
      "engagement": "Active",
      "healthScore": 62,
      "summary": "Strong engagement with regular check-ins...",
      "blockers": "None",
      "feedback": "Positive",
      "lastUpdated": "2026-01-23"
    },
    ...598 records total
  ],
  "total": 598
}
```

**Used by:**
- Weekly Engagement block (`data-source="/data/customers.json"`)
- Customer Overview block (`data-source="/data/customers.json"`)

### /data/weeks.json

**Structure:**
```json
{
  "weeks": [
    "2025-09-17",
    "2025-09-24",
    ...16 weeks total
  ]
}
```

**Used by:**
- Week selection logic (`scripts/week-utils.js`)
- Current week detection

---

## 🎯 Conversion Script Details

### What It Does

`scripts/convert-customer-data.py`:

1. **Reads** all 16 sheets from Excel
2. **Parses** sheet names to extract week dates
3. **Maps** column headers to standardized field names
4. **Calculates** health scores from color-coded cells
5. **Converts** engagement levels (green/yellow/red → Active/At Risk/Critical)
6. **Normalizes** all data to consistent format
7. **Outputs** clean JSON files

### Health Score Calculation

- **Green cells** → 80-100 score
- **Yellow cells** → 60-79 score  
- **Red cells** → 0-59 score
- **Numeric values** → Used directly
- **Empty** → Default 50

### Field Mapping

Excel Column → JSON Field:
- "Company Name" → `companyName`
- "Status" → `status`
- "Engagement" → `engagement`
- "Health Score" → `healthScore`
- "Summary of Engagement" → `summary`
- "Blockers" → `blockers`
- "Feedback" → `feedback`
- "Last Updated" → `lastUpdated`

---

## 🔍 Data Validation

### After Conversion, Check:

```bash
# Count total records
cat data/customers.json | python3 -c "import json,sys; d=json.load(sys.stdin); print(f'{len(d[\"data\"])} customers')"

# Count by week
cat data/customers.json | python3 -c "
import json, sys
from collections import Counter
data = json.load(sys.stdin)
weeks = Counter(r['week'] for r in data['data'])
for week, count in sorted(weeks.items()):
    print(f'{week}: {count} customers')
"

# Show sample customer
cat data/customers.json | python3 -m json.tool | head -30
```

**Expected:**
- Total: 598 customers
- 16 weeks of data
- Latest week: 2026-01-23 with 46 customers

---

## 🚀 Using the Data

### In Word Documents (SharePoint)

When creating blocks, add the data source:

```
[Create table or div, mark as block]
Add attribute: data-source="/data/customers.json"
```

### In HTML Pages (Local)

```html
<div class="weekly-engagement" data-source="/data/customers.json">
  <!-- Data loads automatically -->
</div>
```

### In JavaScript

```javascript
import { fetchCustomerData } from './scripts/data-loader.js';

const customers = await fetchCustomerData('/data/customers.json');
// Returns array of 598 customer objects
```

---

## 📊 Data Statistics

**Current Dataset:**
- **Total Records**: 598
- **Total Weeks**: 16
- **Date Range**: Sept 17, 2025 - Jan 23, 2026
- **Customers per Week**: Varies (28-46)
- **Latest Week**: Jan 23, 2026 (46 customers)

**Customer Breakdown (Latest Week):**
- Production: 35 customers
- Pre-Production: 8 customers
- Planning: 3 customers

**Health Status (Latest Week):**
- Active (≥80): 35 customers
- At Risk (60-79): 8 customers
- Critical (<60): 3 customers

---

## 🔄 Alternative: Direct Excel Access

Instead of pre-converting, blocks could pull directly from SharePoint Excel:

**Pros:**
- Always up-to-date
- No manual conversion
- Single source of truth

**Cons:**
- Slower (conversion on-demand)
- Requires special parsing
- Health scores calculated in JavaScript

**To implement:**
Change data source to:
```
data-source="/clients/AEM_Sites_Optimizer-CustomerExperience.json"
```

Then update `scripts/data-loader.js` to parse Excel JSON format.

**See:** `EXCEL_IN_SHAREPOINT.md` for details.

---

## ✅ Current Recommendation

**Keep the current workflow:**
- ✅ Pre-converted JSON is fast
- ✅ Data is clean and normalized
- ✅ Health scores calculated correctly
- ✅ Blocks work perfectly as-is
- ✅ You control when data updates

**Update when needed:**
- Download Excel from SharePoint
- Run conversion script
- Commit and push
- Done!

---

## 📋 Troubleshooting

### Conversion Script Fails

```bash
# Check openpyxl installed
pip install openpyxl

# Check Excel file exists
ls -lh data/AEM_Sites_Optimizer-CustomerExperience.xlsx

# Run with verbose output
python3 scripts/convert-customer-data.py
```

### Data Not Showing in Dashboard

```bash
# Check JSON file exists
ls -lh data/customers.json

# Verify JSON is valid
cat data/customers.json | python3 -m json.tool > /dev/null

# Check file size
du -h data/customers.json

# Test data load
curl http://localhost:3000/data/customers.json | python3 -m json.tool | head -20
```

### Wrong Week Showing

Check metadata in Word doc or HTML:
```html
<meta name="week" content="2026-01-23">
```

Or check available weeks:
```bash
cat data/weeks.json
```

---

**Your data workflow is set up and working perfectly!** 🎉

# Excel Data in SharePoint

Your source spreadsheet is now in SharePoint, which enables direct integration with EDS!

---

## 📊 Excel File Location

**SharePoint Path:**
```
/sites/AEMSitesOptimizerTeam/Shared Documents/Unified Dashboard/clients/AEM_Sites_Optimizer-CustomerExperience.xlsx
```

**Web URL:**
```
https://adobe.sharepoint.com/:x:/r/sites/AEMSitesOptimizerTeam/Shared%20Documents/Unified%20Dashboard/clients/AEM_Sites_Optimizer-CustomerExperience.xlsx
```

**EDS Path (for blocks):**
```
/clients/AEM_Sites_Optimizer-CustomerExperience
```

---

## 🔄 How EDS Works with Excel

### Automatic JSON Conversion

EDS automatically converts Excel files to JSON when accessed with `.json` extension:

**Excel file:**
```
/clients/AEM_Sites_Optimizer-CustomerExperience.xlsx
```

**Becomes available as JSON:**
```
/clients/AEM_Sites_Optimizer-CustomerExperience.json
```

### Sheet Access

Each sheet in the Excel file becomes accessible:

```
/clients/AEM_Sites_Optimizer-CustomerExperience.json?sheet=SheetName
```

Or for all sheets:
```
/clients/AEM_Sites_Optimizer-CustomerExperience.json
```

---

## 🎯 Two Approaches for Your Dashboard

### Option 1: Use Pre-Converted JSON (Current Setup)

**Pros:**
- ✅ Faster loading (no conversion on-demand)
- ✅ Data is cleaned and normalized
- ✅ Health scores calculated
- ✅ Works with current blocks as-is

**How it works:**
1. Download Excel from SharePoint when updated
2. Run: `python3 scripts/convert-customer-data.py`
3. Generates: `/data/customers.json`
4. Commit and push changes

**Current block configuration:**
```html
<div class="weekly-engagement" data-source="/data/customers.json">
```

### Option 2: Pull Directly from SharePoint Excel

**Pros:**
- ✅ Always up-to-date (no manual conversion)
- ✅ Single source of truth in SharePoint
- ✅ Automatic updates when Excel changes

**Cons:**
- ⚠️ Requires Excel to be in specific format
- ⚠️ Blocks need to handle multi-sheet structure
- ⚠️ Health score calculations need to be in JavaScript

**Would require block updates:**
```html
<div class="weekly-engagement" data-source="/clients/AEM_Sites_Optimizer-CustomerExperience.json">
```

---

## 💡 Recommended Approach

### Use Hybrid Approach

1. **Keep** `/data/customers.json` for production use (fast, clean, normalized)
2. **Optionally** pull from Excel for development/testing
3. **Automate** conversion with GitHub Actions (future)

### Current Workflow (Keep This)

```bash
# When Excel is updated in SharePoint:

# 1. Download to local
# (Download from SharePoint to /data/ folder)

# 2. Run conversion
python3 scripts/convert-customer-data.py

# 3. Verify
cat data/customers.json | python3 -m json.tool | head -50

# 4. Test
aem up
# Visit: http://localhost:3000/

# 5. Commit
git add data/customers.json data/weeks.json
git commit -m "Update customer data from SharePoint Excel"
git push
```

---

## 🔄 Automatic Updates (Future Enhancement)

You can set up automatic conversion using GitHub Actions:

### GitHub Action Workflow

Create `.github/workflows/update-data.yaml`:

```yaml
name: Update Customer Data

on:
  schedule:
    - cron: '0 0 * * 1'  # Weekly on Monday
  workflow_dispatch:      # Manual trigger

jobs:
  update-data:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: pip install openpyxl
      
      - name: Download Excel from SharePoint
        run: |
          # Use SharePoint API to download Excel
          # (Requires authentication setup)
      
      - name: Convert to JSON
        run: python3 scripts/convert-customer-data.py
      
      - name: Commit changes
        run: |
          git config --global user.name "GitHub Action"
          git config --global user.email "action@github.com"
          git add data/customers.json data/weeks.json
          git commit -m "Auto-update customer data" || echo "No changes"
          git push
```

This would automatically update your data weekly!

---

## 📝 Excel File Structure in SharePoint

Your Excel file has:
- **16 sheets** (one per week)
- **Sheet names** are dates (e.g., "9/17/2025")
- **Row 1**: Empty or title
- **Row 2**: Column headers
- **Row 3+**: Customer data

### Required Headers (Row 2)

```
Company Name | Status | Engagement | Health Score | Summary of Engagement | Blockers | Feedback | Last Updated
```

### EDS JSON Format

When accessed via EDS, each sheet becomes:

```json
{
  "data": [
    {
      "Company Name": "ASO - Australian Postal Corporation",
      "Status": "Production",
      "Engagement": "Active",
      "Health Score": "62",
      ...
    }
  ]
}
```

---

## 🛠 If You Want to Pull Directly from Excel

### Update Blocks

Modify blocks to handle multi-sheet Excel data:

```javascript
// In weekly-engagement.js or customer-overview.js

// Fetch Excel JSON
const response = await fetch('/clients/AEM_Sites_Optimizer-CustomerExperience.json');
const excelData = await response.json();

// excelData will have structure:
// { "9/17/2025": { data: [...] }, "9/24/2025": { data: [...] }, ... }

// Process all sheets
const allCustomers = [];
Object.entries(excelData).forEach(([sheetName, sheetData]) => {
  const weekDate = parseSheetNameToDate(sheetName);
  sheetData.data.forEach(row => {
    allCustomers.push({
      week: weekDate,
      companyName: row['Company Name'],
      status: row['Status'],
      engagement: row['Engagement'],
      healthScore: calculateHealthScore(row),
      ...
    });
  });
});
```

### Update Data Loader

Modify `scripts/data-loader.js` to handle both formats:

```javascript
export async function fetchCustomerData(dataUrl) {
  const response = await fetch(dataUrl);
  const data = await response.json();
  
  // Check if it's pre-converted format
  if (data.data && Array.isArray(data.data)) {
    return data.data;
  }
  
  // Check if it's Excel multi-sheet format
  if (typeof data === 'object' && !Array.isArray(data)) {
    return parseExcelSheets(data);
  }
  
  return [];
}

function parseExcelSheets(excelData) {
  const customers = [];
  Object.entries(excelData).forEach(([sheetName, sheetData]) => {
    const weekDate = parseSheetName(sheetName);
    if (sheetData.data) {
      sheetData.data.forEach(row => {
        customers.push(parseCustomerRow(row, weekDate));
      });
    }
  });
  return customers;
}
```

---

## ✅ Current Status

**Your Setup:**
- ✅ Excel file in SharePoint: `/clients/AEM_Sites_Optimizer-CustomerExperience.xlsx`
- ✅ Conversion script: `scripts/convert-customer-data.py`
- ✅ Pre-converted data: `/data/customers.json`
- ✅ Blocks configured to use: `/data/customers.json`
- ✅ Works perfectly with current setup

**No changes needed!** Your current workflow is solid.

---

## 📋 Data Update Checklist

When Excel is updated in SharePoint:

```bash
# 1. Download Excel
# Go to SharePoint, download AEM_Sites_Optimizer-CustomerExperience.xlsx

# 2. Copy to project
cp ~/Downloads/AEM_Sites_Optimizer-CustomerExperience.xlsx data/

# 3. Convert
python3 scripts/convert-customer-data.py

# 4. Verify
cat data/customers.json | python3 -m json.tool | head -50

# 5. Test locally
aem up
# Check: http://localhost:3000/

# 6. Commit
git add data/customers.json data/weeks.json
git commit -m "Update customer data from SharePoint"
git push
```

---

## 🔮 Future Enhancements

### Option A: SharePoint API Integration
- Pull Excel directly via Microsoft Graph API
- Automate download in conversion script
- Run on schedule or webhook

### Option B: Real-time Excel Access
- Modify blocks to pull from Excel directly
- EDS handles conversion automatically
- Always up-to-date without commits

### Option C: GitHub Actions Automation
- Scheduled workflow to download and convert
- Automatic commit and deployment
- Zero manual steps

---

**Current recommendation:** Keep your existing workflow. It's reliable, fast, and gives you control over when data updates. The Excel file in SharePoint serves as the authoritative source, and you convert when needed.

# Real Customer Data Integration - Complete ✅

## Overview

Successfully integrated **598 customer records** from your SharePoint Excel file (`AEM_Sites_Optimizer-CustomerExperience.xlsx`) into the EDS dashboard.

---

## 📊 What Was Done

### 1. Excel File Processing

**Location:** `/data/AEM_Sites_Optimizer-CustomerExperience.xlsx`

**Structure:**
- **16 sheets** (one per week)
- **598 total customer records**
- **Date range:** Sept 17, 2025 → Jan 23, 2026

**Sheets processed:**
```
2025.09.17 → 25 customers
2025.09.24 → 36 customers
2025.10.01 → 38 customers
2025.10.08 → 34 customers
2025.10.15 → 34 customers
2025.10.22 → 34 customers
2025.10.29 → 34 customers
2025.11.12 → 35 customers
2025.11.20 → 33 customers
2025.11.26 → 33 customers
2025.12.04 → 43 customers
2025.12.11 → 43 customers
2025.12.18 → 42 customers
2026.01.08 → 42 customers
2026.01.15 → 46 customers
2026.01.23 → 46 customers (latest)
```

### 2. Data Conversion

Created Python script: `/scripts/convert-customer-data.py`

**Features:**
- ✅ Processes all 16 weekly sheets
- ✅ Extracts week dates from sheet names
- ✅ Maps engagement indicators (green/yellow/red) to status
- ✅ Calculates numeric health scores
- ✅ Standardizes field names
- ✅ Outputs to `/data/customers.json`

### 3. JSON Output

**File:** `/data/customers.json`

**Format:**
```json
{
  "data": [
    {
      "week": "2026-01-23",
      "companyName": "ASO - BHG Financial",
      "licenseType": "Paid",
      "industry": "Financial Services",
      "eseLead": "Torrey Gardner",
      "status": "Production",
      "engagement": "Active",
      "healthScore": 100,
      "summary": "Delivering SEO report...",
      "blockers": "None",
      "feedback": "See engagement status",
      "mau": "4",
      "ttiv": "5 days",
      "lastUpdated": "2026-01-23"
    }
  ],
  "total": 598,
  "generated": "2026-01-22T..."
}
```

### 4. Week Configuration

**Updated:** `/data/weeks.json`

```json
{
  "weeks": [
    "2025-09-17",
    "2025-09-24",
    ...,
    "2026-01-15",
    "2026-01-23"
  ]
}
```

### 5. Block Enhancement

**Updated:** `/blocks/weekly-engagement/weekly-engagement.js`

**New feature:** Load data from JSON instead of HTML:

```html
<!-- Old way: hardcoded in HTML -->
<div class="weekly-engagement">
  <div>
    <div>2026-01-20</div>
    <div>Company Name</div>
    ...
  </div>
</div>

<!-- New way: load from JSON -->
<div class="weekly-engagement" data-source="/data/customers.json">
  <!-- Data loaded dynamically -->
</div>
```

---

## 🚀 How to Use

### Option 1: View Live Data Page

```bash
# Start dev server
aem up

# Open in browser
http://localhost:3000/engagement-live.html
```

This page loads the real customer data from `customers.json`.

### Option 2: Use in Any Page

Add this to any HTML page:

```html
<div class="weekly-engagement" data-source="/data/customers.json">
  <!-- Data loaded automatically -->
</div>
```

The block will:
1. Fetch data from `/data/customers.json`
2. Determine current week (from metadata, URL, or `/data/weeks.json`)
3. Filter to show only that week's customers
4. Display in interactive table with filters

### Option 3: Update Data

When the SharePoint file updates:

```bash
# 1. Download updated Excel file
# 2. Copy to /data/
cp ~/Downloads/AEM_Sites_Optimizer-CustomerExperience.xlsx data/

# 3. Run converter
python3 scripts/convert-customer-data.py

# 4. Refresh browser
# Data updates automatically!
```

---

## 📋 Data Mapping

### Source Excel → JSON Output

| Excel Column           | JSON Field      | Processing                                  |
|-----------------------|-----------------|---------------------------------------------|
| Company Name          | companyName     | Direct                                      |
| License Type          | licenseType     | Direct                                      |
| Industry              | industry        | Direct                                      |
| ESE Lead              | eseLead         | Direct                                      |
| Status                | status          | Direct                                      |
| Engagement            | engagement      | green→Active, yellow→At Risk, red→Critical  |
| Blockers              | blockersStatus  | Indicator stored                            |
| Feedback              | feedbackStatus  | Indicator stored                            |
| Health Score          | healthScore     | Calculated from all indicators (0-100)      |
| Summary of Engagement | summary         | Direct                                      |
| MAU                   | mau             | Direct                                      |
| TTIV                  | ttiv            | Direct                                      |
| Sheet Name            | week            | 2026.01.23 → 2026-01-23                     |

### Health Score Calculation

```python
Indicators: engagement, blockers, feedback, health
Values: green=100, yellow=50, red=25

Health Score = Average of all indicators

Examples:
- All green (100+100+100+100)/4 = 100
- All yellow (50+50+50+50)/4 = 50
- Mixed (100+50+50+100)/4 = 75
```

---

## 📁 Files Created/Updated

```
data/
├── AEM_Sites_Optimizer-CustomerExperience.xlsx  ✅ Your source file
├── customers.json                                ✅ Converted data (598 records)
└── weeks.json                                    ✅ Updated with actual weeks

scripts/
├── convert-customer-data.py                      ✅ Main converter
├── inspect-excel.py                              ✅ Inspection tool
├── excel-to-json.py                              ✅ Simple converter
├── data-loader.js                                ✅ JS data loader utility
└── week-utils.js                                 ✅ Week selection logic

blocks/weekly-engagement/
└── weekly-engagement.js                          ✅ Updated to load JSON

./
├── engagement-live.html                          ✅ New page with live data
├── REAL_DATA_INTEGRATION.md                      ✅ This file
└── SHAREPOINT_INTEGRATION.md                     ✅ Integration guide
```

---

## 🎯 Test URLs

```bash
# Start server
aem up

# View static example (hardcoded data)
http://localhost:3000/engagement-weekly.html

# View live data (from customers.json)
http://localhost:3000/engagement-live.html

# Test JSON endpoint directly
http://localhost:3000/data/customers.json

# Test weeks endpoint
http://localhost:3000/data/weeks.json

# Interactive tests
http://localhost:3000/scripts/week-utils-test.html
```

---

## 📊 Data Statistics

```
Total Records: 598
Weeks: 16 (Sept 2025 - Jan 2026)
Customers per week: ~37 average
Latest week: 2026-01-23 (46 customers)

Status Breakdown:
- Production: Most common
- Pre-Production: Some customers
- On Hold: A few customers

Engagement Levels:
- Active (green): Healthy engagement
- At Risk (yellow): Needs attention
- Critical (red): Requires immediate action
```

---

## 🔄 Updating Data

### Automated Update (Recommended)

**Create update script:**

```bash
#!/bin/bash
# update-data.sh

# Download from SharePoint (if automated)
# Or copy manually to /data/

# Convert Excel to JSON
python3 scripts/convert-customer-data.py

# Update weeks.json automatically
# (convert-customer-data.py could be enhanced to do this)

# Commit changes
git add data/customers.json data/weeks.json
git commit -m "Update customer data $(date +%Y-%m-%d)"
git push

echo "✅ Data updated!"
```

### Manual Update

1. Download latest Excel from SharePoint
2. Copy to `/data/AEM_Sites_Optimizer-CustomerExperience.xlsx`
3. Run: `python3 scripts/convert-customer-data.py`
4. Refresh browser to see updates

---

## 💡 Advanced Usage

### Filter by Specific Week

```html
<meta name="week" content="2026-01-15">

<div class="weekly-engagement" data-source="/data/customers.json">
  <!-- Shows only customers from 2026-01-15 -->
</div>
```

### Load Custom Data Source

```html
<div class="weekly-engagement" data-source="/api/custom-data.json">
  <!-- Load from different endpoint -->
</div>
```

### Combine with Other Blocks

```html
<!-- Weekly engagement table -->
<div class="weekly-engagement" data-source="/data/customers.json"></div>

<!-- AI summary of the week -->
<div class="ai-summary">
  <div>
    <div>Summary</div>
    <div>This week shows strong engagement from...</div>
  </div>
</div>
```

---

## 🐛 Troubleshooting

### Data Not Showing

**Check:**
1. Is `/data/customers.json` accessible?
   ```bash
   curl http://localhost:3000/data/customers.json
   ```

2. Are there records for the selected week?
   ```javascript
   const week = await resolveSelectedWeek();
   console.log('Current week:', week);
   ```

3. Check browser console for errors

### Wrong Week Displayed

**Check priority:**
1. Page metadata: `<meta name="week" content="...">`
2. URL parameter: `?week=2026-01-23`
3. URL path: `/engagement/2026-01-23`
4. Dataset: Latest from `/data/weeks.json`

### Excel Not Converting

**Check:**
1. Python installed: `python3 --version`
2. openpyxl installed: `pip3 install openpyxl`
3. Excel file exists: `ls -l data/*.xlsx`
4. Run manually: `python3 scripts/convert-customer-data.py`

---

## 🎉 Success!

Your SharePoint customer data is now:
- ✅ Converted to JSON (598 records)
- ✅ Integrated with EDS blocks
- ✅ Viewable at `/engagement-live.html`
- ✅ Filterable by week
- ✅ Searchable in real-time
- ✅ Ready for production

**Next Steps:**
1. Test: `aem up` → `http://localhost:3000/engagement-live.html`
2. Verify: Check filters, search, and week selection
3. Deploy: Push to GitHub for production
4. Automate: Set up regular data updates

---

**Questions?**
- Check `/SHAREPOINT_INTEGRATION.md` for more details
- Review `/scripts/convert-customer-data.py` for conversion logic
- See `/blocks/weekly-engagement/weekly-engagement.js` for implementation

**Last Updated:** January 22, 2026  
**Data Source:** AEM_Sites_Optimizer-CustomerExperience.xlsx  
**Total Records:** 598 customers across 16 weeks

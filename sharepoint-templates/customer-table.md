# Customer Data Table

Complete table view of all customers with all data columns from the spreadsheet.

---

## Metadata

```
---
week: 2026-01-23
title: Customer Data Table
description: Detailed table view of all customer engagement data
---
```

---

## Customer Engagement Table

> **Instructions for Sidekick:**
> 1. Insert a simple 2x2 table below
> 2. Select the table
> 3. Mark as "Weekly Engagement" block
> 4. Add attribute: `data-source="/data/customers.json"`

| Loading... |
|------------|
| Customer data will appear here |

---

## About This View

This table displays all customer data with the following columns:

### Columns

1. **Company Name** - Customer organization name
2. **Status** - Production stage (Production, Pre-Production, Planning, etc.)
3. **Engagement** - Engagement level (Active, At Risk, Critical)
4. **Health Score** - Numeric score 0-100 with visual bar
5. **Summary of Engagement** - Detailed engagement notes and activities
6. **Blockers** - Current obstacles or issues
7. **Feedback** - Customer sentiment and responses
8. **Last Updated** - Date of last update

### Interactive Features

- **🔍 Search**: Type to search across all fields
- **📊 Status Filter**: Filter by production stage
- **⚠️ Engagement Filter**: Show Active, At Risk, or Critical
- **❤️ Health Filter**: Filter by health score ranges
- **🔤 Sort**: Click column headers or use sort dropdown
- **👆 Click Rows**: Click any row to highlight

### Data Display

- Health scores shown with colored bars (green/yellow/red)
- Status badges with color coding
- Engagement level badges
- Blockers highlighted in red when present
- Mobile-responsive: columns hide on small screens

---

## Using This Table

### Search
Type in the search box to find customers by:
- Company name
- Status
- Engagement level
- Summary text
- Blockers
- Feedback

### Filter by Status
Choose from:
- Production
- Pre-Production
- Planning
- Onboarding
- Active
- Inactive

### Filter by Engagement
- **All** - Show all customers
- **Active** - Healthy engagement (≥80 health score)
- **At Risk** - Needs attention (60-79 health score)
- **Critical** - Immediate action needed (<60 health score)

### Filter by Health Score
- **All** - Show all customers
- **Healthy** (80-100)
- **Needs Attention** (60-79)
- **Critical** (<60)

### Sort Options
- **Name (A-Z)**
- **Name (Z-A)**
- **Health Score (High to Low)**
- **Health Score (Low to High)**
- **Engagement Level**

---

## Week Selection

The table shows data for the current week by default. The week is determined by:

1. **Page metadata** (the `week` field above)
2. **URL parameter** (e.g., `?week=2026-01-23`)
3. **Latest available week** in the dataset

To show a different week:
- Update the `week` metadata field
- Or add `?week=YYYY-MM-DD` to the URL

---

## Exporting Data

**To export the visible table:**
1. Apply desired filters
2. Copy the table content
3. Paste into Excel or Google Sheets

**For raw data:**
- Access `/data/customers.json` directly
- Use the conversion script to regenerate from Excel

---

## Responsive Behavior

### Desktop (>1024px)
All columns visible

### Tablet (768px-1024px)
Hides: Feedback, Last Updated

### Mobile (<768px)
Shows: Company Name, Status, Engagement, Health Score only
Other columns available by clicking the row

---

*Data updates when `/data/customers.json` is refreshed*

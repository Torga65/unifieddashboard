# Customer Data Table

View complete customer data with all 28 columns from the spreadsheet.

---

## Metadata

```
---
title: Customer Data Table - Full View
description: Interactive table with all 28 customer data columns, search, sort, and export
---
```

---

## Full Customer Data Table

> **Instructions for AEM Sidekick:**
> This page will redirect to or embed the full HTML table.
> For EDS, you can use an iframe or direct link.

---

## Quick Access

**[View Full Table →](/customer-full-table)**

Click above to open the interactive customer data table with:

- **All 28 columns** from your Excel spreadsheet
- **Search** across all fields
- **Sort** by any column
- **Filter** by Status and Engagement
- **Export to CSV** for further analysis
- **Sticky Company Name** column
- **Full screen** layout with scrolling

---

## Features

### Data Display
- 46 customers for current week (January 23, 2026)
- 28 columns matching your Excel sheet
- Color-coded badges for Status and Engagement
- Visual health score indicators

### Interactive Controls
- **Search box** - Find customers by any field
- **Status filter** - Production, Pre-Production, etc.
- **Engagement filter** - Active, At Risk, Critical
- **Sort columns** - Click any header to sort
- **Export button** - Download filtered data as CSV

### Navigation
- Company Name stays visible when scrolling
- Horizontal scroll for all columns
- Vertical scroll for all rows
- Responsive to screen size

---

## All 28 Columns

1. Company Name
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

## Using the Table

### Search for Customers
Type in the search box to filter across all columns. Examples:
- "BHG" - finds BHG Financial
- "Government" - finds all government customers
- "Critical" - finds customers with critical status

### Filter Data
Use dropdown filters to narrow results:
- **Status** - Show only Production customers
- **Engagement** - Show only At Risk customers

### Sort Data
Click any column header to sort by that column. Click again to reverse order.

### Export Data
Click the green "Export to CSV" button to download currently visible data (respects active filters).

---

## Data Source

Data is updated from the SharePoint Excel file:

**Excel Location:**
```
/Unified Dashboard/clients/AEM_Sites_Optimizer-CustomerExperience.xlsx
```

**To update data:**
1. Download updated Excel from SharePoint
2. Run: `python3 scripts/convert-customer-data.py`
3. Commit and push changes

---

## Related Pages

- [Home Dashboard](/) - Customer overview with cards
- [Weekly Engagement](/engagement-live) - Week-specific view
- [Executive Summary](/executive-summary) - High-level metrics

---

*Last updated: January 23, 2026*

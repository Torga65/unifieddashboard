# Customer Data - Full Table (All 28 Columns)

Complete spreadsheet view with all columns from the 2026.01.23 sheet.

---

## Metadata

```
---
week: 2026-01-23
title: Customer Data - Full Table
description: Complete customer data with all 28 spreadsheet columns
---
```

---

## 📊 All 28 Columns from Spreadsheet

This page displays every column from the Excel sheet:

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
16. MAU (Monthly Active Users)
17. TTIV (Time to Initial Value)
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

## 🎯 Interactive Features

The full table view includes comprehensive filtering and analysis tools:

### Advanced Filtering System
- **Multi-select filters** - Industry, ESE Lead (hold Ctrl/Cmd)
- **Range filters** - Health Score (0-100), MAU, TTIV
- **Date range filters** - Close Date, Onboard Date
- **Boolean filters** - Feature status (Preflight, Auto-Optimize, etc.)
- **Quick presets** - Active, At Risk, Critical, High Health, Paid, etc.
- **Active filter chips** - Visual display with individual remove

### Table Features
- **Full horizontal scroll** - Scrollable before page fold
- **Sticky Company Name** - First column stays visible
- **Search** - Find text across all 28 columns
- **Sort** - Click any column header
- **Export to CSV** - Download filtered results with all data

### Quick Filter Presets
1. ✅ **Active Customers** - Engagement = Active
2. ⚠️ **At Risk** - Needs attention
3. 🚨 **Critical** - Urgent intervention
4. 🚀 **In Production** - Live customers only
5. 💪 **High Health (80+)** - Best performers
6. 💰 **Paid Licenses** - Exclude trials
7. 🎯 **Fully Deployed** - All features enabled

---

## Full Data Table

> **Note for AEM Sidekick:**
> This requires custom JavaScript to display all 28 columns.
> For SharePoint, use the local HTML version (`customer-full-table.html`)
> or create a custom block that renders all fields.

**Alternative for SharePoint:**
Use the `customer-table.html` file directly, or create a Word table with all 28 columns manually.

---

## Column Descriptions

### Core Information

- **Company Name** - Customer organization name
- **License Type** - Paid or Trial license
- **Industry** - Business sector or vertical
- **ESE Lead** - Enterprise Solutions Engineer responsible
- **Status** - Production, Pre-Production, Planning, Onboarding, Active, Inactive

### Timeline & Deployment

- **Delay Reason** - Explanation for any project delays
- **Close Date** - Contract close date
- **Onboard Date** - Customer onboarding start date
- **Deployment Type** - OnPrem to CS, Cloud, Hybrid, etc.
- **Headless** - Headless CMS implementation status

### Engagement & Health

- **Engagement** - Active, At Risk, or Critical status
- **Blockers** - Current issues blocking progress
- **Feedback** - Customer feedback indicator (positive/mixed/negative)
- **Health Score** - Calculated metric (0-100)
- **Summary of Engagement** - Detailed notes on customer engagement

### Metrics

- **MAU** - Monthly Active Users count
- **TTIV** - Time to Initial Value metric
- **Oppty Realized** - Opportunity realization indicator

### Implementation Features

- **Preflight** - Preflight check completion status
- **Auto-Optimize Enabled** - Whether auto-optimization is turned on
- **Auto-Optimize Button Pressed** - Customer has activated auto-optimize
- **Service Principle Deployed** - Service principle deployment status
- **Brand Profile** - Brand profile configuration status
- **AEMY Deployed** - AEMY (AEM Yield) deployment status

### Technical Configuration

- **Code Repo** - Version control system (Git, GitLab, Bitbucket, etc.)
- **Auth Implementation** - Authentication method (IMS, SAML, Basic)
- **Workflow Manager** - Project management tool (Jira, Asana, etc.)
- **Customer Self Serve** - Self-service capability status

---

## Using This Data

### For Analysis

All 28 columns are available in the JSON data:

```javascript
// Access full customer data
const customer = {
  companyName: "ASO - Australian Postal Corporation",
  licenseType: "Paid",
  industry: "Government - Federal",
  eseLead: "Neha Kaushik",
  status: "Production",
  // ... all 28 fields ...
};
```

### For Reporting

Export options:
1. **Copy from table** - Select and copy to Excel
2. **JSON export** - Access `/data/customers.json`
3. **Custom reports** - Build with JavaScript from JSON data

---

## Data Structure

Each customer record contains:
- **Core fields** (10): Basic company information
- **Engagement fields** (5): Health and engagement metrics
- **Metrics fields** (3): Usage and value metrics
- **Implementation fields** (10): Feature deployment status

**Total: 28 fields per customer**

---

## Access Options

### Local Development

```bash
aem up
# Visit: http://localhost:3000/customer-full-table
```

Shows complete table with horizontal scroll.

### SharePoint

Create Word document with all 28 columns in a table.
Due to width, consider:
- Multiple tables (grouped by category)
- Linked detail pages
- Using the HTML version

---

## Table Width Consideration

With 28 columns, the table is **very wide** (~3000px).

**Viewing options:**
- **Desktop** - Horizontal scroll recommended
- **Export to Excel** - Better for detailed analysis
- **Grouped views** - Create separate tables by category:
  - Core Info (10 columns)
  - Engagement (5 columns)
  - Metrics (3 columns)
  - Implementation (10 columns)

---

## Alternative: Grouped Tables

For easier viewing, consider creating 4 separate pages:

### 1. Core Customer Info
Company Name, License, Industry, ESE Lead, Status, Dates, Deployment

### 2. Engagement & Health
Engagement, Blockers, Feedback, Health Score, Summary

### 3. Metrics & Usage
MAU, TTIV, Oppty Realized

### 4. Implementation Status
All feature deployment and configuration fields

---

*All 28 columns from the 2026.01.23 Excel sheet are captured and available*

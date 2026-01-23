# Weekly Engagement Report

Customer engagement data for the current week.

---

## Metadata

> **Add this at the very top of the Word document (before the title):**

```
---
week: 2026-01-23
title: Weekly Engagement Report
description: Customer engagement metrics and status for the current week
---
```

---

## Current Week Data

> **Instructions for Sidekick:**
> 1. Insert a simple table (any structure)
> 2. Select the table
> 3. Mark as "Weekly Engagement" block
> 4. Add attribute: `data-source="/data/customers.json"`

| Loading... |
|------------|
| Customer data will appear here |

---

## About This Report

This report displays engagement metrics for all active customers in the current week, including:

- **Company Name**: Customer organization
- **Status**: Production stage (Production, Pre-Production, Planning)
- **Engagement Level**: Active, At Risk, or Critical
- **Health Score**: Calculated metric (0-100)
- **Summary**: Key engagement activities and notes
- **Blockers**: Current obstacles or issues
- **Feedback**: Customer sentiment and responses

### Using This Report

- **Search**: Find customers by name
- **Filter**: Use dropdowns to filter by status, engagement, or health
- **Sort**: Click column headers to sort data
- **Click Rows**: Select a row to highlight and focus

---

## Week Selection

The report automatically displays data for the current week based on:

1. Page metadata (`week` field)
2. URL parameter (e.g., `?week=2026-01-23`)
3. Latest available week in the dataset

---

*Report generated automatically from customer tracking data*

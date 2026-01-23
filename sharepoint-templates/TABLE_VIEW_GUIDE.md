# Table View Guide

How to create a customer data table page with all spreadsheet columns.

---

## 📋 What You Get

A full-featured table displaying all customers with these columns:

| Column | Description | Features |
|--------|-------------|----------|
| Company Name | Customer organization | Searchable, Sortable |
| Status | Production stage | Filterable, Badge colors |
| Engagement | Engagement level | Filterable, Badge colors |
| Health Score | Numeric score (0-100) | Filterable, Visual bar, Color-coded |
| Summary of Engagement | Detailed notes | Searchable, Expandable |
| Blockers | Current issues | Highlighted if present |
| Feedback | Customer sentiment | Searchable |
| Last Updated | Date of last update | Formatted date |

---

## 🚀 Quick Setup

### Option 1: SharePoint Word Document

1. **Open SharePoint:**
   ```
   https://adobe.sharepoint.com/sites/AEMSitesOptimizerTeam/Shared%20Documents/Unified%20Dashboard
   ```

2. **Create new Word doc:** `customer-table.docx`

3. **Copy content from:** `sharepoint-templates/customer-table.md`

4. **Add metadata at top:**
   ```
   ---
   week: 2026-01-23
   ---
   ```

5. **Insert a table** (any size)

6. **Mark as "Weekly Engagement" block** using AEM Sidekick

7. **Add attribute:** `data-source="/data/customers.json"`

8. **Preview** to test

9. **Publish** when ready

**Access at:** `https://main--unifieddashboard--{org}.aem.live/customer-table`

### Option 2: Local HTML File (Already Created!)

The file `customer-table.html` is ready to use:

```bash
aem up
# Visit: http://localhost:3000/customer-table
```

---

## 🎨 What It Looks Like

### Desktop View
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🔍 Search: [______________]  Status: [All ▼]  Engagement: [All ▼] etc.     │
├─────────────────────────────────────────────────────────────────────────────┤
│ Company Name          │Status │Engage│Health│Summary     │Blockers│Feedback│
├──────────────────────┼───────┼──────┼──────┼───────────┼────────┼────────┤
│ ASO - Australian...  │🟢 Prod│Active│ 62▓▓▓│Strong en...│ None   │Positive│
│ ASO - BHG Financial  │🟢 Prod│Active│100▓▓▓│Excellent...│ None   │Positive│
│ ASO - Breville       │🟢 Prod│Active│ 95▓▓▓│Very good...│ None   │Positive│
│ ...                  │       │      │      │            │        │        │
└──────────────────────┴───────┴──────┴──────┴────────────┴────────┴────────┘
```

### Features in Action

- **Search bar** at top
- **Filter dropdowns** for Status, Engagement, Health
- **Sort dropdown** for ordering
- **Color-coded badges** for status and engagement
- **Health bars** with visual indicators
- **Blocker alerts** in red when present
- **Click rows** to highlight

---

## 📱 Responsive Behavior

### Desktop (Wide Screen)
Shows all 8 columns

### Tablet (Medium)
Hides: Feedback, Last Updated (still accessible by clicking row)

### Mobile (Narrow)
Shows only: Company Name, Status, Engagement, Health Score
Other data visible by clicking row for details

---

## 🎯 Interactive Features

### 1. Search
Type in the search box to find customers by:
- Company name
- Status text
- Engagement level
- Summary content
- Blocker descriptions
- Feedback text

**Example searches:**
- `"BHG"` - Find BHG Financial
- `"risk"` - Find customers at risk
- `"blocker"` - Find customers with blockers

### 2. Filter by Status
Options:
- All
- Production
- Pre-Production
- Planning
- Onboarding
- Active
- Inactive

### 3. Filter by Engagement
- **All** - Show everyone
- **Active** - Health ≥80 (green)
- **At Risk** - Health 60-79 (yellow)
- **Critical** - Health <60 (red)

### 4. Filter by Health Score
- **All** - Show everyone
- **Healthy** - 80-100 (green bar)
- **Needs Attention** - 60-79 (yellow bar)
- **Critical** - <60 (red bar)

### 5. Sort Options
- **Name (A-Z)** - Alphabetical ascending
- **Name (Z-A)** - Alphabetical descending
- **Health (High to Low)** - Best health first
- **Health (Low to High)** - Worst health first (to prioritize)
- **Engagement** - Critical → At Risk → Active

### 6. Click Rows
Click any row to:
- Highlight it with blue border
- Keep it in focus
- Click again to unhighlight

---

## 🔧 Customization

### Show Different Week

**In Word doc metadata:**
```
---
week: 2026-01-15
---
```

**Or in URL:**
```
/customer-table?week=2026-01-15
```

### Show All Weeks

Remove the week filter in the block JavaScript, or create a separate "all-time" view.

### Change Default Sort

Edit `blocks/weekly-engagement/weekly-engagement.js`:
```javascript
// Change default sort
filters.sort = 'health-asc'; // Show worst health first
```

### Hide Columns

Edit `blocks/weekly-engagement/weekly-engagement.css`:
```css
/* Hide feedback column even on desktop */
.engagement-table th:nth-child(7),
.engagement-table td:nth-child(7) {
  display: none;
}
```

---

## 📊 Data Details

### What Shows in Each Column

**Company Name:**
- Full customer name from spreadsheet
- Example: "ASO - Australian Postal Corporation"

**Status:**
- Color-coded badge
- Values: Production (green), Pre-Production (blue), Planning (purple), etc.

**Engagement:**
- Color-coded badge
- Active (green), At Risk (yellow), Critical (red)

**Health Score:**
- Number 0-100
- Visual bar indicator
- Color: Green (≥80), Yellow (60-79), Red (<60)

**Summary of Engagement:**
- Truncated on small screens
- Full text visible on hover or click
- Searchable content

**Blockers:**
- Highlighted in red if present
- "None" if no blockers
- Important for identifying issues

**Feedback:**
- Customer sentiment
- Examples: "Positive", "Mixed", "Negative"

**Last Updated:**
- Date format: YYYY-MM-DD
- Shows freshness of data

---

## 🔍 Use Cases

### For Customer Success Managers
- **Search** for specific customers
- **Filter by engagement** to find at-risk customers
- **Sort by health** to prioritize outreach
- **Review blockers** to identify common issues

### For Executives
- **Quick overview** of all customers
- **Health score distribution** visible at a glance
- **Status breakdown** (Production vs Pre-Production)
- **Identify trends** across the portfolio

### For Support Teams
- **Find customers with blockers**
- **Review feedback** to identify satisfaction issues
- **Track engagement levels**
- **Export data** for reporting

---

## 💡 Tips

### Finding At-Risk Customers Quickly
1. Click **Engagement** filter
2. Select **"At Risk"** or **"Critical"**
3. Sort by **Health (Low to High)**
4. Focus on top of list

### Exporting Data
1. Apply desired filters
2. Select table content
3. Copy (Cmd+C / Ctrl+C)
4. Paste into Excel or Google Sheets

### Combining Filters
- Filters work together
- Example: Status="Production" + Engagement="Critical"
- Shows: Production customers who are critical

### Mobile Usage
- Swipe table to scroll horizontally
- Click rows to see full details
- Use filters to narrow down list
- Essential columns always visible

---

## 🎓 Comparison with Other Views

### Customer Table (This Page)
- ✅ All data columns visible
- ✅ Dense information
- ✅ Best for detailed analysis
- ✅ CSV-like export format
- 📊 **Use when:** You need spreadsheet-style data view

### Customer Overview (Cards)
- ✅ Visual card layout
- ✅ Key metrics highlighted
- ✅ AI insights included
- ✅ Better for browsing
- 📊 **Use when:** You want a dashboard-style overview

### Weekly Engagement (Original)
- ✅ Same table format
- ✅ Week-specific focus
- ✅ Historical snapshots
- 📊 **Use when:** Reviewing specific week's data

---

## 📋 Testing Checklist

After creating the page, test:

- [ ] Table loads with all customers
- [ ] All 8 columns are visible (desktop)
- [ ] Search works across all fields
- [ ] Status filter works
- [ ] Engagement filter works
- [ ] Health filter works
- [ ] Sort dropdown works
- [ ] Click row highlights it
- [ ] Health bars display correctly
- [ ] Badges show correct colors
- [ ] Blockers are highlighted
- [ ] Mobile view shows 4 columns
- [ ] Tablet view hides Feedback & Last Updated
- [ ] No console errors (F12)

---

## ✅ Summary

You now have a full-featured customer data table that:
- ✅ Shows all 8 columns from your spreadsheet
- ✅ Has interactive search and filtering
- ✅ Responds to different screen sizes
- ✅ Supports sorting and highlighting
- ✅ Matches your source Excel structure

**Ready to use:**
- Local: `customer-table.html` (already created)
- SharePoint: Use `customer-table.md` template

---

**Your table view is ready!** 🎉

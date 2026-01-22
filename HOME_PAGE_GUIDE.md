# Customer Dashboard Home Page

## Overview

The home page (`index.html`) provides a comprehensive overview of all customers with key metrics displayed in an easy-to-scan card layout.

---

## 🎯 Features

### Customer Overview Cards

Each customer is displayed as a card showing:

✅ **Company Name** - Easy to identify  
✅ **Status Badge** - Production, Pre-Production, or On Hold  
✅ **Engagement Level** - Active (green), At Risk (yellow), or Critical (red)  
✅ **Health Score** - 0-100 with visual progress bar  
✅ **MAU** - Monthly Active Users (if available)  
✅ **TTIV** - Time to Initial Value (if available)  
✅ **Summary** - Brief engagement description  
✅ **Blocker Alert** - Warning icon if blockers present  
✅ **Industry & Lead** - Additional context  

### Summary Statistics

Top of page shows at-a-glance totals:
- **Total Customers** - Count for the week
- **Active** - Customers with green engagement (healthy)
- **At Risk** - Customers with yellow engagement (needs attention)
- **Critical** - Customers with red engagement (requires immediate action)

### Filtering & Search

**Search:**
- Type to search across company names, industries, and summaries
- Real-time filtering as you type

**Filters:**
- **Status:** All, Production, Pre-Production, On Hold
- **Engagement:** All, Active, At Risk, Critical
- **Health:** All, Critical (<50), Needs Attention (50-75), Healthy (>75)

**Sorting:**
- By Name (alphabetical)
- Health Score (High to Low)
- Health Score (Low to High)
- Engagement Level (Critical first)

### Interactive Cards

**Click any card to:**
- Expand to see full summary text
- Highlight for focus
- (Future: Navigate to detailed customer page)

---

## 📁 Files

```
blocks/customer-overview/
├── customer-overview.js    # Card generation & filtering logic
└── customer-overview.css   # Card styling & responsive design

index.html                  # Home page
```

---

## 🚀 Usage

### Start the Server

```bash
aem up
```

### Open Home Page

```
http://localhost:3000/
```

or

```
http://localhost:3000/index.html
```

### Default Week

The page shows data for the current week (latest available).

To specify a different week, add metadata:

```html
<meta name="week" content="2026-01-15">
```

Or use URL parameter:

```
http://localhost:3000/?week=2026-01-15
```

---

## 🎨 Card Layout

### Card Structure

```
┌─────────────────────────────────────┐
│ Company Name          [Status Badge]│
├─────────────────────────────────────┤
│ Engagement: ● Active                │
│ Health Score: 95 ████████░          │
│ MAU: 4                              │
│ TTIV: 5 days                        │
├─────────────────────────────────────┤
│ Summary: Delivering SEO report...   │
├─────────────────────────────────────┤
│ ⚠️ Has blockers                     │
├─────────────────────────────────────┤
│ Financial Services • Torrey Gardner │
└─────────────────────────────────────┘
```

### Color Coding

**Status Badges:**
- 🟢 **Production** - Green background
- 🔵 **Pre-Production** - Blue background
- 🟡 **On Hold** - Yellow background

**Engagement Indicators:**
- 🟢 **Active** - Green dot (healthy)
- 🟡 **At Risk** - Yellow dot (needs attention)
- 🔴 **Critical** - Red dot (immediate action required)

**Health Score:**
- 🟢 **75-100**: Healthy (green bar)
- 🟠 **50-74**: Needs Attention (orange bar)
- 🔴 **0-49**: Critical (red bar)

**Blocker Alert:**
- ⚠️ Yellow banner when blockers are present

---

## 📊 Statistics Panel

Shows real-time counts based on current filters:

```
┌─────────────┬───────────┬────────────┬──────────┐
│   Total     │  Active   │  At Risk   │ Critical │
│     46      │    35     │     8      │    3     │
└─────────────┴───────────┴────────────┴──────────┘
```

Automatically updates as you filter or search.

---

## 💡 Use Cases

### 1. Daily Check-in

Start your day by:
1. Open home page
2. Review **Critical** and **At Risk** counts
3. Filter by "Critical" engagement
4. Click cards to read summaries
5. Identify customers needing immediate attention

### 2. Customer Search

Find specific customer:
1. Type name in search box
2. Click card to see details
3. Note health score and blockers

### 3. Lead Assignment Review

Filter by specific lead:
1. Use browser Find (Cmd/Ctrl+F)
2. Search for lead name
3. Review all their customers at once

### 4. Status Overview

See production readiness:
1. Filter by "Pre-Production" status
2. Review health scores
3. Identify blockers preventing go-live

### 5. Health Score Audit

Find at-risk customers:
1. Sort by "Health Score (Low to High)"
2. Review customers under 50
3. Check blockers and summaries

---

## 🔧 Customization

### Change Data Source

Edit `index.html`:

```html
<!-- Load from different JSON file -->
<div class="customer-overview" data-source="/api/custom-data.json">
```

### Modify Card Layout

Edit `blocks/customer-overview/customer-overview.js`:

- Line ~30: `createCustomerCard()` function
- Customize HTML structure
- Add/remove metrics
- Change badge logic

### Adjust Styling

Edit `blocks/customer-overview/customer-overview.css`:

- `.customer-card` - Card appearance
- `.stat-card` - Statistics styling
- Color variables for themes

### Add Custom Filters

Edit `blocks/customer-overview/customer-overview.js`:

- Line ~140: `createFilters()` function
- Add new select/input elements
- Update filtering logic in `applyFiltersAndSort()`

---

## 📱 Responsive Design

### Desktop (> 1200px)
- Grid: 3-4 cards per row
- All metrics visible
- Expanded cards span 2 columns

### Tablet (768px - 1200px)
- Grid: 2-3 cards per row
- Stats: 2 per row
- Filters: Wrap to multiple rows

### Mobile (< 768px)
- Grid: 1 card per row (stacked)
- Stats: 2 per row
- Filters: Full width, stacked
- Simplified metrics

---

## 🎯 Navigation

### From Home Page:

**Quick Links Section:**
- **📊 Detailed Table View** → `/engagement-live.html`
  - Full table with all columns
  - Advanced search and filtering
  - Sortable columns

- **📈 Weekly Reports** → `/engagement-weekly.html`
  - Historical data view
  - Week-over-week comparison

- **🔧 Testing Tools** → `/scripts/week-utils-test.html`
  - Test week selection logic
  - Verify data loading

---

## 🔍 Search Tips

**Search by:**
- Company name: "BHG"
- Industry: "Financial"
- Summary keywords: "onboarding", "training", "integration"

**Combine filters:**
1. Search: "Financial"
2. Status: "Production"
3. Health: "Needs Attention"
→ Shows financial services customers in production needing attention

---

## 🚨 Troubleshooting

### Cards Not Showing

**Check:**
1. Data loaded: Open `/data/customers.json`
2. Week has data: Check metadata or URL
3. Browser console for errors
4. Try: `?week=2026-01-23` in URL

### Wrong Week Displayed

**Priority order:**
1. Page metadata: `<meta name="week">`
2. URL parameter: `?week=2026-01-23`
3. Latest from `/data/weeks.json`

### Filters Not Working

**Clear browser cache:**
```bash
# Hard reload
Cmd+Shift+R (Mac)
Ctrl+Shift+R (Windows/Linux)
```

### Slow Loading

**Large datasets:**
- Consider pagination (>100 customers)
- Add loading indicators
- Lazy load card images if added

---

## 📈 Performance

**Current:**
- Loads 46 cards (latest week) in < 100ms
- Filtering: Real-time (< 50ms)
- Sorting: Instant
- Search: As-you-type

**Optimized for:**
- Up to 100 customers per week
- Smooth scrolling and interactions
- Mobile performance

---

## 🎨 Design System

### Colors

```css
Primary: #667eea (purple-blue)
Success: #22c55e (green)
Warning: #f59e0b (orange)
Danger: #ef4444 (red)
Info: #3b82f6 (blue)

Text: #111827 (dark)
Text Light: #6b7280 (gray)
Background: #ffffff (white)
Border: #e5e7eb (light gray)
```

### Typography

```
Headings: System font, bold
Body: System font, regular
Cards: 13-18px
Stats: 36px bold
Labels: 11px uppercase
```

### Spacing

```
Card padding: 20px
Grid gap: 20px
Metric gap: 12px
Section margin: 30-40px
```

---

## ✨ Future Enhancements

**Potential additions:**
- Export to CSV/Excel
- Print-friendly view
- Customer detail modal on click
- Trend indicators (↑↓)
- Comparative metrics (vs. last week)
- Notification badges for new issues
- Drag & drop card arrangement
- Save custom filter presets
- Email alerts for critical customers
- Integration with other tools

---

## 📚 Related Documentation

- **Data Integration**: `/REAL_DATA_INTEGRATION.md`
- **Week Selection**: `/scripts/WEEK_UTILS_README.md`
- **SharePoint Setup**: `/SHAREPOINT_INTEGRATION.md`
- **Quick Start**: `/QUICKSTART_REAL_DATA.md`

---

**Last Updated:** January 22, 2026  
**Version:** 1.0  
**Customers:** 46 (current week) / 598 (total)

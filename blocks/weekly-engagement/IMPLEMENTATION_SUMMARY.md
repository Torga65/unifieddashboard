# Weekly Engagement Block - Implementation Summary

## Overview

The Weekly Engagement block displays customer engagement data in an interactive, filterable table. It shows engagement metrics, health scores, blockers, and feedback for all customers in a given week.

## 1. Table Format for Authors

### Standard Format (with Week column)

Authors paste this table into Google Docs or SharePoint:

```
| Week     | Company Name        | Status      | Engagement | Health Score | Summary of Engagement                    | Blockers                    | Feedback                | Last Updated |
|----------|---------------------|-------------|------------|--------------|------------------------------------------|-----------------------------|-------------------------|--------------|
| 2024-W03 | Acme Corp           | Active      | High       | 95           | Completed Q1 planning, 15 active users   | None                        | Very positive           | 2024-01-22   |
| 2024-W03 | TechStart Inc       | Active      | Medium     | 78           | 8 active users, steady progress          | Budget approval pending     | Needs training          | 2024-01-21   |
| 2024-W03 | Global Solutions    | At Risk     | Low        | 45           | Only 3 active users, minimal engagement  | Technical integration issues| Frustrated with setup   | 2024-01-20   |
```

### Simplified Format (without Week column)

If using page metadata or URL to identify the week:

```
| Company Name        | Status      | Engagement | Health Score | Summary of Engagement                    | Blockers                    | Feedback                | Last Updated |
|---------------------|-------------|------------|--------------|------------------------------------------|-----------------------------|-------------------------|--------------|
| Acme Corp           | Active      | High       | 95           | Completed Q1 planning, 15 active users   | None                        | Very positive           | 2024-01-22   |
| TechStart Inc       | Active      | Medium     | 78           | 8 active users, steady progress          | Budget approval pending     | Needs training          | 2024-01-21   |
```

## 2. Block Transformation (JS Logic)

### Data Parsing

```javascript
// Block reads table rows and converts to structured data
{
  week: "2024-W03",
  companyName: "Acme Corp",
  status: "Active",
  engagement: "High",
  healthScore: 95,
  summary: "Completed Q1 planning...",
  blockers: "None",
  feedback: "Very positive",
  lastUpdated: "2024-01-22"
}
```

### Interactive Features

1. **Filters**
   - Status dropdown: All, Active, At Risk, Onboarding, Churned
   - Engagement dropdown: All, High, Medium, Low, None
   - Health dropdown: All, Critical (<50), Needs Attention (50-75), Healthy (>75)
   - Real-time search across Company, Summary, Blockers, Feedback

2. **Visual Indicators**
   - Color-coded status badges (green, yellow, blue, red)
   - Engagement level badges with distinct colors
   - Health score with progress bar and color coding
   - Hover effects on rows
   
3. **Row Interactions**
   - Click row to expand/highlight
   - Highlighted rows show with blue border
   - Visual feedback on hover

4. **Responsive Design**
   - Desktop: Full table with all columns
   - Tablet: Hide Blockers and Health columns
   - Mobile: Stack cards with labeled fields

### UI Components Generated

```
┌─────────────────────────────────────────────────────────┐
│ Weekly Engagement Report              Showing 10 of 10  │
│ Week: 2024-W03                                          │
├─────────────────────────────────────────────────────────┤
│ [Search...] [Status▼] [Engagement▼] [Health Score▼]    │
├─────────────────────────────────────────────────────────┤
│ Company    │Status│Engagement│Health│Summary│Blockers... │
├────────────┼──────┼──────────┼──────┼───────┼───────────┤
│ Acme Corp  │●Active│ ●High   │ 95 ▓▓│...    │ None      │
│ TechStart  │●Active│ ●Medium │ 78 ▓▓│...    │ Budget... │
│ Global Sol │⚠At Risk│ ●Low   │ 45 ▓ │...    │ Technical │
└─────────────────────────────────────────────────────────┘
```

## 3. Week Identification Rules

### Priority Order

The block determines which week to display using this hierarchy:

#### 1. Page Metadata (Recommended)

Add to document head:
```html
<meta name="week" content="2024-W03"/>
```

Or use AEM Sidekick metadata field:
- Key: `week`
- Value: `2024-W03`

**Why**: Most reliable, controlled by content author

#### 2. URL Parameter

```
https://example.com/engagement?week=2024-W03
https://example.com/engagement/weekly?week=2024-W52
```

**Why**: Allows dynamic week switching without page changes

#### 3. URL Path Pattern

```
https://example.com/engagement/2024-W03
https://example.com/reports/2024-W03/summary
```

Pattern matched: `/(\d{4}-W\d{2})/`

**Why**: Clean, bookmarkable URLs for specific weeks

#### 4. Week Column in Table

If the table includes a Week column, the block reads it:
```
| Week     | Company Name | ... |
| 2024-W03 | Acme Corp    | ... |
```

**Why**: Allows multi-week data in single document

#### 5. Current Week (Fallback)

Calculates ISO week from current date:
```javascript
// January 22, 2024 → 2024-W04
getCurrentWeek() // Returns "2024-W04"
```

**Why**: Automatic default when no week specified

### Week Format

**Standard**: `YYYY-Www`
- `2024-W01` = Week 1 of 2024 (Jan 1-7)
- `2024-W52` = Week 52 of 2024 (Dec 23-29)
- `2024-W03` = Week 3 of 2024 (Jan 15-21)

### Implementation Examples

#### Example 1: Metadata-Based (Single Week per Page)

**Document Setup:**
```html
<head>
  <meta name="week" content="2024-W03"/>
  <title>Engagement Report - Week 3</title>
</head>
```

**Table (no Week column):**
```
| Company | Status | Engagement | Health | Summary | ... |
| Acme    | Active | High       | 95     | ...     | ... |
```

**Result**: Shows only 2024-W03 data

#### Example 2: Multi-Week Table

**Document Setup:** (no metadata)

**Table (with Week column):**
```
| Week     | Company | Status | ... |
| 2024-W03 | Acme    | Active | ... |
| 2024-W03 | TechCo  | Active | ... |
| 2024-W02 | Acme    | Active | ... |
| 2024-W02 | TechCo  | Active | ... |
```

**Result**: Shows only current week (or week from URL param)

#### Example 3: URL-Based Navigation

**Page URL:**
```
https://example.com/engagement?week=2024-W02
```

**Table:** (all weeks)

**Result**: Shows only 2024-W02 data, can change via URL

## 4. Code Structure

### Main Functions

```javascript
// Week identification
getCurrentWeek()        // Calculate current ISO week
getWeekIdentifier()     // Get week from metadata/URL/current

// Data processing
parseTableData(rows)    // Convert table rows to objects
filterByWeek(data, week) // Filter data by target week

// UI generation
createFilters()         // Generate filter controls
createTableHeader()     // Generate table header
createTableRow(item)    // Generate table row

// Interaction
applyFilters(tbody, data, filters) // Apply all filters

// Main entry
decorate(block)         // Initialize and render block
```

### Filter Logic

```javascript
// Real-time filtering
data.filter(item => {
  // Search across text fields
  if (searchTerm && !matchesSearch(item, searchTerm)) return false;
  
  // Filter by status
  if (statusFilter && item.status !== statusFilter) return false;
  
  // Filter by engagement
  if (engagementFilter && item.engagement !== engagementFilter) return false;
  
  // Filter by health score range
  if (healthFilter) {
    if (healthFilter === 'critical' && item.healthScore >= 50) return false;
    if (healthFilter === 'attention' && (item.healthScore < 50 || item.healthScore >= 75)) return false;
    if (healthFilter === 'healthy' && item.healthScore < 75) return false;
  }
  
  return true;
});
```

## 5. Usage Patterns

### Pattern A: Weekly Documents

Create new document each week:
- `engagement-2024-w03.html`
- `engagement-2024-w04.html`
- Each has metadata: `<meta name="week" content="2024-W03"/>`

**Pros**: Simple, clean separation per week
**Cons**: More documents to manage

### Pattern B: Single Master Document

One document with all weeks in table:
- Include Week column in table
- Users navigate via URL: `?week=2024-W03`

**Pros**: Single source of truth
**Cons**: Large table grows over time

### Pattern C: Google Sheets Integration

Maintain data in spreadsheet:
- Export as JSON endpoint
- Block fetches current week data
- Authors only update spreadsheet

**Pros**: Best for frequent updates, multiple contributors
**Cons**: Requires JSON endpoint setup

## 6. Customization Options

### Add Export Functionality

```javascript
// Add export button to header
const exportBtn = document.createElement('button');
exportBtn.textContent = 'Export CSV';
exportBtn.addEventListener('click', () => {
  const csv = convertToCSV(weekData);
  downloadCSV(csv, `engagement-${currentWeek}.csv`);
});
```

### Add Week Navigation

```javascript
// Add previous/next week buttons
const prevWeek = getPreviousWeek(currentWeek);
const nextWeek = getNextWeek(currentWeek);

header.innerHTML += `
  <div class="week-nav">
    <a href="?week=${prevWeek}">← Previous Week</a>
    <a href="?week=${nextWeek}">Next Week →</a>
  </div>
`;
```

### Add Row Detail Modal

```javascript
tr.addEventListener('click', (e) => {
  showDetailModal(item); // Open modal with full details
});
```

## 7. Testing Checklist

- [ ] Table with Week column displays correct week
- [ ] Table without Week column uses metadata
- [ ] URL parameter `?week=2024-W03` works
- [ ] Current week calculation correct
- [ ] All filters work independently
- [ ] Combined filters work together
- [ ] Search highlights matching text
- [ ] Row click expands/highlights
- [ ] Mobile layout stacks correctly
- [ ] Empty state shows when no matches
- [ ] Health score colors correct (red <50, orange 50-75, green >75)
- [ ] Status badges have correct colors
- [ ] Responsive design works on all breakpoints

## 8. Performance Considerations

- **Client-side filtering**: Fast for <100 rows, consider server-side for larger datasets
- **Lazy loading**: Consider pagination for >50 customers
- **Debounce search**: Add 300ms delay to search input
- **Virtual scrolling**: For very large tables (>200 rows)

---

**Version**: 2.0  
**Last Updated**: January 2026  
**Example**: See `engagement-weekly.html` for complete working example

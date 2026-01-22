# Week Selection Utilities

Centralized week selection logic for Adobe Edge Delivery Services.

## Overview

The `week-utils.js` module provides robust week identification across multiple data sources with a clear priority order. It's designed to work with date-based weeks (YYYY-MM-DD format) and handles timezone-aware date comparisons in America/Denver.

## Installation

```javascript
import {
  getWeekFromMeta,
  getWeekFromUrl,
  getCurrentWeekFromDataset,
  resolveSelectedWeek,
  formatWeekDate,
  getWeekRange,
  dateToISOWeek,
} from './scripts/week-utils.js';
```

## Week Selection Priority

The system uses this priority order to determine the current week:

1. **Page Metadata** (`<meta name="week" content="2026-01-15">`)
2. **URL Path** (`/weekly/2026-01-15/`)
3. **Data File** (Latest week from `/data/weeks.json` ≤ today in America/Denver)
4. **Fallback** (null - caller handles default)

## API Reference

### Core Functions

#### `getWeekFromMeta()`

Get week identifier from page metadata.

```javascript
const week = getWeekFromMeta();
// Returns: "2026-01-15" or null
```

**Looks for:**
```html
<meta name="week" content="2026-01-15">
```

**Returns:** `string | null` - Date string in YYYY-MM-DD format

---

#### `getWeekFromUrl(url?)`

Extract week identifier from URL path.

```javascript
const week = getWeekFromUrl();
// From current URL

const week = getWeekFromUrl('/weekly/2026-01-15/');
// From specific URL: "2026-01-15"
```

**Parameters:**
- `url` (optional): URL string to parse. Defaults to `window.location.pathname`

**Matches patterns:**
- `/weekly/2026-01-15/`
- `/engagement/2026-01-15`
- `/reports/2026-01-15/summary`

**Returns:** `string | null` - Date string in YYYY-MM-DD format

---

#### `getCurrentWeekFromDataset(dataUrl?)`

Fetch weeks data and select the latest week ≤ today (America/Denver timezone).

```javascript
const week = await getCurrentWeekFromDataset();
// Returns: "2026-01-20"

const week = await getCurrentWeekFromDataset('/custom/weeks.json');
// Custom data URL
```

**Parameters:**
- `dataUrl` (optional): URL to fetch weeks data. Default: `/data/weeks.json`

**Expected Data Format:**

```json
{
  "weeks": [
    "2025-12-02",
    "2025-12-09",
    "2026-01-06",
    "2026-01-13",
    "2026-01-20"
  ]
}
```

Or simple array:

```json
[
  "2025-12-02",
  "2025-12-09",
  "2026-01-06"
]
```

**Returns:** `Promise<string | null>` - Latest week date ≤ today

**Timezone:** Uses `America/Denver` for "today" comparison

---

#### `resolveSelectedWeek(options?)`

Main function to resolve the selected week using priority order.

```javascript
// Default: Try all sources
const week = await resolveSelectedWeek();

// Skip certain sources
const week = await resolveSelectedWeek({
  skipMeta: true,      // Skip metadata check
  skipUrl: true,       // Skip URL check
  skipDataset: true,   // Skip dataset check
  dataUrl: '/custom/weeks.json', // Custom data URL
});
```

**Parameters:**
- `options` (optional):
  - `dataUrl`: Custom data file URL
  - `skipMeta`: Skip metadata check
  - `skipUrl`: Skip URL check
  - `skipDataset`: Skip dataset check

**Returns:** `Promise<string | null>` - Week identifier or null

**Example:**

```javascript
// In a block's decorate function
export default async function decorate(block) {
  const week = await resolveSelectedWeek();
  
  if (!week) {
    block.innerHTML = '<p>No week selected</p>';
    return;
  }
  
  // Use the week...
}
```

---

### Utility Functions

#### `formatWeekDate(weekStr)`

Format week date for display.

```javascript
formatWeekDate('2026-01-15');
// Returns: "January 15, 2026"
```

**Parameters:**
- `weekStr`: Date string (YYYY-MM-DD)

**Returns:** `string` - Formatted date

---

#### `getWeekRange(weekStr)`

Get the Monday-Sunday range for a given date.

```javascript
const range = getWeekRange('2026-01-15'); // Thursday
// Returns:
// {
//   start: Date,              // Monday of that week
//   end: Date,                // Sunday of that week
//   startStr: "2026-01-12",   // Monday as string
//   endStr: "2026-01-18"      // Sunday as string
// }
```

**Parameters:**
- `weekStr`: Date string (YYYY-MM-DD)

**Returns:** Object with start/end dates

---

#### `dateToISOWeek(dateStr)`

Convert date to ISO week format.

```javascript
dateToISOWeek('2026-01-15');
// Returns: "2026-W03"
```

**Parameters:**
- `dateStr`: Date string (YYYY-MM-DD)

**Returns:** `string` - ISO week format (YYYY-Www)

---

## Usage Examples

### Example 1: Simple Block Integration

```javascript
import { resolveSelectedWeek, formatWeekDate } from '../../scripts/week-utils.js';

export default async function decorate(block) {
  // Get current week
  const week = await resolveSelectedWeek();
  
  if (!week) {
    block.innerHTML = '<p>No week available</p>';
    return;
  }
  
  // Display formatted week
  const title = document.createElement('h2');
  title.textContent = `Week of ${formatWeekDate(week)}`;
  block.appendChild(title);
  
  // Filter your data by week...
}
```

### Example 2: Custom Data Source

```javascript
const week = await resolveSelectedWeek({
  dataUrl: '/api/engagement-weeks.json',
});
```

### Example 3: Skip Metadata, Use Only URL or Dataset

```javascript
const week = await resolveSelectedWeek({
  skipMeta: true,  // Ignore page metadata
});
```

### Example 4: Get Week Range

```javascript
const week = await resolveSelectedWeek();
const range = getWeekRange(week);

console.log(`Week: ${range.startStr} to ${range.endStr}`);
// Week: 2026-01-12 to 2026-01-18
```

### Example 5: Check Multiple Sources

```javascript
const metaWeek = getWeekFromMeta();
const urlWeek = getWeekFromUrl();
const datasetWeek = await getCurrentWeekFromDataset();

console.log('Meta:', metaWeek);
console.log('URL:', urlWeek);
console.log('Dataset:', datasetWeek);
```

## Data File Format

### `/data/weeks.json`

Store your available weeks in chronological order:

```json
{
  "weeks": [
    "2025-12-02",
    "2025-12-09",
    "2025-12-16",
    "2025-12-23",
    "2025-12-30",
    "2026-01-06",
    "2026-01-13",
    "2026-01-20",
    "2026-01-27"
  ]
}
```

**Notes:**
- Dates should be in `YYYY-MM-DD` format
- Can be in any order (sorted automatically)
- System selects latest week ≤ today (America/Denver time)
- Can also be a plain array (without `weeks` key)

## Timezone Handling

All date comparisons for dataset selection use **America/Denver** timezone.

```javascript
// Current date is calculated in Denver timezone
const now = getCurrentDateInDenver();

// Dataset weeks are parsed in Denver timezone
const weekDate = parseDateInDenver('2026-01-15');
```

This ensures consistent week selection regardless of server or client timezone.

## Testing

### Interactive Test Suite

Open the test page in your browser:

```
http://localhost:3000/scripts/week-utils-test.html
```

Features:
- Run all unit tests
- Test individual functions
- Test priority order
- Add/remove metadata dynamically
- View resolved week in real-time
- Console output capture

### Console Testing

Import and run tests directly:

```javascript
import { runWeekUtilsTests } from './scripts/week-utils.js';

// Run all tests
runWeekUtilsTests();
// Output: Test results with pass/fail counts
```

### Manual Testing

```javascript
// Test metadata
const meta = document.createElement('meta');
meta.name = 'week';
meta.content = '2026-01-20';
document.head.appendChild(meta);

const week = await resolveSelectedWeek();
console.log(week); // "2026-01-20"

// Clean up
meta.remove();
```

## Best Practices

### 1. Always Use `resolveSelectedWeek()`

Don't call individual functions directly in production code. Use the resolver:

```javascript
// ✅ Good
const week = await resolveSelectedWeek();

// ❌ Avoid
const week = getWeekFromMeta() || getWeekFromUrl() || await getCurrentWeekFromDataset();
```

### 2. Handle Null Results

Always check if a week was resolved:

```javascript
const week = await resolveSelectedWeek();

if (!week) {
  // Handle no week case
  block.innerHTML = '<p>No week data available</p>';
  return;
}

// Continue with week...
```

### 3. Make Decorate Functions Async

When using week utilities in blocks:

```javascript
export default async function decorate(block) {
  const week = await resolveSelectedWeek();
  // Your code...
}
```

### 4. Use Formatted Dates for Display

```javascript
const week = await resolveSelectedWeek();
const display = formatWeekDate(week);
// "January 20, 2026" - more user-friendly
```

### 5. Update Data File Regularly

Ensure `/data/weeks.json` is updated with new weeks:

```json
{
  "weeks": [
    "2026-01-06",
    "2026-01-13",
    "2026-01-20",  // Current week
    "2026-01-27"   // Add upcoming weeks
  ]
}
```

## Integration with Weekly Engagement Block

The weekly engagement block now uses these utilities:

```javascript
import { resolveSelectedWeek, formatWeekDate } from '../../scripts/week-utils.js';

export default async function decorate(block) {
  // Get current week using priority order
  const currentWeek = await resolveSelectedWeek();
  
  // Filter data by week
  const weekData = currentWeek ? filterByWeek(allData, currentWeek) : allData;
  
  // Display formatted date
  const weekDisplay = currentWeek ? formatWeekDate(currentWeek) : 'All Weeks';
  // ...
}
```

## Troubleshooting

### Week Not Detected

**Check priority order:**

```javascript
console.log('Meta:', getWeekFromMeta());
console.log('URL:', getWeekFromUrl());
const dataset = await getCurrentWeekFromDataset();
console.log('Dataset:', dataset);
```

### Dataset Returns Null

**Verify:**
1. `/data/weeks.json` exists and is accessible
2. JSON format is correct
3. Weeks are in YYYY-MM-DD format
4. At least one week is ≤ today (Denver time)

### Timezone Issues

System uses `America/Denver` for dataset comparisons. If you need a different timezone, modify:

```javascript
function getCurrentDateInDenver() {
  return new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York', // Change here
  });
}
```

### Async/Await Errors

Ensure your block decorate function is async:

```javascript
// ✅ Correct
export default async function decorate(block) {
  const week = await resolveSelectedWeek();
}

// ❌ Wrong - will cause errors
export default function decorate(block) {
  const week = await resolveSelectedWeek(); // Error!
}
```

## Migration Guide

### From ISO Week Format (YYYY-Www)

If you were using ISO week format, update to date format:

**Before:**
```html
<meta name="week" content="2024-W03">
```

**After:**
```html
<meta name="week" content="2026-01-20">
```

**Convert Existing Code:**
```javascript
// Old
const week = '2024-W03';

// New
import { dateToISOWeek } from './scripts/week-utils.js';
const week = '2026-01-20';
const isoWeek = dateToISOWeek(week); // "2026-W03" if needed
```

## Performance

- **Metadata check**: < 1ms (synchronous)
- **URL check**: < 1ms (synchronous)
- **Dataset fetch**: 10-50ms (async, one-time per page load)
- **Date parsing**: < 1ms per date

No caching is implemented as the resolution happens once per block initialization.

---

**Version:** 1.0  
**Last Updated:** January 2026  
**Author:** EDS Team

# Debugging: Customer Data Not Showing

## ✅ Data Confirmed Present

Your data IS there! Here's what we verified:

```
Total Records: 598 customers
Week 2026-01-23: 46 customers including:
  - ASO - Australian Postal Corporation
  - ASO - BHG Financial
  - ASO - Breville
  - ASO - Casio Computer Co
  - And 42 more real customers!
```

## 🔍 Debugging Steps

### Step 1: Test the Simple Page

```bash
# Start server (if not running)
aem up

# Open test page
http://localhost:3000/test-overview.html
```

This is a minimal page with just the customer-overview block.

### Step 2: Check Browser Console

1. Open page: `http://localhost:3000/test-overview.html`
2. Open Developer Tools: **F12** or **Cmd+Option+I** (Mac)
3. Click **Console** tab
4. Look for these messages:

```
✅ Customer Overview: Loading from /data/customers.json
✅ Customer Overview: Loaded 598 records
✅ Customer Overview: Current week 2026-01-23
✅ Customer Overview: Filtered to 46 customers for week 2026-01-23
✅ Sample customers: ["ASO - Australian Postal Corporation", ...]
```

### Step 3: Check Network Tab

1. In Developer Tools, click **Network** tab
2. Reload page (Cmd+R or Ctrl+R)
3. Look for `/data/customers.json`
4. Should show: **Status 200** (green)
5. Click on it → **Preview** tab → Should show JSON data

### Step 4: Hard Reload

Clear any cached JavaScript:

```
Mac: Cmd + Shift + R
Windows/Linux: Ctrl + Shift + R
```

Or:
- Chrome: Cmd+Shift+Delete → Clear cache
- Firefox: Cmd+Shift+Delete → Clear cache

## 🚨 Common Issues & Fixes

### Issue #1: "Loading customer data..." Never Changes

**Cause:** JavaScript module not loading or error

**Fix:**
1. Check browser console for red errors
2. Look for "Failed to load module" or "Import error"
3. Try hard reload (Cmd+Shift+R)

### Issue #2: "No customer data available"

**Cause:** Data file not accessible

**Fix:**
```bash
# Verify file exists
ls -lh data/customers.json

# Test endpoint directly
curl http://localhost:3000/data/customers.json | head -50

# Check if valid JSON
cat data/customers.json | python3 -m json.tool > /dev/null && echo "✅ Valid JSON"
```

### Issue #3: "No customer data available for selected week"

**Cause:** Week mismatch

**Fix:**
```bash
# Check what weeks are available
cat data/customers.json | python3 -c "
import json, sys
data = json.load(sys.stdin)
weeks = sorted(set(r['week'] for r in data['data']))
print('Available weeks:', weeks)
"

# Try different week
http://localhost:3000/test-overview.html?week=2026-01-15
```

### Issue #4: Block Not Loading

**Cause:** EDS not recognizing the block

**Fix:**
1. Check file structure:
   ```bash
   ls -la blocks/customer-overview/
   # Should show:
   # customer-overview.js
   # customer-overview.css
   ```

2. Check file names match exactly (case-sensitive)

3. Restart `aem up`

### Issue #5: Old Cached Version

**Cause:** Browser showing old version

**Fix:**
```bash
# Stop server
# Press Ctrl+C

# Start fresh
aem up

# Hard reload browser
Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
```

## 🧪 Quick Tests

### Test 1: Data Endpoint

```bash
curl http://localhost:3000/data/customers.json | python3 -c "
import json, sys
data = json.load(sys.stdin)
print(f'Total: {len(data[\"data\"])} customers')
print(f'First: {data[\"data\"][0][\"companyName\"]}')
"
```

Expected:
```
Total: 598 customers
First: ASO - Australian Postal Corporation
```

### Test 2: Week Utils

```
http://localhost:3000/scripts/week-utils-test.html
```

Click "Show Resolved Week" button.
Should show: `2026-01-23` or latest available week.

### Test 3: Manual Block Test

Create test file: `test-simple.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>Simple Test</title>
</head>
<body>
  <main>
    <div>
      <h1>Test</h1>
      <div class="customer-overview" data-source="/data/customers.json"></div>
    </div>
  </main>
</body>
</html>
```

Open: `http://localhost:3000/test-simple.html`

## 📊 Verify Data Structure

Run this to see your actual data:

```bash
cat data/customers.json | python3 -c "
import json, sys
data = json.load(sys.stdin)

print('Data Structure Check:')
print('=' * 50)
print(f'Total records: {len(data[\"data\"])}')
print(f'Keys in first record: {list(data[\"data\"][0].keys())}')
print()
print('First customer:')
customer = data['data'][0]
print(f'  Company: {customer[\"companyName\"]}')
print(f'  Week: {customer[\"week\"]}')
print(f'  Status: {customer[\"status\"]}')
print(f'  Engagement: {customer[\"engagement\"]}')
print(f'  Health: {customer[\"healthScore\"]}')
print()
print('Week 2026-01-23 customers:')
week_customers = [r for r in data['data'] if r['week'] == '2026-01-23']
print(f'  Count: {len(week_customers)}')
for i, c in enumerate(week_customers[:5], 1):
    print(f'  {i}. {c[\"companyName\"]} - {c[\"engagement\"]}')
"
```

## 🎯 Expected Output

When working correctly, you should see:

### Browser (test-overview.html):

```
┌─────────────────────────────────────────┐
│  Total: 46  │ Active: 35 │ At Risk: 8  │
├─────────────────────────────────────────┤
│ [Search] [Filters...]                    │
├─────────────────────────────────────────┤
│ ┌───────────────┐ ┌───────────────┐    │
│ │ASO - Austral..│ │ASO - BHG Fin..│    │
│ │● Active       │ │● Active       │    │
│ │Health: 62 ███ │ │Health: 100 ███│    │
│ └───────────────┘ └───────────────┘    │
│                  ... 44 more cards      │
└─────────────────────────────────────────┘
```

### Browser Console:

```
Customer Overview: Loading from /data/customers.json
Customer Overview: Loaded 598 records
Customer Overview: Current week 2026-01-23
Customer Overview: Filtered to 46 customers for week 2026-01-23
Customer Overview: Rendering 46 customer cards
Sample customers: (3) ['ASO - Australian Postal Corporation', ...]
```

## 🔧 Nuclear Option: Fresh Start

If nothing works:

```bash
# 1. Stop server
# Press Ctrl+C

# 2. Clear any caches
rm -rf .cache/ 2>/dev/null

# 3. Restart
aem up

# 4. Open incognito/private window
# Chrome: Cmd+Shift+N
# Firefox: Cmd+Shift+P

# 5. Navigate to
http://localhost:3000/test-overview.html
```

## 📞 Next Steps

1. **Try test page:** `http://localhost:3000/test-overview.html`
2. **Check console:** Open DevTools (F12)
3. **Look for errors:** Red messages in console
4. **Share console output:** Copy any errors you see

The data is definitely there (598 customers, 46 for this week). It's just a matter of the block loading correctly!

---

## Quick Command Reference

```bash
# Start server
aem up

# Test data file
curl http://localhost:3000/data/customers.json | python3 -m json.tool | head

# Check structure
cat data/customers.json | python3 -c "import json,sys; d=json.load(sys.stdin); print(len(d['data']))"

# List blocks
ls -la blocks/

# Hard reload browser
Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
```

---

**The data is there! Let's get it showing on the page.** 🎯

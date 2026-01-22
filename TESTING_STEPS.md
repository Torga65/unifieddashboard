# 🧪 Testing Steps - Debugging Customer Data Issue

## Test 1: Simple Data Load (No EDS blocks)

```bash
# Open this page
http://localhost:3000/test-simple.html
```

**What this tests:** Whether the data file loads correctly without any EDS complexity.

**Expected result:** 
- Page shows "✅ Data Loaded Successfully!"
- Lists 46 customers for week 2026-01-23
- Console shows customer names

**If this FAILS:** The data file isn't accessible (check if `aem up` is running)

**If this WORKS:** Data is fine, issue is with the EDS block loading

---

## Test 2: Block with Explicit Scripts

```bash
# Open this page
http://localhost:3000/test-overview.html
```

**What this tests:** The customer-overview block with explicit script tags

**Expected result:**
- Customer cards appear
- Search/filter controls visible

**If this FAILS:** 
- Open console (F12)
- Look for JavaScript errors
- Check if module failed to load

---

## Test 3: Check Browser Console

1. Open: `http://localhost:3000/test-simple.html`
2. Press **F12** (or Cmd+Option+I)
3. Look at **Console** tab

**You should see:**
```
=== SIMPLE TEST STARTING ===
Fetch response status: 200
✅ Data loaded: 598 records
First 3 customers:
  1. ASO - Australian Postal Corporation - 2025-09-17
  2. ASO - Astellas - 2025-09-17
  ...
✅ Week 2026-01-23: 46 customers
  1. ASO - Australian Postal Corporation - Active - Health: 62
  2. ASO - BHG Financial - Active - Health: 100
  ...
```

---

## Test 4: Check Home Page Console

1. Open: `http://localhost:3000/`
2. Press **F12**
3. Look at **Console** tab

**You should see:**
```
Customer Overview: Loading from /data/customers.json
Customer Overview: Loaded 598 records
Customer Overview: Current week 2026-01-23
Customer Overview: Filtered to 46 customers for week 2026-01-23
...
```

**If you see errors instead:**
- Copy the exact error message
- Look for "Failed to load module" or import errors

---

## Quick Diagnostic

Run this in terminal:

```bash
# 1. Check if server is running on port 3000
lsof -i :3000

# 2. Test data endpoint directly
curl http://localhost:3000/data/customers.json | python3 -c "import json,sys; d=json.load(sys.stdin); print(f'✅ {len(d[\"data\"])} customers loaded')"

# 3. Check block files
ls -la blocks/customer-overview/

# 4. Check main scripts
ls -la scripts/
```

---

## What to Share

When you run the tests, please share:

1. **Test 1 (test-simple.html):**
   - What do you see on the page?
   - What's in the console?

2. **Test 2 (test-overview.html):**
   - What do you see on the page?
   - Any errors in console?

3. **Home page (index.html):**
   - What do you see?
   - Console messages/errors?

This will help pinpoint exactly where the issue is! 🎯

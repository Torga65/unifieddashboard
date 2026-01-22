# 🏠 Check Home Page Console

Since test-simple.html works (showing real data), let's check the home page console to see what's happening.

## Steps:

1. **Open home page:**
   ```
   http://localhost:3000/
   ```

2. **Do HARD RELOAD first:**
   - **Mac:** Press `Cmd + Shift + R`
   - **Windows:** Press `Ctrl + Shift + R`

3. **Open Browser Console:**
   - Press `F12` (or `Cmd + Option + I` on Mac)
   - Click **Console** tab

4. **Look for these specific messages:**
   ```
   Customer Overview: Loading from /data/customers.json
   Customer Overview: Loaded XXX records
   Customer Overview: Current week YYYY-MM-DD
   Customer Overview: Filtered to XX customers
   Customer Overview: Rendering XX customer cards
   Sample customers: [...]
   ```

## What to Check:

### ✅ If you see these messages with real data:
- "Loaded 598 records"
- "Filtered to 46 customers"
- "Sample customers: ['ASO - Australian Postal Corporation', ...]"

**Then the block IS working!** You should see customer cards on the page.

### ❌ If you see errors:
- Look for red error messages
- Check for "Failed to load module"
- Check for "404 Not Found"

### ⚠️ If you see different numbers:
- "Loaded 0 records" → Data not loading
- "Filtered to 0 customers" → Week mismatch

### 🤔 If you see NO console messages at all:
- The block isn't being loaded
- Script might not be running

## Quick Check:

While on the home page (http://localhost:3000/):

**Run this in the Console tab:**
```javascript
// Check if customer-overview block exists
document.querySelector('.customer-overview')
```

**Should return:** The DOM element (not `null`)

**Then run:**
```javascript
// Check data-source attribute
document.querySelector('.customer-overview').dataset.source
```

**Should return:** `"/data/customers.json"`

## Please Share:

1. **Console Output:** Copy all the "Customer Overview:" messages
2. **Any Errors:** Copy any red error messages
3. **What you see on page:** 
   - Customer cards with company names?
   - Just the hero section?
   - "Loading..." that never changes?
   - Something else?

---

## Expected Result:

You should see a page with:

1. **Hero Section:** Purple gradient with "AEM Sites Optimizer" title
2. **Customer Overview Section:** 
   - Stats bar showing "Total: 46, Active: 35, At Risk: 8, Critical: 3"
   - Search and filters
   - Grid of customer cards showing:
     - ASO - Australian Postal Corporation
     - ASO - BHG Financial
     - ASO - Breville
     - etc.
3. **Quick Links section**
4. **About the Dashboard section**

---

## If Cards Show But Wrong Names:

If you see customer cards but NOT the real company names from your spreadsheet, please:

1. **Click on a card** (or inspect it)
2. **Share the company name** you see
3. **Check console** for the "Sample customers:" line

This will tell us if it's loading different data or if there's a display issue.

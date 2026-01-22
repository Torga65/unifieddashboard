# Testing the Customer Overview

## Quick Test

1. **Start server:**
   ```bash
   aem up
   ```

2. **Open test page:**
   ```
   http://localhost:3000/test-overview.html
   ```

3. **Open Browser Console (F12 or Cmd+Option+I)**
   Look for console messages:
   - "Customer Overview: Loading from /data/customers.json"
   - "Customer Overview: Loaded 598 records"
   - "Customer Overview: Current week 2026-01-23"
   - "Customer Overview: Filtered to 46 customers..."
   - "Sample customers: [...]"

4. **Check for errors**
   - Any red error messages?
   - Is data loading?

## Expected Result

You should see 46 customer cards displayed including:
- ASO - Australian Postal Corporation
- ASO - BHG Financial  
- ASO - Breville
- ASO - Casio Computer Co
- And 42 more...

## If No Data Shows

### Check #1: Is data loading?
```bash
# Test the endpoint directly
curl http://localhost:3000/data/customers.json | python3 -m json.tool | head -50
```

### Check #2: Is the block being loaded?
Open browser console and check for:
- Module loading errors
- JavaScript errors
- Network errors (F12 → Network tab)

### Check #3: Week mismatch?
Try different week:
```
http://localhost:3000/test-overview.html?week=2026-01-15
```

### Check #4: Clear cache
```
Hard reload: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
```

## Troubleshooting Commands

### Check data file exists
```bash
ls -lh data/customers.json
head -20 data/customers.json
```

### Count customers per week
```bash
cat data/customers.json | python3 -c "
import json, sys
from collections import Counter
data = json.load(sys.stdin)
weeks = Counter(r['week'] for r in data['data'])
for week, count in sorted(weeks.items()):
    print(f'{week}: {count} customers')
"
```

### Test week utils
```
http://localhost:3000/scripts/week-utils-test.html
```

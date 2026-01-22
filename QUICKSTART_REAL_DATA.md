# Quick Start: Real Customer Data

## 🎯 Your SharePoint Data is Live!

**✅ Status:** Successfully integrated 598 customer records from SharePoint Excel

---

## 🚀 Test It Now (3 Steps)

### Step 1: Start Server
```bash
cd /Users/tgardner/Documents/unified-dashboard/unifieddashboard
aem up
```

### Step 2: Open Pages

**Live Data Page (Recommended):**
```
http://localhost:3000/engagement-live.html
```
→ Shows latest week (Jan 23, 2026) with 46 customers

**Static Example:**
```
http://localhost:3000/engagement-weekly.html
```
→ Shows hardcoded sample data

**Data Endpoints:**
```
http://localhost:3000/data/customers.json    (598 records)
http://localhost:3000/data/weeks.json        (16 weeks)
```

### Step 3: Test Features

1. **Search:** Type company name, e.g., "BHG"
2. **Filter Status:** Try "Production", "Pre-Production"
3. **Filter Engagement:** Try "Active", "At Risk", "Critical"
4. **Filter Health:** Try "Healthy", "Needs Attention", "Critical"
5. **Click Rows:** Click any row to highlight

---

## 📊 Your Data

```
Source: AEM_Sites_Optimizer-CustomerExperience.xlsx
Location: /data/AEM_Sites_Optimizer-CustomerExperience.xlsx

Converted to: /data/customers.json
Total Records: 598
Weeks: 16 (Sept 2025 - Jan 2026)
Latest Week: 2026-01-23 (46 customers)

Sample Companies:
- ASO - Australian Postal Corporation
- ASO - BHG Financial
- ASO - Breville
- ASO - Cox Communications
... and 42 more in latest week
```

---

## 🔄 Update Data When Excel Changes

```bash
# 1. Download updated Excel from SharePoint
# 2. Copy to project
cp ~/Downloads/AEM_Sites_Optimizer-CustomerExperience.xlsx data/

# 3. Run converter
python3 scripts/convert-customer-data.py

# 4. Refresh browser - data updates automatically!
```

---

## 🎨 Customize

### Change Week Displayed

Edit `engagement-live.html`:
```html
<!-- Show different week -->
<meta name="week" content="2026-01-15">
```

Or use URL parameter:
```
http://localhost:3000/engagement-live.html?week=2026-01-15
```

### Use in Other Pages

Add to any HTML page:
```html
<div class="weekly-engagement" data-source="/data/customers.json">
  <!-- Data loads automatically -->
</div>
```

---

## 📁 Key Files

```
✅ data/customers.json                  → Your 598 customer records
✅ engagement-live.html                 → Live data page
✅ scripts/convert-customer-data.py     → Data converter
✅ REAL_DATA_INTEGRATION.md             → Full documentation
```

---

## 🎉 What's Working

- ✅ 598 customer records loaded
- ✅ 16 weeks of historical data
- ✅ Real-time search across all fields
- ✅ Filter by status, engagement, health
- ✅ Automatic week detection
- ✅ Health scores calculated
- ✅ Click to highlight rows
- ✅ Responsive mobile design

---

## 🔍 Verify Data

Check a specific customer:
```bash
# View all BHG Financial records
cat data/customers.json | python3 -m json.tool | grep -A 20 "BHG Financial"
```

Count by week:
```bash
# Count customers per week
cat data/customers.json | python3 -c "
import json, sys
from collections import Counter
data = json.load(sys.stdin)
weeks = Counter(r['week'] for r in data['data'])
for week, count in sorted(weeks.items()):
    print(f'{week}: {count} customers')
"
```

---

**You're all set!** 🚀

Open `http://localhost:3000/engagement-live.html` to see your real customer data in action!

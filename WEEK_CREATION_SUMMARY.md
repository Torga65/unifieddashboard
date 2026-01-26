# ✅ New Week Creation System - Ready!

Automatic weekly data generation is now set up and ready to use.

---

## 📊 Current Status

**Your data:**
- **16 weeks** of historical data
- **Latest week:** January 23, 2026
- **46 customers** in latest week

**Next week:**
- Will create: **January 30, 2026** (next Sunday)
- Will copy: **46 customers**
- Will clear: **Summary of Engagement** field

---

## 🚀 Run It Now

```bash
cd /Users/tgardner/Documents/unified-dashboard/unifieddashboard
python3 scripts/create-new-week.py
```

**Expected output:**
```
============================================================
  📊 Create New Week - Customer Data Generator
============================================================

📊 Creating new week data...
📅 Latest week: 2026-01-23
🆕 New week: 2026-01-30
📋 Found 46 customers to copy
✅ Saved data

✅ Successfully created new week: 2026-01-30
📊 Copied 46 customers from 2026-01-23
📝 Summary field cleared for all customers
📈 Total records in dataset: 782 (16 weeks + new week)

📅 All weeks in dataset (17 weeks):
   2026-01-30: 46 customers ← NEW
   2026-01-23: 46 customers
   2026-01-16: 46 customers
   ...

============================================================
✅ Done! Refresh your browser to see the new week.
============================================================
```

---

## 📁 Files Created

### Main Script
- **`scripts/create-new-week.py`** (executable Python script)
  - Reads `data/customers.json`
  - Finds latest week
  - Calculates next Sunday
  - Copies all customers
  - Clears summary fields
  - Saves updated JSON

### Documentation
- **`NEW_WEEK_CREATION.md`** - Complete guide (detailed)
- **`QUICK_START_NEW_WEEK.md`** - Quick reference (1-page)
- **`WEEK_CREATION_SUMMARY.md`** - This file (status)

---

## 🎯 How It Works

### Step-by-Step

1. **Script reads:** `data/customers.json`
   ```json
   {
     "data": [
       {
         "week": "2026-01-23",
         "companyName": "Adobe",
         "status": "Production",
         "healthScore": 85,
         "summary": "Completed feature rollout",
         ...all other fields...
       },
       ...45 more customers...
     ]
   }
   ```

2. **Script creates:** New week `2026-01-30`
   ```json
   {
     "week": "2026-01-30",
     "companyName": "Adobe",
     "status": "Production",
     "healthScore": 85,
     "summary": "",  ← CLEARED
     ...all other fields copied...
   }
   ```

3. **Script appends:** To existing data
   - Original 16 weeks: 736 records
   - New week: +46 records
   - Total: 782 records

4. **Script sorts:** By week (newest first), then company name

5. **Script saves:** Updated `customers.json`

---

## 🔄 Weekly Routine

### Every Sunday

**Morning (6 AM recommended):**
```bash
# Step 1: Create new week
cd /Users/tgardner/Documents/unified-dashboard/unifieddashboard
python3 scripts/create-new-week.py

# Step 2: Verify in browser
open http://localhost:3000/customer-full-table
# Click "📍 Current Week" button
```

**During Week:**
- Enable Edit Mode
- Update "Summary of Engagement" for each customer
- Save changes (localStorage or export)

**Friday:**
- Review all summaries complete
- Commit to git (optional)

---

## 📋 What Gets Copied vs Cleared

### ✅ Copied (27 fields)
1. Company Name
2. License Type
3. Industry
4. ESE Lead
5. Status
6. Delay Reason
7. Close Date
8. Onboard Date
9. Deployment Type
10. Headless
11. Engagement
12. Blockers
13. Feedback
14. Health Score
15. MAU
16. TTIV
17. Oppty Realized
18. Preflight
19. Auto-Optimize Enabled
20. Auto-Optimize Button Pressed
21. Service Principle Deployed
22. Brand Profile
23. AEMY Deployed
24. Code Repo
25. Auth Implementation
26. Workflow Manager
27. Customer Self Serve

### ❌ Cleared (1 field)
- **Summary of Engagement** → Set to `""`

---

## 🛡️ Safety Features

### Built-in Protection
- ✅ Validates data file exists
- ✅ Checks for existing weeks (prevents duplicates)
- ✅ Confirms Sunday dates (or asks permission)
- ✅ Shows preview before saving
- ✅ Sorts data consistently

### Manual Backup
```bash
# Before running script
cp data/customers.json data/customers.json.backup

# If something goes wrong
cp data/customers.json.backup data/customers.json
```

---

## 🎨 Dashboard Integration

**Automatic - No Changes Needed!**

The dashboard already:
- ✅ Loads all weeks dynamically
- ✅ Shows new week in dropdown
- ✅ "Current Week" button jumps to latest
- ✅ Edit Mode works with new week
- ✅ Filters work with new week
- ✅ Export includes new week

---

## 📝 Example Timeline

### Today: January 22, 2026 (Wednesday)
```
Current data: 16 weeks
Latest: 2026-01-23 (46 customers)
```

### Sunday: January 26, 2026
```bash
# Don't run yet - not Sunday after latest week
# Would create 2026-01-30 (which is correct next Sunday)
```

### Sunday: January 30, 2026 ← **CORRECT TIME**
```bash
python3 scripts/create-new-week.py
# Creates: 2026-01-30
# Copies from: 2026-01-23
# Result: 17 weeks total
```

### Sunday: February 6, 2026
```bash
python3 scripts/create-new-week.py
# Creates: 2026-02-06
# Copies from: 2026-01-30
# Result: 18 weeks total
```

---

## 🔧 Advanced Options

### Create Specific Week
```bash
# Create week for specific Sunday
python3 scripts/create-new-week.py --date 2026-02-01
```

### Overwrite Existing Week
```bash
# If week already exists, script asks:
# "Overwrite existing data for this week? (y/n):"
# Answer 'y' to regenerate from previous week
```

### Non-Sunday Date
```bash
# Script warns:
# "⚠️  Warning: 2026-01-31 is not a Sunday (it's a Friday)"
# "Continue anyway? (y/n):"
# Usually answer 'n' and use correct Sunday
```

---

## 🐛 Troubleshooting

### "python3: command not found"
**Fix:**
```bash
# Check Python installation
which python3
python3 --version

# If not installed, install Python 3
```

### "No such file or directory"
**Fix:**
```bash
# Make sure you're in the right directory
cd /Users/tgardner/Documents/unified-dashboard/unifieddashboard

# Verify script exists
ls -l scripts/create-new-week.py
```

### "Permission denied"
**Fix:**
```bash
chmod +x scripts/create-new-week.py
```

### "Week already exists"
**Options:**
1. Overwrite: Answer 'y'
2. Skip: Answer 'n'
3. Check what week would be created:
   ```bash
   python3 -c "from datetime import datetime, timedelta; latest='2026-01-23'; next_sun = datetime.strptime(latest, '%Y-%m-%d') + timedelta(days=7); print(next_sun.strftime('%Y-%m-%d'))"
   ```

---

## ⚙️ Automation Ideas

### Option 1: Calendar Reminder
- **Set recurring event:** Every Sunday 6 AM
- **Title:** "Create New Customer Week"
- **Command:** Run script

### Option 2: Cron Job
```bash
# Edit crontab
crontab -e

# Add line (runs every Sunday at 6 AM)
0 6 * * 0 cd /Users/tgardner/Documents/unified-dashboard/unifieddashboard && /usr/bin/python3 scripts/create-new-week.py
```

### Option 3: Shell Alias
```bash
# Add to ~/.zshrc or ~/.bashrc
alias newweek="cd /Users/tgardner/Documents/unified-dashboard/unifieddashboard && python3 scripts/create-new-week.py"

# Then just run:
newweek
```

---

## ✅ Testing Checklist

Before first production use:

**Pre-Flight:**
- [ ] Script is executable: `ls -l scripts/create-new-week.py`
- [ ] Python 3 installed: `python3 --version`
- [ ] Data file exists: `ls -l data/customers.json`
- [ ] Data file is valid JSON: `python3 -c "import json; json.load(open('data/customers.json'))"`
- [ ] Know latest week: Currently `2026-01-23`

**Test Run:**
- [ ] Backup data: `cp data/customers.json data/customers.json.backup`
- [ ] Run script: `python3 scripts/create-new-week.py`
- [ ] Check output: Should show new week `2026-01-30`
- [ ] Verify record count: 782 total (736 + 46)
- [ ] Check summaries cleared: Open JSON, search for `"summary": ""`

**Dashboard Check:**
- [ ] Refresh browser: `http://localhost:3000/customer-full-table`
- [ ] See new week in dropdown
- [ ] Click "Current Week" button
- [ ] Verify 46 customers shown
- [ ] Check "Summary of Engagement" column is blank
- [ ] Test Edit Mode works
- [ ] Test filters work

**Cleanup (if test):**
- [ ] Restore backup: `cp data/customers.json.backup data/customers.json`
- [ ] Or keep new week if ready to use

---

## 📊 Data Growth Projection

Starting from 16 weeks (736 records):

| Week | Date | Total Records | Growth |
|------|------|---------------|--------|
| 16 | 2026-01-23 | 736 | baseline |
| 17 | 2026-01-30 | 782 | +46 |
| 18 | 2026-02-06 | 828 | +46 |
| 19 | 2026-02-13 | 874 | +46 |
| 20 | 2026-02-20 | 920 | +46 |
| ... | ... | ... | +46/week |
| 52 | 2026-08-xx | 2,392 | +1,656 |
| 104 | 2027-01-xx | 4,784 | +4,048 |

**File size:**
- Current: ~1.5 MB (736 records)
- 1 year (52 weeks): ~4 MB
- 2 years (104 weeks): ~8 MB

**Performance:** No issues expected until 10,000+ records

---

## 🎯 Summary

### What You Have Now
- ✅ **Executable script:** `scripts/create-new-week.py`
- ✅ **Complete documentation:** 3 guide files
- ✅ **Current data:** 16 weeks, 46 customers/week
- ✅ **Next week ready:** 2026-01-30 can be created
- ✅ **Dashboard ready:** No changes needed

### What To Do Next
1. **Test it:** Run script once to verify
2. **Set reminder:** Calendar or cron
3. **Document process:** Add to team wiki
4. **Train team:** Show how to update summaries

### Quick Command
```bash
python3 scripts/create-new-week.py
```

---

**Your new week creation system is ready to go!** 🎉

Every Sunday, one command creates a fresh week with all data copied and summaries cleared.

**Next Sunday (Jan 30):** Run the script and start the new week!

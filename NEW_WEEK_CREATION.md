# ✅ New Week Creation - Automated Data Generation

Automatically create a new week's customer data every Sunday by copying the previous week.

---

## 🎯 What It Does

**Every Sunday, create a new week with:**
- ✅ All customer records copied from previous week
- ✅ All fields preserved (Status, Health Score, Engagement, etc.)
- ❌ **Summary of Engagement cleared** (blank for new week)

This allows you to:
1. Start fresh each week with updated summaries
2. Track week-over-week changes
3. Maintain historical data continuity

---

## 🚀 Quick Start

### Create Next Week (Automatic)
```bash
cd /Users/tgardner/Documents/unified-dashboard/unifieddashboard
python3 scripts/create-new-week.py
```

**What happens:**
1. Reads current `data/customers.json`
2. Finds latest week (e.g., 2026-01-23)
3. Calculates next Sunday (e.g., 2026-01-30)
4. Copies all customer data
5. Clears "Summary of Engagement" field
6. Saves updated JSON file

---

## 📅 Usage Examples

### Example 1: Create Next Week Automatically
```bash
python3 scripts/create-new-week.py
```

**Output:**
```
============================================================
  📊 Create New Week - Customer Data Generator
============================================================

📊 Creating new week data...
Data file: /Users/.../data/customers.json
📅 Latest week: 2026-01-23
🆕 New week: 2026-01-30
📋 Found 46 customers to copy
✅ Saved data to /Users/.../data/customers.json

✅ Successfully created new week: 2026-01-30
📊 Copied 46 customers from 2026-01-23
📝 Summary field cleared for all customers
📈 Total records in dataset: 644

📅 All weeks in dataset (17 weeks):
   2026-01-30: 46 customers ← NEW
   2026-01-23: 46 customers
   2026-01-16: 46 customers
   2026-01-09: 46 customers
   2026-01-02: 46 customers
   ... and 12 more weeks

============================================================
✅ Done! Refresh your browser to see the new week.
============================================================
```

### Example 2: Create Specific Week
```bash
python3 scripts/create-new-week.py --date 2026-02-01
```

Creates week for February 1, 2026 (must be a Sunday).

### Example 3: Overwrite Existing Week
If you need to regenerate a week:
```bash
python3 scripts/create-new-week.py --date 2026-01-30
```

Script will prompt:
```
⚠️  Warning: Week 2026-01-30 already exists in the data
Overwrite existing data for this week? (y/n): y
🗑️  Removed existing data for 2026-01-30
✅ Successfully created new week: 2026-01-30
```

---

## 🔄 Weekly Workflow

### Every Sunday Morning

**Step 1: Create New Week**
```bash
cd /Users/tgardner/Documents/unified-dashboard/unifieddashboard
python3 scripts/create-new-week.py
```

**Step 2: Open Dashboard**
```bash
# Make sure dev server is running
aem up

# Open in browser
open http://localhost:3000/customer-full-table
```

**Step 3: Select New Week**
- Week dropdown will show new week at top
- Click "📍 Current Week" button to jump to it
- All customers appear with blank "Summary of Engagement"

**Step 4: Update Summaries**
- Enable Edit Mode
- Update each customer's "Summary of Engagement" for the week
- Save changes

**Step 5: Deploy (Optional)**
If using production:
```bash
git add data/customers.json
git commit -m "Add week 2026-01-30 data"
git push
```

---

## 📋 What Gets Copied

### Fields Copied FROM Previous Week
All 27 fields are copied:
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
15. ~~Summary of Engagement~~ ← **CLEARED**
16. MAU
17. TTIV
18. Oppty Realized
19. Preflight
20. Auto-Optimize Enabled
21. Auto-Optimize Button Pressed
22. Service Principle Deployed
23. Brand Profile
24. AEMY Deployed
25. Code Repo
26. Auth Implementation
27. Workflow Manager
28. Customer Self Serve

### Field CLEARED for New Week
- **Summary of Engagement** - Set to empty string `""`
- Allows you to enter fresh weekly updates

---

## 🛡️ Safety Features

### 1. Validation Checks
- ✅ Verifies data file exists
- ✅ Confirms customers exist in latest week
- ✅ Validates date is a Sunday (with override option)
- ✅ Checks for duplicate weeks (with overwrite option)

### 2. Backup Recommendation
Before creating new week:
```bash
# Backup current data
cp data/customers.json data/customers.json.backup

# Create new week
python3 scripts/create-new-week.py

# If something goes wrong, restore:
# cp data/customers.json.backup data/customers.json
```

### 3. Dry Run Check
To see what would happen without changing files:
```bash
# View latest week
python3 -c "import json; data=json.load(open('data/customers.json')); weeks=sorted(set(c['week'] for c in data['data'])); print(f'Latest: {weeks[-1]}'); print(f'Customers: {len([c for c in data[\"data\"] if c[\"week\"]==weeks[-1]])}')"
```

---

## 🔧 Advanced Usage

### Command Line Options

**Help:**
```bash
python3 scripts/create-new-week.py --help
```

**Specify Date:**
```bash
python3 scripts/create-new-week.py --date 2026-02-08
```

**Non-Interactive (For Automation):**
```bash
# Add 'yes' to auto-confirm prompts (future enhancement)
```

---

## 📊 Data Structure

### Before (Week 2026-01-23)
```json
{
  "data": [
    {
      "week": "2026-01-23",
      "companyName": "Adobe",
      "healthScore": 85,
      "status": "Production",
      "summary": "Great progress this week. Launched new feature.",
      ...
    }
  ]
}
```

### After Running Script (Week 2026-01-30 Added)
```json
{
  "data": [
    {
      "week": "2026-01-30",
      "companyName": "Adobe",
      "healthScore": 85,
      "status": "Production",
      "summary": "",
      ...
    },
    {
      "week": "2026-01-23",
      "companyName": "Adobe",
      "healthScore": 85,
      "status": "Production",
      "summary": "Great progress this week. Launched new feature.",
      ...
    }
  ]
}
```

---

## 🗓️ Sunday Calculation

### How It Works
```python
# If latest week is 2026-01-23 (Thursday)
# Next Sunday = 2026-01-26 (3 days later)

# If latest week is 2026-01-26 (Sunday)  
# Next Sunday = 2026-02-02 (7 days later)
```

### Why Sundays?
- **Week starts Sunday** in most business contexts
- **Consistent reporting** - Same day each week
- **Weekend planning** - Prepare summaries over weekend

---

## 🔄 Integration with Dashboard

### Automatic Detection
Dashboard automatically shows new week:
1. **Week dropdown** populates with all weeks
2. **Newest week** appears at top
3. **"Current Week" button** jumps to latest
4. **No code changes** needed

### Edit Mode Integration
1. Select new week
2. Enable Edit Mode
3. Update "Summary of Engagement" for each customer
4. Save changes to localStorage
5. Eventually export/commit to JSON

---

## 📈 Example Timeline

### Week 1: January 23, 2026
- Create initial data
- 46 customers
- All fields populated

### Week 2: January 30, 2026 (Sunday)
```bash
python3 scripts/create-new-week.py
```
- 46 customers copied
- Summary cleared
- Ready for new updates

### Week 3: February 6, 2026 (Sunday)
```bash
python3 scripts/create-new-week.py
```
- Copies from January 30
- Summary cleared again
- Continues historical tracking

---

## 🐛 Troubleshooting

### "No customer data found"
**Issue:** Empty or missing JSON file
**Fix:**
```bash
# Check file exists
ls -lh data/customers.json

# Verify JSON is valid
python3 -c "import json; json.load(open('data/customers.json'))"
```

### "Week already exists"
**Issue:** Trying to create duplicate week
**Options:**
1. **Overwrite:** Answer 'y' when prompted
2. **Skip:** Answer 'n' and run with different date
3. **Manual:** Delete week from JSON first

### "Not a Sunday"
**Issue:** Specified date is not Sunday
**Options:**
1. **Accept warning:** Answer 'y' to continue anyway
2. **Fix date:** Use correct Sunday date

### Script Errors
**Check Python version:**
```bash
python3 --version  # Should be 3.6+
```

**Check file permissions:**
```bash
ls -l scripts/create-new-week.py  # Should be executable
chmod +x scripts/create-new-week.py
```

---

## ⚙️ Automation Options

### Option 1: Cron Job (macOS/Linux)
Run automatically every Sunday at 6 AM:

```bash
# Edit crontab
crontab -e

# Add line:
0 6 * * 0 cd /Users/tgardner/Documents/unified-dashboard/unifieddashboard && /usr/bin/python3 scripts/create-new-week.py
```

### Option 2: Manual Reminder
Set calendar reminder every Sunday morning:
- **Title:** Create New Customer Week
- **Time:** 6:00 AM Sunday
- **Command:** Run `create-new-week.py`

### Option 3: GitHub Actions (Future)
Automate via CI/CD:
```yaml
# .github/workflows/create-week.yml
name: Create New Week
on:
  schedule:
    - cron: '0 6 * * 0'  # Every Sunday 6 AM
```

---

## 📁 Files

### Created Files
- **`scripts/create-new-week.py`** - Main script (executable)
- **`NEW_WEEK_CREATION.md`** - This documentation

### Modified Files
- **`data/customers.json`** - Updated with new week data

---

## ✅ Testing Checklist

Before first use:
- [ ] Verify Python 3 installed: `python3 --version`
- [ ] Check data file exists: `ls data/customers.json`
- [ ] Backup data: `cp data/customers.json data/customers.json.backup`
- [ ] Run script: `python3 scripts/create-new-week.py`
- [ ] Check output shows new week
- [ ] Open dashboard
- [ ] Verify new week in dropdown
- [ ] Click "Current Week" button
- [ ] Confirm all customers present
- [ ] Check "Summary of Engagement" is blank
- [ ] Test Edit Mode works

---

## 💡 Best Practices

### Weekly Routine
1. **Sunday morning:** Run `create-new-week.py`
2. **During week:** Update summaries as you go
3. **Friday:** Review all summaries complete
4. **Commit:** Save to git if using version control

### Data Quality
- ✅ Update summaries in real-time
- ✅ Keep summaries concise (1-3 sentences)
- ✅ Focus on what changed this week
- ✅ Note blockers and wins

### Version Control
```bash
# After creating new week
git add data/customers.json
git commit -m "Add week YYYY-MM-DD"

# After updating summaries
git add data/customers.json  # If using Edit Mode export
git commit -m "Update week YYYY-MM-DD summaries"
git push
```

---

## 🎯 Summary

### What You Get
- ✅ **Automatic week creation** - One command
- ✅ **Data continuity** - All fields preserved
- ✅ **Fresh summaries** - Blank for new updates
- ✅ **Historical tracking** - Complete timeline
- ✅ **No manual copying** - Saves time
- ✅ **Safety checks** - Prevents errors

### Quick Reference
```bash
# Create next week (automatic)
python3 scripts/create-new-week.py

# Create specific Sunday
python3 scripts/create-new-week.py --date 2026-02-01

# Get help
python3 scripts/create-new-week.py --help

# Backup first (recommended)
cp data/customers.json data/customers.json.backup
```

---

**Your new week creation system is ready!** 🎉

Every Sunday, just run one command and you're set for the week!

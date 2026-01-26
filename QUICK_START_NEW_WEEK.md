# ⚡ Quick Start: Create New Week

One-command solution to start a new week every Sunday.

---

## 🚀 Every Sunday

```bash
cd /Users/tgardner/Documents/unified-dashboard/unifieddashboard
python3 scripts/create-new-week.py
```

**That's it!** 🎉

---

## 📋 What Happens

1. **Copies** all customers from last week
2. **Preserves** all fields (Health Score, Status, etc.)
3. **Clears** "Summary of Engagement" field
4. **Creates** new week dated next Sunday
5. **Updates** `data/customers.json`

---

## 🎯 Result

### Before
```
Latest week: 2026-01-23 (46 customers)
```

### After
```
New week: 2026-01-30 (46 customers)
- All data copied
- Summary fields blank
- Ready for updates
```

---

## ✅ Next Steps

1. **Refresh browser**
   ```
   http://localhost:3000/customer-full-table
   ```

2. **Click "📍 Current Week"** button

3. **See new week** with blank summaries

4. **Enable Edit Mode** to update summaries

---

## 📅 Options

### Create Specific Week
```bash
python3 scripts/create-new-week.py --date 2026-02-01
```

### Get Help
```bash
python3 scripts/create-new-week.py --help
```

### Backup First (Recommended)
```bash
cp data/customers.json data/customers.json.backup
```

---

## 🐛 Troubleshooting

**Script not found?**
```bash
cd /Users/tgardner/Documents/unified-dashboard/unifieddashboard
```

**Permission denied?**
```bash
chmod +x scripts/create-new-week.py
```

**Week already exists?**
- Script will ask if you want to overwrite
- Answer 'y' to replace or 'n' to cancel

---

## 💡 Pro Tips

### Set Reminder
- Calendar: "Create New Week" every Sunday 6 AM
- Run script before team meeting

### Version Control
```bash
git add data/customers.json
git commit -m "Add week 2026-01-30"
git push
```

### Verify New Week
```bash
# Check latest week
python3 -c "import json; data=json.load(open('data/customers.json')); print(sorted(set(c['week'] for c in data['data']))[-1])"
```

---

## 📚 Full Documentation

See `NEW_WEEK_CREATION.md` for:
- Detailed usage guide
- Automation options
- Advanced features
- Troubleshooting

---

**Ready to create your first new week?** 🎉

```bash
python3 scripts/create-new-week.py
```

# ⚡ Add New Customer - Quick Reference

Create new customer records directly in the table.

---

## 🚀 Quick Steps

```
1. Open: http://localhost:3000/customer-full-table
2. Click: "✏️ Edit Mode"
3. Click: "➕ Add New Customer" (green button)
4. Fill: Company Name (required)
5. Fill: Other fields (optional)
6. Click: "💾 Save Customer"
7. Done! ✅
```

---

## 📝 Required vs Optional

### Required (1)
- ✅ **Company Name**

### Optional (27)
- All other fields

**You can add with just a name and fill in details later!**

---

## 🎯 Where to Find

**Button Location:**
- Only visible when **Edit Mode is active**
- In the yellow **Edit Mode Notice** banner
- Green button: **"➕ Add New Customer"**

---

## 💾 Where It Saves

**Browser localStorage** - Not permanent in JSON

To make permanent:
1. Add to Excel spreadsheet
2. Re-run `convert-customer-data.py`
3. Deploy updated JSON

---

## ✅ Features

- ✅ 28 fields available
- ✅ Dropdowns for common values
- ✅ Date pickers for dates
- ✅ Number inputs for scores
- ✅ Text areas for long content
- ✅ Validates company name
- ✅ Warns on duplicates
- ✅ Persists across refreshes
- ✅ Works with filters/search
- ✅ Shows in current week only

---

## 🎨 Form Layout

**Modal with 2 columns:**
- Left: Company Name, Industry, Status, etc.
- Right: License Type, ESE Lead, Engagement, etc.
- Full width: Summary, Blockers (text areas)

**28 fields total:**
- Required: 1
- Dropdowns: 12
- Text inputs: 11
- Date inputs: 2
- Number inputs: 2

---

## ⚠️ Important

### Saved to Browser Only
- ✅ Persists across refreshes
- ❌ Not in `customers.json`
- ❌ Not synced to team
- ❌ Not on server

### To Share with Team
Add to Excel → Re-convert → Deploy

---

## 🔧 Troubleshooting

**Button not visible?**
→ Enable Edit Mode first

**Data not saving?**
→ Check success message appears

**Duplicate warning?**
→ Change name or proceed anyway

**Not in filters?**
→ Refresh page to update filters

---

## 📊 Quick Example

**Add "Tesla":**
```
Company Name: Tesla ✅ (required)
License Type: Paid
Industry: Automotive
ESE Lead: John Smith
Status: Pre-Production
Engagement: Active
Health Score: 75
Summary: Initial onboarding phase

[💾 Save Customer]
```

**Result:**
- Tesla appears in table
- Blue dot shows it's new
- Searchable immediately
- Editable in Edit Mode

---

## 🎯 Common Use Cases

1. **Emergency add during meeting**
2. **Trial customer tracking**  
3. **Quick placeholder**
4. **Testing/demo data**

---

**Full guide:** See `ADD_CUSTOMER_GUIDE.md`

**Ready to add customers!** Click Edit Mode, then "➕ Add New Customer"

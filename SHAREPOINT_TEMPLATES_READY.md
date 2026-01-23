# ✅ SharePoint Templates Created!

I've created a complete set of templates and guides for setting up your SharePoint documents.

---

## 📁 What's Been Created

### Location
```
/sharepoint-templates/
```

All templates are ready in this folder for you to use.

---

## 📄 Template Files

### Core Documents (Create These First)

1. **`index.md`** → Create `index.docx` in SharePoint
   - Home page with customer overview
   - Quick links navigation
   - About section

2. **`weekly-current.md`** → Create `weekly-current.docx`
   - Current week engagement table
   - Dynamic data loading
   - Search and filter features

3. **`all-customers.md`** → Create `all-customers.docx`
   - Customer dashboard with cards
   - Stats panel
   - Interactive features

4. **`executive-summary.md`** → Create `executive-summary.docx`
   - High-level metrics
   - AI insights
   - Action items

### Reusable Templates

5. **`weekly-template.md`** → Create date-specific reports
   - Use for: `2026-01-23.docx`, `2026-01-15.docx`, etc.

6. **`client-template.md`** → Create client profiles
   - Use for: `acme-corp.docx`, `bhg-financial.docx`, etc.

---

## 📚 Guide Documents

### **`README.md`**
Overview of all templates and how to use them

### **`SETUP_GUIDE.md`** ⭐ START HERE
Complete step-by-step instructions for:
- Creating folder structure
- Creating documents
- Using AEM Sidekick
- Marking content as blocks
- Testing and publishing

### **`QUICK_START.md`**
Fast track guide (15 minutes) to create just the essentials

### **`FOLDER_STRUCTURE.txt`**
Visual diagram of SharePoint folder organization and URL mapping

---

## 🚀 Quick Start (Minimal Setup)

### 1. Open SharePoint
```
https://adobe.sharepoint.com/sites/AEMSitesOptimizerTeam/Shared%20Documents/Unified%20Dashboard
```

### 2. Create 2 Documents

#### Document A: `weekly-current.docx`
1. Create new Word doc in SharePoint
2. Open `sharepoint-templates/weekly-current.md`
3. Copy the content into Word
4. Add metadata at top: `--- week: 2026-01-23 ---`
5. Insert a small table
6. Use AEM Sidekick to mark as "Weekly Engagement" block
7. Add attribute: `data-source="/data/customers.json"`

#### Document B: `index.docx`
1. Create new Word doc in SharePoint
2. Open `sharepoint-templates/index.md`
3. Copy the content into Word
4. Find "Customer Overview Block" paragraph
5. Mark as "Customer Overview" block in Sidekick
6. Add attribute: `data-source="/data/customers.json"`

### 3. Test
```bash
aem up
# Visit: http://localhost:3000/
```

---

## 📋 Complete Folder Structure

Create this in SharePoint:

```
📁 Unified Dashboard/
   📄 index.docx
   📄 weekly-current.docx
   📄 all-customers.docx
   📄 executive-summary.docx
   📁 weekly/
      📄 2026-01-23.docx
      📄 2026-01-15.docx
   📁 clients/
      📄 acme-corp.docx
      📄 bhg-financial.docx
```

---

## 🔧 What Each Template Contains

### index.md
- Hero/welcome section
- Customer Overview block (loads from JSON)
- Quick links
- About the dashboard
- **Data source**: `/data/customers.json`

### weekly-current.md
- Weekly Engagement block
- Metadata for week selection
- Report description
- **Data source**: `/data/customers.json`

### all-customers.md
- Customer Overview block (card layout)
- Dashboard features explanation
- Usage instructions
- **Data source**: `/data/customers.json`

### executive-summary.md
- AI Summary block
- Key metrics table
- Portfolio health overview
- Recommended actions
- **Content**: Static table with insights

### weekly-template.md
- Template for specific week pages
- Placeholders for date/content
- Weekly Engagement block
- **Usage**: Copy for each week snapshot

### client-template.md
- Template for individual client pages
- Client Detail block
- AI Summary block for client insights
- **Usage**: Copy for each customer profile

---

## 📖 Using the Templates

### For Each Template:

1. **Open** the `.md` file
2. **Create** Word doc in SharePoint with corresponding name
3. **Copy** content from template
4. **Format** in Word (titles, tables, bullets)
5. **Use AEM Sidekick** to mark tables/sections as blocks
6. **Add attributes** like `data-source="/data/customers.json"`
7. **Preview** to test
8. **Publish** when ready

### Marking Content as Blocks

Using AEM Sidekick extension:

1. **Select** the content (table, paragraph, or div)
2. **Click** Sidekick icon → "Create Block"
3. **Choose** block type:
   - Weekly Engagement
   - Customer Overview
   - Client Detail
   - AI Summary
4. **Add attributes** (right-click block → Edit):
   - `data-source="/data/customers.json"` for dynamic data

---

## 🎯 Recommended Order

### Phase 1: Essential (Do First)
1. ✅ Create `index.docx`
2. ✅ Create `weekly-current.docx`
3. ✅ Test locally
4. ✅ Preview in Sidekick
5. ✅ Publish

### Phase 2: Enhanced (Do Next)
1. ⭐ Create `all-customers.docx`
2. ⭐ Create `executive-summary.docx`
3. ⭐ Test and publish

### Phase 3: Expanded (Optional)
1. 📁 Create `weekly/` folder
2. 📄 Add week-specific reports
3. 📁 Create `clients/` folder
4. 📄 Add client profile pages

---

## 🛠 Technical Details

### Data Sources

All templates use:
- **Customer data**: `/data/customers.json` (598 records, 16 weeks)
- **Week data**: `/data/weeks.json` (available weeks)
- **Current week**: Auto-detected or from metadata

### Block Types

Templates use these custom blocks:
- `weekly-engagement` - Table view with filters
- `customer-overview` - Card grid with stats
- `client-detail` - Individual client info
- `ai-summary` - Insights and observations

### Metadata

Add at top of Word docs:
```
---
week: 2026-01-23
title: Page Title
description: Page description
---
```

---

## 📞 Need Help?

### Read These:
- **`SETUP_GUIDE.md`** - Detailed step-by-step
- **`QUICK_START.md`** - Fast 15-minute setup
- **`FOLDER_STRUCTURE.txt`** - Visual structure guide

### Check Your Work:
```bash
# Test locally
aem up
http://localhost:3000/

# Check for errors in browser console (F12)
```

---

## ✅ Next Steps

1. **Read** `sharepoint-templates/SETUP_GUIDE.md`
2. **Create** the 2 essential documents (index, weekly-current)
3. **Test** locally with `aem up`
4. **Preview** in Sidekick
5. **Publish** when ready
6. **Add** more pages as needed using templates

---

**You're all set!** 🎉

All templates are ready in the `sharepoint-templates/` folder. Follow the guides and you'll have your dashboard live in SharePoint in no time!

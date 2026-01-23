# Creating the Table Page in SharePoint

Step-by-step guide to create a SharePoint page that links to your customer data table.

---

## 📝 Quick Steps

### 1. Open SharePoint
```
https://adobe.sharepoint.com/sites/AEMSitesOptimizerTeam/Shared%20Documents/Unified%20Dashboard
```

### 2. Create New Word Document

Click **"New"** → **"Word document"**

Name it: **`customer-data-table`**

### 3. Copy Content from Template

Open: `sharepoint-templates/customer-data-table-page.md`

Copy the content into your Word document.

### 4. Format the Document

**In Word:**
- First line as **Heading 1**: "Customer Data Table"
- Section headings as **Heading 2**: "Features", "All 28 Columns", etc.
- Make the link clickable: Select "View Full Table" text → Insert → Link → `/customer-full-table`
- Format bullet lists

### 5. Add Metadata (Important!)

At the very top of the document, before the title, add:

```
---
title: Customer Data Table - Full View
description: Interactive table with all 28 customer data columns
---
```

### 6. Save and Preview

1. **Save** the Word document
2. **Install AEM Sidekick** extension (if not already)
3. **Open** the document in SharePoint web view
4. **Click** Sidekick → **"Preview"**
5. **View** at: `https://main--unifieddashboard--{org}.aem.page/customer-data-table`

---

## 🎯 What This Page Does

This SharePoint page will:
- ✅ Provide a description of the table
- ✅ List all features and columns
- ✅ Include a clickable link to `/customer-full-table`
- ✅ Serve as documentation for users
- ✅ Be editable by content authors

---

## 🔗 The Link

The key part is this link in the document:

```
[View Full Table](/customer-full-table)
```

This links to your HTML page (`customer-full-table.html`) which is in your git repo.

---

## 📊 Two-Page Approach

### Page 1: SharePoint Word Doc (`customer-data-table.docx`)
- **Purpose**: Landing page, documentation, navigation
- **Location**: SharePoint
- **Editable by**: Content authors
- **URL**: `/customer-data-table`

### Page 2: HTML Table (`customer-full-table.html`)
- **Purpose**: The actual interactive table
- **Location**: Git repository
- **Editable by**: Developers
- **URL**: `/customer-full-table`

---

## 🌐 URL Structure

```
/customer-data-table        → SharePoint Word doc (landing/info page)
                              ↓ links to ↓
/customer-full-table        → Git HTML page (actual table)
```

Users can:
- Visit `/customer-data-table` to learn about the table
- Click the link to open `/customer-full-table`
- Or go directly to `/customer-full-table` if they know the URL

---

## 🎨 Alternative: Direct Redirect

If you want the SharePoint page to automatically redirect, create a simpler document:

**Content:**
```
# Customer Data Table

Loading interactive table...

<meta http-equiv="refresh" content="0; url=/customer-full-table">

If not redirected, [click here](/customer-full-table).
```

This immediately redirects users to the HTML table.

---

## 📋 Complete Workflow

1. **Create Word doc** in SharePoint: `customer-data-table.docx`
2. **Add content** from template
3. **Add link** to `/customer-full-table`
4. **Save** and **Preview** in Sidekick
5. **Publish** when ready

Then users can access:
- `/customer-data-table` (info page in SharePoint)
- `/customer-full-table` (actual table from git)

---

## ✅ Summary

**You need to create:**
- ✅ One Word document in SharePoint: `customer-data-table.docx`
- ✅ Content: Description, features, link to actual table
- ✅ Link in doc: `/customer-full-table`

**You already have:**
- ✅ The actual table: `customer-full-table.html` (in git)
- ✅ All functionality working
- ✅ Data loading from JSON

**Result:**
- SharePoint page acts as landing/navigation
- HTML page serves the actual interactive table
- Both accessible through EDS URLs

---

Need help creating the document? Use the template in `sharepoint-templates/customer-data-table-page.md`!

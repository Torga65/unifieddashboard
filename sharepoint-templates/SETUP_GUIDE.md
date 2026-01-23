# SharePoint Setup Guide

Step-by-step instructions for setting up your dashboard documents in SharePoint.

---

## Prerequisites

1. ✅ Access to SharePoint: `https://adobe.sharepoint.com/sites/AEMSitesOptimizerTeam`
2. ✅ AEM Sidekick browser extension installed
3. ✅ Permissions to create/edit documents in the Unified Dashboard folder

---

## Step 1: Create Folder Structure

Navigate to:
```
https://adobe.sharepoint.com/sites/AEMSitesOptimizerTeam/Shared%20Documents/Unified%20Dashboard
```

Create these folders (if they don't exist):
- `Unified Dashboard/` (root - should already exist)
- `Unified Dashboard/weekly/`
- `Unified Dashboard/clients/`

---

## Step 2: Create Core Documents

### Document 1: index.docx (Home Page)

1. **Create** new Word document in `Unified Dashboard/`
2. **Name** it: `index`
3. **Copy** content from `sharepoint-templates/index.md`
4. **Format** in Word:
   - Make first line "Heading 1"
   - Create sections with "Heading 2"
   - Add bullet lists where indicated
5. **Mark blocks** with AEM Sidekick:
   - Find the paragraph for Customer Overview
   - Select it → Sidekick → "Create Block" → "Customer Overview"
   - Right-click block → Add attribute: `data-source="/data/customers.json"`

### Document 2: weekly-current.docx

1. **Create** new Word document in `Unified Dashboard/`
2. **Name** it: `weekly-current`
3. **Copy** content from `sharepoint-templates/weekly-current.md`
4. **Add metadata** at the very top (before title):
   ```
   ---
   week: 2026-01-23
   ---
   ```
5. **Format** the document
6. **Insert** a simple 2x2 table where indicated
7. **Mark table** as "Weekly Engagement" block
8. **Add attribute**: `data-source="/data/customers.json"`

### Document 3: all-customers.docx

1. **Create** in `Unified Dashboard/`
2. **Name** it: `all-customers`
3. **Copy** content from `sharepoint-templates/all-customers.md`
4. **Format** and mark blocks as above

### Document 4: executive-summary.docx

1. **Create** in `Unified Dashboard/`
2. **Name** it: `executive-summary`
3. **Copy** content from `sharepoint-templates/executive-summary.md`
4. **Create table** with metrics
5. **Mark** as "AI Summary" block

---

## Step 3: Using AEM Sidekick

### Install Extension

1. **Chrome/Edge**: Search for "AEM Sidekick" in extension store
2. **Install** the extension
3. **Pin** it to your toolbar

### Configure Sidekick

1. **Open** any Word document in SharePoint (web view)
2. **Click** the Sidekick extension icon
3. **Add project**:
   - Project: `unifieddashboard`
   - Owner: `{your-github-org}`
   - Repo: `unifieddashboard`
4. **Save**

### Create Blocks

1. **Edit** the Word document in SharePoint web view
2. **Select** the content you want to make into a block
3. **Click** Sidekick → "Create Block"
4. **Choose** block type from dropdown:
   - Weekly Engagement
   - Customer Overview
   - Client Detail
   - AI Summary
5. **Add attributes** (if needed):
   - Right-click the block
   - Select "Edit block"
   - Add: `data-source="/data/customers.json"`

### Preview & Publish

1. **Click** "Preview" in Sidekick
   - Opens preview URL: `https://main--unifieddashboard--{org}.aem.page/index`
2. **Review** the page
3. **Make edits** in Word doc if needed
4. **Click** "Publish" when ready
   - Goes live at: `https://main--unifieddashboard--{org}.aem.live/index`

---

## Step 4: Test Locally

```bash
# In your local project
cd /Users/tgardner/Documents/unified-dashboard/unifieddashboard

# Start dev server
aem up

# View your SharePoint docs:
http://localhost:3000/index
http://localhost:3000/weekly-current
http://localhost:3000/all-customers
http://localhost:3000/executive-summary
```

---

## Step 5: Create Weekly Reports (Optional)

For specific week pages:

1. **Create** in `Unified Dashboard/weekly/`
2. **Name** as ISO date: `2026-01-23.docx`
3. **Use** `sharepoint-templates/weekly-template.md`
4. **Update** metadata with correct week
5. **Access** at: `/weekly/2026-01-23`

---

## Step 6: Create Client Pages (Optional)

For individual client profiles:

1. **Create** in `Unified Dashboard/clients/`
2. **Name** as: `client-name.docx` (e.g., `acme-corp.docx`)
3. **Use** `sharepoint-templates/client-template.md`
4. **Fill in** client details
5. **Access** at: `/clients/acme-corp`

---

## Troubleshooting

### Document Not Showing Locally

1. **Check** `fstab.yaml` has correct SharePoint path
2. **Restart** `aem up`
3. **Clear** browser cache
4. **Check** document is in correct folder

### Block Not Rendering

1. **Verify** block name matches exactly (case-sensitive)
2. **Check** block files exist in `blocks/` folder
3. **Look** for JavaScript errors in browser console
4. **Try** preview in Sidekick first

### Data Not Loading

1. **Verify** `data-source` attribute is correct
2. **Check** `/data/customers.json` exists and is accessible
3. **Look** at Network tab in browser DevTools
4. **Confirm** week metadata matches available data

---

## Quick Reference

### Metadata Format

Always at the very top of the document:

```
---
week: 2026-01-23
title: Page Title
description: Page description
---
```

### Block Attributes

Common attributes to add:

- `data-source="/data/customers.json"` - Load dynamic customer data
- `data-week="2026-01-23"` - Override week selection

### URL Patterns

- Root doc: `index.docx` → `/`
- Top-level: `page.docx` → `/page`
- In folder: `folder/page.docx` → `/folder/page`

---

## Next Steps

1. ✅ Create core documents (index, weekly-current, all-customers)
2. ✅ Test in local dev environment
3. ✅ Use Sidekick to preview
4. ✅ Publish when ready
5. 🚀 Share URLs with your team!

---

**Need Help?**

- Check `README.md` in project root
- Review block documentation in `blocks/*/`
- Test with `test-overview.html` locally first

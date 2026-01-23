# SharePoint Document Templates

This folder contains templates for creating Word documents in SharePoint.

---

## 📊 Data Source

**Source Excel File:**
```
/clients/AEM_Sites_Optimizer-CustomerExperience.xlsx
```

This Excel file contains 16 weeks of customer engagement data (598 records). It's converted to `/data/customers.json` for use by the dashboard blocks.

**SharePoint URL:**
```
https://adobe.sharepoint.com/sites/AEMSitesOptimizerTeam/Shared%20Documents/Unified%20Dashboard/clients/AEM_Sites_Optimizer-CustomerExperience.xlsx
```

**To update data:** Download Excel from SharePoint, run `python3 scripts/convert-customer-data.py`

---

## Quick Setup

1. **Navigate to SharePoint:**
   ```
   https://adobe.sharepoint.com/sites/AEMSitesOptimizerTeam/Shared%20Documents/Unified%20Dashboard
   ```

2. **Create the folder structure** (if needed)

3. **Create each Word document** using the templates below

4. **Copy the content** from each template file into the corresponding Word doc

5. **Use AEM Sidekick** to mark tables/sections as blocks

---

## Folder Structure to Create in SharePoint

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
      📄 template.docx
```

---

## How to Use These Templates

### For Each Template File:

1. **Open** the `.md` file in this folder
2. **Create** a new Word document in SharePoint with the same name
3. **Copy** the content from the template
4. **Format** in Word (titles, tables, etc.)
5. **Use AEM Sidekick** to convert tables to blocks:
   - Select the table
   - Click Sidekick → "Create Block"
   - Choose the block type
   - Add any data attributes

---

## Files in This Folder

- `index.md` → Create `index.docx` in SharePoint
- `weekly-current.md` → Create `weekly-current.docx`
- `all-customers.md` → Create `all-customers.docx`
- `executive-summary.md` → Create `executive-summary.docx`
- `weekly-template.md` → Create date-specific docs (e.g., `2026-01-23.docx`)
- `client-template.md` → Create client-specific docs (e.g., `acme-corp.docx`)

---

## After Creating Documents

1. **Install AEM Sidekick** browser extension
2. **Open each doc** in SharePoint (web interface)
3. **Use Sidekick** to mark content as blocks
4. **Preview** to test
5. **Publish** when ready

---

## Testing

After creating documents, test them:

```bash
# Start local dev server
aem up

# View your SharePoint docs:
http://localhost:3000/weekly-current
http://localhost:3000/all-customers
http://localhost:3000/executive-summary
```

# SharePoint Excel Integration Guide

How to integrate your SharePoint Excel customer data with Adobe EDS.

## Your SharePoint File

**URL:** `https://adobe-my.sharepoint.com/.../AEM_Sites_Optimizer-CustomerExperience.xlsx`

## Integration Options

### Option 1: Direct SharePoint Integration (EDS Native)

Adobe EDS can read Excel files directly from SharePoint and automatically convert them to JSON.

#### Steps:

1. **Add the Excel file to your GitHub repo:**
   ```
   /customer-data.xlsx
   ```

2. **EDS automatically creates JSON endpoint:**
   ```
   https://main--unifieddashboard--{owner}.aem.live/customer-data.json
   ```

3. **Use in your block:**

```javascript
import { loadCustomerData } from '../../scripts/data-loader.js';

export default async function decorate(block) {
  // EDS converts /customer-data.xlsx to /customer-data.json
  const customers = await loadCustomerData('/customer-data.json');
  
  // Use the data
  customers.forEach((customer) => {
    console.log(customer.companyName, customer.healthScore);
  });
}
```

### Option 2: Manual Export (For Testing)

If you want to test locally first:

1. **Export from SharePoint:**
   - Open the Excel file
   - File → Export → Export to CSV
   - Or copy data and convert to JSON

2. **Place in `/data/customers.json`:**
   ```json
   {
     "data": [
       {
         "Company Name": "Acme Corp",
         "Status": "Active",
         "Health Score": "95",
         "week": "2026-01-20"
       }
     ]
   }
   ```

3. **Use the data loader:**
   ```javascript
   import { loadCustomerData } from '../../scripts/data-loader.js';
   
   const customers = await loadCustomerData('/data/customers.json');
   ```

### Option 3: Google Sheets (Alternative)

If you prefer Google Sheets:

1. **Import Excel to Google Sheets**
2. **Publish as CSV:**
   - File → Share → Publish to web → CSV
   - Copy the public URL

3. **Fetch in EDS:**
   ```javascript
   const response = await fetch('YOUR_GOOGLE_SHEETS_CSV_URL');
   const text = await response.text();
   // Parse CSV...
   ```

## Expected Data Format

The data loader expects these column names (case-insensitive):

| Column Name            | Alternatives                                      | Required |
|-----------------------|---------------------------------------------------|----------|
| Week                  | week, Date, date                                  | Yes      |
| Company Name          | companyName, company, customer                    | Yes      |
| Status                | status, Account Status                            | Yes      |
| Engagement            | engagement, Engagement Level                      | Yes      |
| Health Score          | healthScore, health, score                        | Yes      |
| Summary of Engagement | summary, summaryOfEngagement, notes               | Yes      |
| Blockers              | blockers, issues, challenges                      | Yes      |
| Feedback              | feedback, Customer Feedback, sentiment            | Yes      |
| Last Updated          | lastUpdated, updated, date                        | Yes      |

## Using the Data Loader

### Basic Usage

```javascript
import { loadCustomerData } from '../../scripts/data-loader.js';

// Load from default location
const customers = await loadCustomerData();

// Load from custom URL
const customers = await loadCustomerData('/path/to/data.json');
```

### With Week Filtering

```javascript
import { loadCustomerData } from '../../scripts/data-loader.js';
import { resolveSelectedWeek } from '../../scripts/week-utils.js';

// Get current week
const currentWeek = await resolveSelectedWeek();

// Load all customer data
const allCustomers = await loadCustomerData();

// Filter by current week
const weekCustomers = allCustomers.filter(
  (customer) => customer.week === currentWeek
);
```

### Complete Block Example

```javascript
import { loadCustomerData } from '../../scripts/data-loader.js';
import { resolveSelectedWeek, formatWeekDate } from '../../scripts/week-utils.js';

export default async function decorate(block) {
  // Get current week
  const currentWeek = await resolveSelectedWeek();
  
  // Load customer data from SharePoint (via EDS)
  const allCustomers = await loadCustomerData('/customer-data.json');
  
  // Filter by week
  const weekCustomers = currentWeek
    ? allCustomers.filter((c) => c.week === currentWeek)
    : allCustomers;
  
  if (weekCustomers.length === 0) {
    block.innerHTML = '<p>No customer data available</p>';
    return;
  }
  
  // Create table
  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr>
        <th>Company</th>
        <th>Status</th>
        <th>Health Score</th>
      </tr>
    </thead>
    <tbody>
      ${weekCustomers.map((customer) => `
        <tr>
          <td>${customer.companyName}</td>
          <td>${customer.status}</td>
          <td>${customer.healthScore}</td>
        </tr>
      `).join('')}
    </tbody>
  `;
  
  block.appendChild(table);
}
```

## Updating the Weekly Engagement Block

To use live data instead of hardcoded HTML:

### Current (Hardcoded in HTML):

```html
<div class="weekly-engagement">
  <div>
    <div>2026-01-20</div>
    <div>Acme Corporation</div>
    <div>Active</div>
    ...
  </div>
</div>
```

### New (Dynamic from SharePoint):

```javascript
import { loadCustomerData } from '../../scripts/data-loader.js';
import { resolveSelectedWeek } from '../../scripts/week-utils.js';

export default async function decorate(block) {
  // Load customer data
  const customers = await loadCustomerData('/customer-data.json');
  
  // Get current week
  const currentWeek = await resolveSelectedWeek();
  
  // Filter by week
  const weekCustomers = customers.filter(
    (c) => c.week === currentWeek
  );
  
  // Clear block
  block.textContent = '';
  
  // Add rows dynamically
  weekCustomers.forEach((customer) => {
    const row = document.createElement('div');
    row.innerHTML = `
      <div>${customer.week}</div>
      <div>${customer.companyName}</div>
      <div>${customer.status}</div>
      <div>${customer.engagement}</div>
      <div>${customer.healthScore}</div>
      <div>${customer.summary}</div>
      <div>${customer.blockers}</div>
      <div>${customer.feedback}</div>
      <div>${customer.lastUpdated}</div>
    `;
    block.appendChild(row);
  });
}
```

## Testing Locally

1. **Create sample data file:**
   ```
   /data/customers.json
   ```

2. **Start dev server:**
   ```bash
   aem up
   ```

3. **Test the endpoint:**
   ```
   http://localhost:3000/data/customers.json
   ```

4. **View in your block:**
   ```
   http://localhost:3000/engagement-weekly.html
   ```

## Column Name Mapping

The data loader automatically handles different column name formats:

```javascript
// SharePoint might have:
"Company Name" → mapped to → companyName
"Health Score" → mapped to → healthScore
"Summary of Engagement" → mapped to → summary

// The loader handles all these variations
```

## Next Steps

### To Use Your SharePoint Data:

1. **Download the Excel file** from SharePoint
2. **Add to your repo** as `/customer-data.xlsx`
3. **Commit and push** to GitHub
4. **EDS automatically creates** `/customer-data.json`
5. **Update your block** to use:
   ```javascript
   const customers = await loadCustomerData('/customer-data.json');
   ```

### Or Test Locally First:

1. **Export to CSV** from SharePoint
2. **Convert to JSON** (or use sample format)
3. **Save as** `/data/customers.json`
4. **Test with** `aem up`
5. **Update block** to load from `/data/customers.json`

## Automation Options

### Option A: Manual Updates
- Update Excel file in repo
- Commit and push
- EDS refreshes JSON

### Option B: Scheduled Sync
- Set up GitHub Action to pull from SharePoint API
- Run daily/weekly
- Automatic updates

### Option C: Real-time API
- Fetch directly from SharePoint API in block
- Requires authentication
- More complex setup

## FAQ

**Q: Can EDS read my SharePoint file directly without downloading?**
A: Not directly. You need to add the file to your GitHub repo, then EDS converts it to JSON.

**Q: How often does the JSON update?**
A: When you update the Excel file in your repo and commit it.

**Q: Can I keep the data in SharePoint and sync automatically?**
A: Yes, using GitHub Actions or webhooks, but requires additional setup.

**Q: What if my column names are different?**
A: The data loader handles many variations. See "Column Name Mapping" above.

**Q: Can I use Google Sheets instead?**
A: Yes! Publish as CSV and fetch the public URL, or use the EDS sheets connector.

---

**For Help:**
- Check `/scripts/data-loader.js` for the full implementation
- See `/data/customers.json` for example format
- Test with `http://localhost:3000/scripts/week-utils-test.html`

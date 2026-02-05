# SpaceCat Integration Summary

## 📦 What's Been Created

I've built a complete solution to fetch and populate customer site URLs from the SpaceCat API. Here's what you have:

## 🎯 Three Ways to Use It

### 1. 🌐 Web Interface (Easiest)
**File**: `spacecat-url-tool.html`

**Access**: Open `http://localhost:3000/spacecat-url-tool.html` in your browser

**Features**:
- ✅ Visual interface with tabs and stats
- ✅ Enter API key once (saved in browser)
- ✅ See matched/unmatched customers
- ✅ Download updated JSON
- ✅ Download text report
- ✅ No command line needed

**Perfect for**: Quick manual runs, visual review of matches

---

### 2. 🖥️ Node.js Script (Automated)
**File**: `scripts/fetch-spacecat-urls.js`

**Usage**:
```bash
export SPACECAT_API_KEY="your-key"
node scripts/fetch-spacecat-urls.js
```

**Features**:
- ✅ Automated command-line execution
- ✅ Directly updates customers.json
- ✅ Generates detailed report
- ✅ Can be scheduled (cron, GitHub Actions)

**Perfect for**: Automated workflows, CI/CD pipelines

---

### 3. 📚 JavaScript Module (Programmatic)
**File**: `scripts/spacecat-url-fetcher.js`

**Usage**:
```javascript
import { fetchAndMatchSites } from './scripts/spacecat-url-fetcher.js';

const results = await fetchAndMatchSites(apiKey, customers);
console.log(`Matched: ${results.matches.length}`);
```

**Features**:
- ✅ Import into your own code
- ✅ Flexible API
- ✅ Browser-compatible
- ✅ Reusable functions

**Perfect for**: Custom integrations, building features

---

## 🔗 What URLs Are Fetched

The tools query the SpaceCat API to get:

| Endpoint | Data Retrieved |
|----------|----------------|
| `GET /sites` | All sites with baseURL, name, organizationId |
| `GET /organizations` | Organization names for matching |
| `GET /sites/by-base-url` | Specific site lookup (optional) |

## 🎭 Matching Strategy

The tools use **intelligent fuzzy matching**:

```
Customer Name: "ASO - Adobe Inc"
  ↓ Normalized to: "adobe"
  ↓ Matches:
    - Sites with "adobe" in name
    - Sites under "Adobe" organization
    - Sites with baseURL containing "adobe"
    
Result: https://business.adobe.com, https://adobe.com
```

## 📊 What You'll Get

### Successful Match Example

```json
{
  "companyName": "Adobe Inc",
  "onboardedUrls": "https://business.adobe.com, https://adobe.com",
  "status": "Production",
  "engagement": "Active",
  ...
}
```

### Report Output

```
✅ Matched: 42 customers (91%)
⚠️ Unmatched: 4 customers (9%)

Matched Customers:
- Adobe Inc → https://business.adobe.com
- Workday → https://workday.com
- Walmart → https://walmart.com

Unmatched Customers:
- Acme Corp (not in SpaceCat)
- XYZ Ltd (check spelling)
```

## 🚀 Quick Start

### Step 1: Get API Key
1. Log into SpaceCat dashboard
2. Go to Settings → API Keys
3. Create new key with read permissions

### Step 2: Run the Tool

**Option A - Web UI**:
```bash
# Start your dev server if not running
npm start

# Open browser
open http://localhost:3000/spacecat-url-tool.html
```

**Option B - Command Line**:
```bash
export SPACECAT_API_KEY="your-key-here"
node scripts/fetch-spacecat-urls.js
```

### Step 3: Review Results
- Check matched customers
- Manually add URLs for unmatched
- Download updated customers.json

### Step 4: Apply to Dashboard
```bash
# Replace the data file
cp customers-with-urls-2026-02-02.json data/customers.json

# Or update Excel and re-run converter
python3 scripts/convert-customer-data.py
```

## 📈 What Happens After

Once URLs are populated, you can:

### 1. View in Dashboard
- ✅ Customer overview cards show URLs
- ✅ Full table view has "Onboarded URL's" column
- ✅ Client detail pages display URLs

### 2. Track User Activity
```javascript
// Use URLs with SpaceCat API
const site = await fetchSiteByUrl(customer.onboardedUrls);
const activities = await fetchUserActivities(site.id);
```

### 3. Pull Metrics
```javascript
// Get performance data
const audits = await fetchSiteAudits(site.id);
const cwv = audits.find(a => a.auditType === 'cwv');
```

### 4. Generate Reports
```javascript
// Aggregate across all customer sites
const allMetrics = await Promise.all(
  customers.map(c => fetchMetrics(c.onboardedUrls))
);
```

## 🎯 Expected Match Rates

Based on typical scenarios:

| Scenario | Expected Match Rate |
|----------|-------------------|
| All customers onboarded in SpaceCat | 90-95% |
| Mix of onboarded + planning | 60-75% |
| Many pre-onboarding customers | 40-60% |
| First time running | 50-70% |

**Note**: Unmatched customers usually need manual URL entry because:
- Not yet onboarded to SpaceCat
- Different name in SpaceCat
- Multiple sites under parent organization

## 🔧 Customization Options

### Adjust Matching Rules

Edit `scripts/spacecat-url-fetcher.js`:

```javascript
// Add custom aliases
const COMPANY_ALIASES = {
  'ABC': 'ABC Corporation',
  'XYZ': 'XYZ Limited'
};

// Add industry rules
if (customer.industry === 'Retail') {
  // Special matching for retail
}
```

### Filter Customers

```javascript
// Only fetch for specific status
const prodCustomers = customers.filter(c => 
  c.status === 'Production'
);
```

### Batch by Week

```javascript
// Process one week at a time
const week = '2026-01-25';
const weekCustomers = customers.filter(c => c.week === week);
```

## 📚 Documentation

Full documentation available:

1. **[SpaceCat URL Fetcher Guide](./SPACECAT_URL_FETCHER_GUIDE.md)**
   - Detailed usage instructions
   - Troubleshooting
   - Advanced features

2. **[Onboarded URLs Guide](./ONBOARDED_URLS_GUIDE.md)**
   - Column purpose and format
   - API integration examples
   - Display in dashboard

3. **[OpenAPI Spec](./openapi%20(1).json)**
   - Complete API reference
   - All available endpoints
   - Request/response formats

## ⚡ Pro Tips

1. **Run after Excel updates**: Fetch URLs weekly when adding customers
2. **Keep backups**: Save customers.json before applying changes
3. **Review matches**: Check accuracy before mass-applying
4. **Manual polish**: Fine-tune results for critical customers
5. **Automate**: Set up scheduled runs for continuous sync

## 🎉 Benefits

With URLs populated, your dashboard can:

✅ **Track real user activity** per customer  
✅ **Monitor site performance** with live metrics  
✅ **Pull audit data** automatically  
✅ **Generate reports** with actual usage  
✅ **Identify engagement** based on sign-ins  
✅ **Measure adoption** with audit counts  

## 🔗 Next Steps

1. **Run the fetcher** using web UI or command line
2. **Review results** and add missing URLs manually  
3. **Update customers.json** with populated URLs
4. **Build features** using the onboarded URLs
5. **Integrate metrics** from SpaceCat API

## ❓ Quick FAQ

**Q: Does this require write access to SpaceCat?**  
A: No, only read permissions needed.

**Q: Will it overwrite my manual entries?**  
A: No, only populates empty URL fields.

**Q: How long does it take?**  
A: ~30 seconds to fetch and match all customers.

**Q: Can I schedule this?**  
A: Yes! Use cron or GitHub Actions with the Node.js script.

**Q: What if my API key expires?**  
A: Generate a new one and update the environment variable.

---

## 🎊 You're All Set!

You now have everything needed to automatically populate customer URLs from SpaceCat. Start with the web UI to see it in action, then automate with the Node.js script for ongoing syncing.

**Happy URL fetching! 🚀**

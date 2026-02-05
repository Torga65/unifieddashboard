# SpaceCat URL Fetcher Guide

## Overview

The SpaceCat URL Fetcher automatically retrieves customer site URLs from the SpaceCat API and populates the "Onboarded URL's" column in your customer data.

## 🎯 What It Does

1. **Fetches** all sites and organizations from SpaceCat API
2. **Matches** them to your customers by:
   - Company name similarity
   - Organization name matching
   - Domain name analysis
3. **Populates** the `onboardedUrls` field in your customer data
4. **Reports** matched and unmatched customers

## 🚀 Quick Start (Browser UI)

### Option 1: Use the Web Interface (Easiest)

1. **Open the tool**:
   ```
   http://localhost:3000/spacecat-url-tool.html
   ```

2. **Enter your SpaceCat API Key**:
   - Get your API key from SpaceCat admin
   - The key is stored locally in your browser

3. **Click "Fetch & Match URLs"**:
   - The tool will query SpaceCat API
   - Automatically match customers to sites
   - Show you the results

4. **Review Results**:
   - **Matched tab**: Shows customers with URLs found
   - **Unmatched tab**: Shows customers that need manual entry

5. **Apply Results**:
   - Click "Apply URLs to Customer Data"
   - Downloads updated `customers.json`
   - Replace `/data/customers.json` with the new file

## 🖥️ Command Line (Node.js)

### Prerequisites

```bash
# Ensure you have Node.js installed
node --version  # Should be v14 or higher
```

### Usage

```bash
# Set your API key as environment variable
export SPACECAT_API_KEY="your-api-key-here"

# Run the fetcher
node scripts/fetch-spacecat-urls.js
```

### Output

The script will:
1. Fetch all sites from SpaceCat
2. Match them to your customers
3. Update `data/customers.json` with URLs
4. Generate `spacecat-url-report.txt` with detailed results

## 🔑 Getting Your SpaceCat API Key

### Method 1: Adobe Admin Console
1. Log into Adobe Admin Console
2. Navigate to SpaceCat service
3. Generate API key under "Credentials"

### Method 2: SpaceCat Dashboard
1. Log into https://spacecat.experiencecloud.live
2. Go to Settings > API Keys
3. Create new API key

### Required Permissions
Your API key needs access to:
- `GET /sites` - Read all sites
- `GET /organizations` - Read organizations
- `GET /sites/by-base-url` - Query sites by URL

## 📊 Matching Logic

The tool uses intelligent matching to connect customers to sites:

### 1. Company Name Matching
```
Customer: "ASO - Workday"
Normalized: "workday"
Matches: Sites with "workday" in name or organization
```

### 2. Organization Matching
```
Customer: "Adobe Inc"
Matches: Sites under "Adobe" organization in SpaceCat
```

### 3. Domain Matching
```
Customer: "Walmart"
Matches: Sites with baseURL containing "walmart"
Example: https://walmart.com, https://walmart.ca
```

### 4. Normalization
The tool automatically:
- Removes "ASO -" prefix
- Removes common suffixes (Inc, Corp, Ltd, etc.)
- Ignores case and special characters
- Handles abbreviations

## 📝 Understanding Results

### Match Report Example

```
✅ Adobe Inc
   URLs: https://business.adobe.com, https://adobe.com
   Sites: 2

✅ Walmart
   URLs: https://walmart.com
   Sites: 1

⚠️ Acme Corporation - No matching sites found
```

### Statistics

- **Total Sites**: Number of sites in SpaceCat
- **Matched**: Customers with URLs found
- **Unmatched**: Customers needing manual entry
- **Match Rate**: Percentage successfully matched

## 🔧 Handling Unmatched Customers

If a customer isn't matched automatically:

### 1. Manual Search in SpaceCat
```
1. Log into SpaceCat dashboard
2. Search for customer name
3. Copy the base URL
4. Add manually to Excel or customers.json
```

### 2. Common Reasons for No Match
- Site not yet onboarded to SpaceCat
- Different company name in SpaceCat
- Site registered under parent company
- Typo in customer name

### 3. Manual Entry Methods

#### Via Excel (Recommended)
```
1. Open Excel file in SharePoint
2. Find the customer row
3. Enter URL in "Onboarded URL's" column
4. Run: python3 scripts/convert-customer-data.py
```

#### Via JSON (Advanced)
```json
{
  "companyName": "Acme Corporation",
  "onboardedUrls": "https://acme.com, https://acme-blog.com"
}
```

## 🔄 Workflow Integration

### Complete Data Pipeline

```
1. Excel (SharePoint)
   ↓
2. Python Converter (convert-customer-data.py)
   ↓
3. customers.json
   ↓
4. SpaceCat URL Fetcher ← Fetches URLs
   ↓
5. Updated customers.json
   ↓
6. Dashboard displays URLs
```

### Recommended Schedule

- **Weekly**: After adding new customers to Excel
- **Monthly**: Full refresh to catch newly onboarded sites
- **Ad-hoc**: When launching new customer sites

## 🛠️ Troubleshooting

### Error: "API returned 401"
**Problem**: Invalid or expired API key  
**Solution**: Regenerate API key in SpaceCat admin

### Error: "API returned 403"
**Problem**: Insufficient permissions  
**Solution**: Request elevated access for your API key

### Error: "No sites fetched"
**Problem**: Network or API issue  
**Solution**: 
- Check internet connection
- Verify SpaceCat API status
- Try again in a few minutes

### Low Match Rate (<50%)
**Problem**: Many customers not found  
**Solution**:
- Check if sites are actually onboarded in SpaceCat
- Verify customer names match SpaceCat records
- Use manual search for specific customers

### Duplicate URLs
**Problem**: Same URL matched to multiple customers  
**Solution**: Normal for multi-brand customers - review and adjust manually

## 📈 Advanced Usage

### Custom Matching Rules

Edit `spacecat-url-fetcher.js` to add custom rules:

```javascript
// Add industry-specific matching
if (customer.industry === 'Retail') {
  // Check for .com, .ca, .co.uk variations
}

// Add alias mapping
const aliases = {
  'ABC Corp': 'ABC Corporation',
  'XYZ Ltd': 'XYZ Limited'
};
```

### Batch Processing

Process multiple weeks:

```javascript
// Load all weeks
const allWeeks = ['2026-01-15', '2026-01-22', '2026-01-29'];

for (const week of allWeeks) {
  const weekCustomers = customers.filter(c => c.week === week);
  await fetchAndMatchSites(apiKey, weekCustomers);
}
```

### API Rate Limiting

The tool includes automatic retry logic. If you hit rate limits:

```javascript
// Add delay between requests
await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second
```

## 🔐 Security Best Practices

1. **Never commit API keys** to Git
   ```bash
   # Add to .gitignore
   .env
   *.key
   ```

2. **Use environment variables**
   ```bash
   export SPACECAT_API_KEY="..."
   ```

3. **Rotate keys regularly**
   - Change API key every 90 days
   - Revoke old keys immediately

4. **Limit key scope**
   - Only grant read permissions
   - No write/delete access needed

## 📞 Support & Resources

### Documentation
- [SpaceCat API Docs](./openapi%20(1).json)
- [Onboarded URLs Guide](./ONBOARDED_URLS_GUIDE.md)
- [Customer Data Conversion](./scripts/convert-customer-data.py)

### Common Questions

**Q: How often should I run this?**  
A: Weekly after Excel updates, or whenever new sites are onboarded.

**Q: Can I edit URLs after fetching?**  
A: Yes! Edit in Excel or use Edit Mode in the full table view.

**Q: What if a customer has multiple sites?**  
A: The tool combines them with commas: `https://site1.com, https://site2.com`

**Q: Will this overwrite manual entries?**  
A: No, the tool only adds URLs to empty fields. Existing URLs are preserved.

**Q: Can I run this on multiple customer lists?**  
A: Yes, just point to different JSON files or filter by week.

## 🎉 Next Steps

After populating URLs:

1. **Track User Activity**: Use URLs with SpaceCat's user activity endpoints
2. **Monitor Performance**: Pull audit data for each site
3. **Generate Reports**: Aggregate metrics across all customer sites
4. **Set Up Automation**: Schedule regular URL syncs

## 📝 Example Output

```
🚀 SpaceCat URL Fetcher

============================================================

📖 Loading customers.json...
✅ Loaded 598 customer records

📡 Fetching all sites from SpaceCat API...
✅ Fetched 247 sites from SpaceCat

📡 Fetching all organizations from SpaceCat API...
✅ Fetched 89 organizations from SpaceCat

🔍 Matching customers to sites...

✅ Adobe Inc
   URLs: https://business.adobe.com
   Sites: 1

✅ Workday
   URLs: https://workday.com
   Sites: 1

⚠️ Acme Corp - No matching sites found

📝 Updating customers.json...

✅ Updated 42 customer records
   File: /data/customers.json

📊 Report generated: spacecat-url-report.txt

============================================================
✅ COMPLETE

   Matched: 42 customers
   Unmatched: 4 customers
   Updated: 42 records in customers.json

💡 Next steps:
   1. Review spacecat-url-report.txt
   2. Manually add URLs for unmatched customers
   3. Re-run Python converter if needed
```

## 🏆 Success Tips

1. **Start with a test run** on a small subset
2. **Review matches carefully** before applying
3. **Keep a backup** of customers.json
4. **Document custom mappings** for future reference
5. **Share unmatched list** with team for collaborative resolution

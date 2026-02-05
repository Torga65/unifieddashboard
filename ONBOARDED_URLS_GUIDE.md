# Onboarded URL's Column Guide

## Overview

The **"Onboarded URL's"** column has been added to track customer site URLs that can be used with the SpaceCat API to pull user activity data and other metrics.

## Purpose

This column serves as the bridge between your customer dashboard and the SpaceCat API, allowing you to:
- Track which sites are onboarded for each customer
- Use these URLs to fetch site IDs from the SpaceCat API
- Pull user activity, audit data, and performance metrics
- Enable automated data collection for dashboard insights

## Data Format

### Single URL
```
https://customer-site.com
```

### Multiple URLs (comma-separated)
```
https://site1.com, https://site2.com, https://site3.com
```

### Multiple URLs (newline-separated)
```
https://site1.com
https://site2.com
https://site3.com
```

## How to Update

### In Excel (SharePoint)
1. Open the customer data Excel file
2. Locate or add the **"Onboarded URL's"** column (typically column K, after "Headless")
3. Enter the customer's site URL(s)
4. Save the file
5. Run the conversion script: `python3 scripts/convert-customer-data.py`

### Direct JSON Edit
Edit `data/customers.json` and add the field:
```json
{
  "week": "2026-01-25",
  "companyName": "Example Corp",
  "onboardedUrls": "https://example.com",
  ...
}
```

## Integration with SpaceCat API

### Step 1: Get Site ID from URL

```javascript
// API call to get site details by base URL
fetch('https://spacecat.experiencecloud.live/api/v1/sites/by-base-url?baseURL=https://example.com', {
  headers: {
    'x-api-key': 'your-api-key'
  }
})
.then(res => res.json())
.then(site => {
  console.log('Site ID:', site.id);
  console.log('Organization ID:', site.organizationId);
});
```

### Step 2: Pull User Activity Data

```javascript
// Get user activities for the site
fetch(`https://spacecat.experiencecloud.live/api/v1/sites/${siteId}/user-activities`, {
  headers: {
    'Authorization': 'Bearer your-ims-token'
  }
})
.then(res => res.json())
.then(activities => {
  console.log('User Activities:', activities);
});
```

### Step 3: Get Audit Data

```javascript
// Get latest audits for the site
fetch(`https://spacecat.experiencecloud.live/api/v1/sites/${siteId}/audits/latest`, {
  headers: {
    'x-api-key': 'your-api-key'
  }
})
.then(res => res.json())
.then(audits => {
  console.log('Latest Audits:', audits);
});
```

## User Activity Types Available

Once you have the site ID, you can track:
- **SIGN_UP** - User registration events
- **SIGN_IN** - Login activity
- **CREATE_SITE** - Site creation events
- **RUN_AUDIT** - Audit executions
- **PROMPT_RUN** - AI prompt usage
- **DOWNLOAD** - Download events

## Display in Dashboard

The onboarded URLs will automatically appear in:

### Customer Overview Cards
URLs display in a blue-highlighted section with a link icon (🔗) above the footer.

### Client Detail Pages
URLs appear as a field in the details grid when viewing individual customer information.

### Table Views
Can be added as a column in table-based customer views.

## Example Workflow

1. **Add URL to Excel**
   ```
   Company: Acme Corp
   Onboarded URL's: https://acme.com, https://acme-blog.com
   ```

2. **Convert to JSON**
   ```bash
   python3 scripts/convert-customer-data.py
   ```

3. **Fetch Site IDs** (automated script recommended)
   ```javascript
   const urls = customer.onboardedUrls.split(',').map(u => u.trim());
   const siteIds = await Promise.all(
     urls.map(url => fetchSiteIdByUrl(url))
   );
   ```

4. **Pull User Activity**
   ```javascript
   const activities = await Promise.all(
     siteIds.map(id => fetchUserActivities(id))
   );
   ```

5. **Display in Dashboard**
   - Show activity counts
   - Display last activity timestamp
   - Visualize engagement metrics

## Future Enhancements

Consider adding these related columns:
- **Site ID** - Store the SpaceCat site UUID directly
- **Organization ID** - Track the organization UUID
- **Last Activity Sync** - Timestamp of last data pull
- **Active Users Count** - Number of users from API
- **Weekly Signins** - Signin count for the week

## API Authentication

The SpaceCat API requires:
- **IMS Authentication** (`ims_key`) for user activity endpoints
- **API Key** (`api_key`) for site and audit endpoints

Contact your Adobe admin to obtain proper credentials.

## Troubleshooting

### URL Not Found
If the API returns 404 for a URL:
- Verify the URL format (include https://)
- Check if the site is registered in SpaceCat
- Ensure the URL matches exactly (trailing slashes matter)

### Missing Activity Data
If no activities are returned:
- Verify the site has active users
- Check authentication token validity
- Confirm the site is enrolled in the appropriate product (ASO)

### Multiple URLs
For customers with multiple sites:
- You can store multiple URLs in the field
- Use comma or newline separation
- Create separate API calls for each URL
- Aggregate the results in your dashboard

## Related Documentation

- [SpaceCat API OpenAPI Spec](./openapi%20(1).json)
- [User Activity API Details](#) - See lines 5996-6126 in OpenAPI spec
- [Customer Data Conversion](./scripts/convert-customer-data.py)
- [Customer Overview Block](./blocks/customer-overview/customer-overview.js)

## Questions?

For questions about:
- **Column usage**: See this guide
- **API integration**: Refer to OpenAPI spec
- **Data conversion**: Check `scripts/convert-customer-data.py`
- **Display customization**: See `blocks/customer-overview/`

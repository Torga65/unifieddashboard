/**
 * Fetch Onboarded URLs from SpaceCat API
 *
 * This script queries the SpaceCat API to find sites for each customer
 * and populates the onboardedUrls field
 *
 * Requirements:
 * - Valid SpaceCat API key or IMS authentication
 * - Access to the SpaceCat API endpoints
 *
 * Usage:
 *   node scripts/fetch-spacecat-urls.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getAuthToken, parseTokenInfo, apiGet, displayTokenInfo,
} from './spacecat-auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CUSTOMERS_JSON_PATH = path.join(__dirname, '../data/customers.json');
const SPACECAT_API_BASE = 'https://spacecat.experiencecloud.live/api/v1';

// Get authentication token
const AUTH_TOKEN = getAuthToken();

if (!AUTH_TOKEN) {
  console.error('❌ Error: No authentication token found');
  console.error('\nOptions to set up authentication:');
  console.error('\n1. Copy .token file from aso-spacecat-dashboard:');
  console.error('   cp ../aso-spacecat-dashboard-main/.token .');
  console.error('\n2. Add IMS token to credentials.json:');
  console.error('   {');
  console.error('     "spacecat": {');
  console.error('       "imsToken": "your-ims-token-here"');
  console.error('     }');
  console.error('   }');
  console.error('\n3. Set environment variable:');
  console.error('   export SPACECAT_TOKEN="your-ims-token"');
  process.exit(1);
}

// Validate token
const tokenInfo = parseTokenInfo(AUTH_TOKEN);
if (!tokenInfo.valid) {
  console.error('❌ Error: Token is invalid or expired');
  displayTokenInfo();
  process.exit(1);
}

/**
 * Fetch all sites from SpaceCat API (using IMS authentication)
 */
async function fetchAllSites() {
  console.log('📡 Fetching all sites from SpaceCat API...');

  try {
    const data = await apiGet(`${SPACECAT_API_BASE}/sites`);
    console.log(`✅ Fetched ${data.length || 0} sites from SpaceCat`);
    return data;
  } catch (error) {
    console.error('❌ Error fetching sites:', error.message);
    if (error.status === 401) {
      console.error('   Token may be expired. Please refresh your IMS token.');
    }
    return [];
  }
}

/**
 * Fetch all organizations from SpaceCat API (using IMS authentication)
 */
async function fetchAllOrganizations() {
  console.log('📡 Fetching all organizations from SpaceCat API...');

  try {
    const data = await apiGet(`${SPACECAT_API_BASE}/organizations`);
    console.log(`✅ Fetched ${data.length || 0} organizations from SpaceCat`);
    return data;
  } catch (error) {
    console.error('❌ Error fetching organizations:', error.message);
    if (error.status === 401) {
      console.error('   Token may be expired. Please refresh your IMS token.');
    }
    return [];
  }
}

/**
 * Normalize company name for matching
 */
function normalizeCompanyName(name) {
  return name
    .toLowerCase()
    .replace(/^aso\s*-\s*/i, '') // Remove "ASO -" prefix
    .replace(/\s+(inc|corp|corporation|ltd|limited|llc|group)\.?$/i, '') // Remove common suffixes
    .replace(/[^\w\s]/g, '') // Remove special characters
    .trim();
}

/**
 * Match customers to sites
 */
function matchCustomersToSites(customers, sites, organizations) {
  console.log('\n🔍 Matching customers to sites...\n');

  const matches = [];
  const unmatched = [];

  // Create organization lookup map
  const orgMap = new Map();
  organizations.forEach((org) => {
    orgMap.set(org.id, org);
  });

  // Get unique customers (latest week entry for each company)
  const uniqueCustomers = new Map();
  customers.forEach((customer) => {
    const existing = uniqueCustomers.get(customer.companyName);
    if (!existing || customer.week > existing.week) {
      uniqueCustomers.set(customer.companyName, customer);
    }
  });

  uniqueCustomers.forEach((customer, companyName) => {
    const normalizedCustomer = normalizeCompanyName(companyName);

    // Find matching sites
    const matchingSites = sites.filter((site) => {
      // Match by site name
      if (site.name) {
        const normalizedSiteName = normalizeCompanyName(site.name);
        if (normalizedSiteName.includes(normalizedCustomer)
            || normalizedCustomer.includes(normalizedSiteName)) {
          return true;
        }
      }

      // Match by organization name
      if (site.organizationId) {
        const org = orgMap.get(site.organizationId);
        if (org && org.name) {
          const normalizedOrgName = normalizeCompanyName(org.name);
          if (normalizedOrgName.includes(normalizedCustomer)
              || normalizedCustomer.includes(normalizedOrgName)) {
            return true;
          }
        }
      }

      // Match by base URL domain
      if (site.baseURL) {
        const domain = site.baseURL.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
        const domainName = domain.split('.')[0];
        if (normalizedCustomer.includes(domainName) || domainName.includes(normalizedCustomer)) {
          return true;
        }
      }

      return false;
    });

    if (matchingSites.length > 0) {
      const urls = matchingSites.map((site) => site.baseURL).filter(Boolean).join(', ');
      matches.push({
        companyName,
        urls,
        siteCount: matchingSites.length,
        siteIds: matchingSites.map((s) => s.id),
      });

      console.log(`✅ ${companyName}`);
      console.log(`   URLs: ${urls}`);
      console.log(`   Sites: ${matchingSites.length}`);
      console.log('');
    } else {
      unmatched.push(companyName);
      console.log(`⚠️  ${companyName} - No matching sites found`);
    }
  });

  return { matches, unmatched };
}

/**
 * Update customers.json with onboarded URLs
 */
function updateCustomersJson(customers, matches) {
  console.log('\n📝 Updating customers.json...\n');

  // Create lookup map for matches
  const matchMap = new Map();
  matches.forEach((match) => {
    matchMap.set(match.companyName, match.urls);
  });

  // Update all customer records with matching company names
  let updatedCount = 0;
  const updatedCustomers = customers.map((customer) => {
    const urls = matchMap.get(customer.companyName);
    if (urls) {
      updatedCount++;
      return {
        ...customer,
        onboardedUrls: urls,
      };
    }
    return customer;
  });

  // Write back to file
  const data = {
    data: updatedCustomers,
    total: updatedCustomers.length,
    generated: new Date().toISOString(),
    spacecatMatches: matches.length,
    spacecatFetchDate: new Date().toISOString(),
  };

  fs.writeFileSync(CUSTOMERS_JSON_PATH, JSON.stringify(data, null, 2));

  console.log(`✅ Updated ${updatedCount} customer records`);
  console.log(`   File: ${CUSTOMERS_JSON_PATH}`);

  return updatedCount;
}

/**
 * Generate report
 */
function generateReport(matches, unmatched, sites) {
  const reportPath = path.join(__dirname, '../spacecat-url-report.txt');

  const report = `
SpaceCat URL Fetch Report
Generated: ${new Date().toISOString()}
==========================================================

SUMMARY
-------
Total Sites in SpaceCat: ${sites.length}
Customers Matched: ${matches.length}
Customers Unmatched: ${unmatched.length}
Match Rate: ${((matches.length / (matches.length + unmatched.length)) * 100).toFixed(1)}%

MATCHED CUSTOMERS (${matches.length})
${'-'.repeat(60)}
${matches.map((m) => `
${m.companyName}
  URLs: ${m.urls}
  Site Count: ${m.siteCount}
  Site IDs: ${m.siteIds.join(', ')}
`).join('\n')}

UNMATCHED CUSTOMERS (${unmatched.length})
${'-'.repeat(60)}
${unmatched.map((name) => `  - ${name}`).join('\n')}

NEXT STEPS FOR UNMATCHED CUSTOMERS
-----------------------------------
1. Manually search for sites in SpaceCat dashboard
2. Check if company name differs in SpaceCat
3. Verify if sites have been onboarded yet
4. Add URLs manually to customers.json or Excel file

`;

  fs.writeFileSync(reportPath, report);
  console.log(`\n📊 Report generated: ${reportPath}`);
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 SpaceCat URL Fetcher\n');
  console.log('='.repeat(60));
  console.log('');

  // Display token info
  displayTokenInfo();

  // Load customers
  console.log('📖 Loading customers.json...');
  const customersData = JSON.parse(fs.readFileSync(CUSTOMERS_JSON_PATH, 'utf-8'));
  const customers = customersData.data || customersData;
  console.log(`✅ Loaded ${customers.length} customer records\n`);

  // Fetch data from SpaceCat
  const [sites, organizations] = await Promise.all([
    fetchAllSites(),
    fetchAllOrganizations(),
  ]);

  if (sites.length === 0) {
    console.error('\n❌ No sites fetched. Check your API key and permissions.');
    process.exit(1);
  }

  // Match customers to sites
  const { matches, unmatched } = matchCustomersToSites(customers, sites, organizations);

  // Update customers.json
  const updatedCount = updateCustomersJson(customers, matches);

  // Generate report
  generateReport(matches, unmatched, sites);

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('✅ COMPLETE\n');
  console.log(`   Matched: ${matches.length} customers`);
  console.log(`   Unmatched: ${unmatched.length} customers`);
  console.log(`   Updated: ${updatedCount} records in customers.json`);
  console.log('\n💡 Next steps:');
  console.log('   1. Review spacecat-url-report.txt');
  console.log('   2. Manually add URLs for unmatched customers');
  console.log('   3. Re-run Python converter if needed');
  console.log('');
}

// Run
main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

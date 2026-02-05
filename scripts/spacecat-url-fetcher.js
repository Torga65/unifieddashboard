/**
 * SpaceCat URL Fetcher - Browser Version
 *
 * This module can be used in the browser to fetch and match
 * customer sites from the SpaceCat API
 *
 * Usage:
 *   import { fetchAndMatchSites } from './spacecat-url-fetcher.js';
 *   const results = await fetchAndMatchSites(apiKey);
 */

const SPACECAT_API_BASE = 'https://spacecat.experiencecloud.live/api/v1';

/**
 * Fetch all sites from SpaceCat API
 */
export async function fetchAllSites(apiKey) {
  try {
    const response = await fetch(`${SPACECAT_API_BASE}/sites`, {
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, data, count: data.length || 0 };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Fetch all organizations from SpaceCat API
 */
export async function fetchAllOrganizations(apiKey) {
  try {
    const response = await fetch(`${SPACECAT_API_BASE}/organizations`, {
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, data, count: data.length || 0 };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Fetch site by base URL
 */
export async function fetchSiteByUrl(baseURL, apiKey) {
  try {
    const encodedUrl = encodeURIComponent(baseURL);
    const response = await fetch(`${SPACECAT_API_BASE}/sites/by-base-url?baseURL=${encodedUrl}`, {
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: 'Site not found' };
      }
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Normalize company name for matching
 */
function normalizeCompanyName(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/^aso\s*-\s*/i, '') // Remove "ASO -" prefix
    .replace(/\s+(inc|corp|corporation|ltd|limited|llc|group)\.?$/i, '') // Remove common suffixes
    .replace(/[^\w\s]/g, '') // Remove special characters
    .trim();
}

/**
 * Match a single customer to sites
 */
export function matchCustomerToSites(customer, sites, organizations) {
  const orgMap = new Map();
  organizations.forEach((org) => {
    orgMap.set(org.id, org);
  });

  const normalizedCustomer = normalizeCompanyName(customer.companyName);

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
      try {
        const url = new URL(site.baseURL);
        const domainParts = url.hostname.replace('www.', '').split('.');
        const domainName = domainParts[0];
        if (normalizedCustomer.includes(domainName) || domainName.includes(normalizedCustomer)) {
          return true;
        }
      } catch (e) {
        // Invalid URL, skip
      }
    }

    return false;
  });

  if (matchingSites.length > 0) {
    return {
      matched: true,
      urls: matchingSites.map((site) => site.baseURL).filter(Boolean).join(', '),
      sites: matchingSites,
      siteCount: matchingSites.length,
    };
  }

  return {
    matched: false,
    urls: '',
    sites: [],
    siteCount: 0,
  };
}

/**
 * Match all customers to sites
 */
export function matchAllCustomersToSites(customers, sites, organizations) {
  // Get unique customers (latest week entry for each company)
  const uniqueCustomers = new Map();
  customers.forEach((customer) => {
    const existing = uniqueCustomers.get(customer.companyName);
    if (!existing || customer.week > existing.week) {
      uniqueCustomers.set(customer.companyName, customer);
    }
  });

  const matches = [];
  const unmatched = [];

  uniqueCustomers.forEach((customer) => {
    const result = matchCustomerToSites(customer, sites, organizations);

    if (result.matched) {
      matches.push({
        companyName: customer.companyName,
        urls: result.urls,
        siteCount: result.siteCount,
        sites: result.sites,
      });
    } else {
      unmatched.push(customer.companyName);
    }
  });

  return { matches, unmatched };
}

/**
 * Main function to fetch and match sites
 */
export async function fetchAndMatchSites(apiKey, customers) {
  // Fetch data from SpaceCat
  const [sitesResult, orgsResult] = await Promise.all([
    fetchAllSites(apiKey),
    fetchAllOrganizations(apiKey),
  ]);

  if (!sitesResult.success) {
    return {
      success: false,
      error: `Failed to fetch sites: ${sitesResult.error}`,
    };
  }

  if (!orgsResult.success) {
    return {
      success: false,
      error: `Failed to fetch organizations: ${orgsResult.error}`,
    };
  }

  const sites = sitesResult.data;
  const organizations = orgsResult.data;

  // Match customers to sites
  const { matches, unmatched } = matchAllCustomersToSites(customers, sites, organizations);

  return {
    success: true,
    sites,
    organizations,
    matches,
    unmatched,
    stats: {
      totalSites: sites.length,
      totalOrganizations: organizations.length,
      customersMatched: matches.length,
      customersUnmatched: unmatched.length,
      matchRate: ((matches.length / (matches.length + unmatched.length)) * 100).toFixed(1),
    },
  };
}

/**
 * Apply matched URLs to customer data
 */
export function applyMatchedUrls(customers, matches) {
  const matchMap = new Map();
  matches.forEach((match) => {
    matchMap.set(match.companyName, match.urls);
  });

  return customers.map((customer) => {
    const urls = matchMap.get(customer.companyName);
    if (urls) {
      return {
        ...customer,
        onboardedUrls: urls,
      };
    }
    return customer;
  });
}

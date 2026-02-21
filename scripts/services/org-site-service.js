/**
 * Organization & Site Discovery Service
 *
 * Discovers organizations and sites from SpaceCat.
 */

import { ASO_ENDPOINTS } from '../constants/api.js';
import { apiGet, isApiError } from './spacecat-api.js';

/**
 * Fetch all SpaceCat organizations.
 *
 * @param {string} token
 * @returns {Promise<Array<{orgId, orgName, imsOrgId}>>}
 */
export async function fetchSpaceCatOrgs(token) {
  try {
    const url = ASO_ENDPOINTS.ORGANIZATIONS();
    const response = await apiGet(url, token);

    if (isApiError(response)) {
      console.warn('[OrgSite] Failed to fetch SpaceCat orgs:', response.message);
      return [];
    }

    const raw = response.organizations || response.data || [];
    const orgs = Array.isArray(response) ? response : raw;
    return orgs.map((org) => ({
      orgId: org.id,
      imsOrgId: org.imsOrgId || null,
      orgName: org.name || org.imsOrgId || 'Unknown',
    }));
  } catch (err) {
    console.error('[OrgSite] SpaceCat orgs call failed:', err.message);
    return [];
  }
}

/**
 * Fetch sites for a specific organization.
 *
 * @param {string} orgId - SpaceCat organization ID
 * @param {string} token
 * @returns {Promise<Array<{siteId: string, baseURL: string, deliveryType: string}>>}
 */
export async function fetchOrgSites(orgId, token) {
  const url = ASO_ENDPOINTS.ORGANIZATION_SITES(orgId);
  const response = await apiGet(url, token);

  if (isApiError(response)) {
    console.warn(`[OrgSite] Failed to fetch sites for org ${orgId}:`, response.message);
    return [];
  }

  const sites = Array.isArray(response) ? response : (response.sites || response.data || []);
  return sites.map((site) => ({
    siteId: site.id,
    baseURL: site.baseURL || '',
    deliveryType: site.deliveryType || '',
    isLive: site.isLive ?? true,
  }));
}

/**
 * Look up a single site by ID. Returns site details including its organizationId.
 *
 * @param {string} siteId
 * @param {string} token
 * @returns {Promise<{siteId, baseURL, organizationId, orgName}|null>}
 */
export async function fetchSiteById(siteId, token) {
  const url = ASO_ENDPOINTS.SITE(siteId);
  const response = await apiGet(url, token);

  if (isApiError(response)) {
    console.warn(`[OrgSite] Failed to fetch site ${siteId}:`, response.message);
    return null;
  }

  return {
    siteId: response.id || siteId,
    baseURL: response.baseURL || '',
    organizationId: response.organizationId || null,
    deliveryType: response.deliveryType || '',
    isLive: response.isLive ?? true,
  };
}

/**
 * Fetch ALL sites and group them by organizationId.
 * Returns a Map<orgId, site[]> so we can pre-populate orgs and filter empties.
 *
 * @param {string} token
 * @returns {Promise<Map<string, Array>|null>} null if the call fails
 */
async function fetchAllSitesGrouped(token) {
  try {
    const url = ASO_ENDPOINTS.SITES();
    const response = await apiGet(url, token);

    if (isApiError(response)) {
      console.warn('[OrgSite] Failed to fetch sites list:', response.message);
      return null;
    }

    const raw2 = response.sites || response.data || [];
    const sites = Array.isArray(response) ? response : raw2;
    const grouped = new Map();
    sites.forEach((site) => {
      const orgId = site.organizationId;
      if (!orgId) return;
      if (!grouped.has(orgId)) grouped.set(orgId, []);
      grouped.get(orgId).push({
        siteId: site.id,
        baseURL: site.baseURL || '',
        deliveryType: site.deliveryType || '',
        isLive: site.isLive ?? true,
      });
    });
    return grouped;
  } catch (err) {
    console.warn('[OrgSite] Sites list call failed:', err.message);
    return null;
  }
}

/**
 * Build a customer list with pre-populated sites.
 * Fetches /organizations and /sites in parallel, then joins them.
 * Only returns orgs that have at least one site.
 *
 * @param {string} token - SpaceCat API key or IMS access token
 * @returns {Promise<Array<{orgId, orgName, imsOrgId, sites: Array}>>}
 */
export async function buildCustomerSiteTree(token) {
  const [spacecatOrgs, sitesMap] = await Promise.all([
    fetchSpaceCatOrgs(token),
    fetchAllSitesGrouped(token),
  ]);

  if (sitesMap) {
    // Join: only include orgs that have sites, and pre-populate their sites
    return spacecatOrgs
      .filter((sc) => {
        const sites = sitesMap.get(sc.orgId);
        return sites && sites.length > 0;
      })
      .map((sc) => ({ ...sc, sites: sitesMap.get(sc.orgId) }));
  }

  // Fallback if /sites failed — return all orgs, lazy-load sites later
  return spacecatOrgs.map((sc) => ({ ...sc, sites: [] }));
}

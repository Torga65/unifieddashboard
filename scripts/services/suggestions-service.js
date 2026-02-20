/**
 * Suggestions Service
 * 
 * Service layer for fetching and managing ASO suggestions from SpaceCat API.
 * Handles opportunities, suggestions, and fixes lifecycle tracking.
 * 
 * Adapted from llmo-spacecat-dashboard/src/services/llmoService.js
 */

import { 
  ASO_ENDPOINTS, 
  SUGGESTION_STATUS, 
  OPPORTUNITY_STATUS,
  FIX_STATUS,
  PAGINATION,
  ASO_OPPORTUNITY_TYPES,
} from '../constants/api.js';
import { 
  apiGet, 
  apiPost, 
  apiPatch, 
  isApiError, 
  batchRequests,
  buildUrl,
} from './spacecat-api.js';

/**
 * Normalize URL for comparison (removes protocol, www, query params, trailing slashes)
 * @param {string} url - URL to normalize
 * @returns {string} Normalized URL
 */
export function normalizeUrl(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    let normalized = parsed.hostname.replace(/^www\./, '') + parsed.pathname;
    // Remove trailing slash
    normalized = normalized.replace(/\/$/, '');
    return normalized.toLowerCase();
  } catch {
    // If URL parsing fails, do basic normalization
    return url
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\?.*$/, '')
      .replace(/\/$/, '')
      .toLowerCase();
  }
}

/**
 * Fetch site details (name, baseURL, etc.)
 * @param {string} siteId - Site ID
 * @param {string|null} token - Auth token
 * @returns {Promise<Object|null>} Site details or null on error
 */
export async function fetchSiteInfo(siteId, token = null) {
  const url = ASO_ENDPOINTS.SITE(siteId);
  const response = await apiGet(url, token);
  
  if (isApiError(response)) {
    console.warn('Failed to fetch site info:', response.message);
    return null;
  }
  
  return response;
}

/**
 * Fetch all opportunities for a site
 * @param {string} siteId - Site ID
 * @param {string|null} token - Auth token
 * @param {Object} filters - Optional filters (status, type, etc.)
 * @returns {Promise<Array>} Array of opportunities
 */
export async function fetchSiteOpportunities(siteId, token = null, filters = {}) {
  const params = {
    pageSize: filters.pageSize || PAGINATION.DEFAULT_PAGE_SIZE,
    ...filters,
  };
  
  const url = buildUrl(ASO_ENDPOINTS.SITE_OPPORTUNITIES(siteId), params);
  const response = await apiGet(url, token);
  
  if (isApiError(response)) {
    console.error('Failed to fetch opportunities:', response.message);
    return [];
  }
  
  // Handle paginated response
  return response.opportunities || response.data || response || [];
}

/**
 * Fetch suggestions for a specific opportunity
 * @param {string} siteId - Site ID
 * @param {string} opportunityId - Opportunity ID
 * @param {string|null} token - Auth token
 * @returns {Promise<Array>} Array of suggestions
 */
export async function fetchOpportunitySuggestions(siteId, opportunityId, token = null) {
  const url = ASO_ENDPOINTS.OPPORTUNITY_SUGGESTIONS(siteId, opportunityId);
  const response = await apiGet(url, token);
  
  if (isApiError(response)) {
    console.error(`Failed to fetch suggestions for opportunity ${opportunityId}:`, response.message);
    return [];
  }
  
  return response.suggestions || response.data || response || [];
}

/**
 * Fetch fixes for a specific opportunity
 * @param {string} siteId - Site ID
 * @param {string} opportunityId - Opportunity ID
 * @param {string|null} token - Auth token
 * @returns {Promise<Array>} Array of fixes
 */
export async function fetchOpportunityFixes(siteId, opportunityId, token = null) {
  const url = ASO_ENDPOINTS.OPPORTUNITY_FIXES(siteId, opportunityId);
  const response = await apiGet(url, token);
  
  if (isApiError(response)) {
    console.error(`Failed to fetch fixes for opportunity ${opportunityId}:`, response.message);
    return [];
  }
  
  return response.fixes || response.data || response || [];
}

/**
 * Aggregate fix counts from a list of fix objects
 * @param {Array} fixes - Array of fix objects from the API
 * @returns {Object} Counts by fix status
 */
export function aggregateFixCounts(fixes) {
  const counts = {
    pendingFixes: 0,
    inProgressFixes: 0,
    completedFixes: 0,
    failedFixes: 0,
    totalFixes: fixes.length,
  };

  fixes.forEach((fix) => {
    switch (fix.status) {
      case FIX_STATUS.COMPLETED:
        counts.completedFixes++;
        break;
      case FIX_STATUS.FAILED:
        counts.failedFixes++;
        break;
      case FIX_STATUS.IN_PROGRESS:
        counts.inProgressFixes++;
        break;
      case FIX_STATUS.PENDING:
      default:
        counts.pendingFixes++;
        break;
    }
  });

  return counts;
}

/**
 * Fetch fixes for opportunities that have at least one FIXED suggestion.
 * Returns a Map of opportunityId -> fix counts.
 * Fails gracefully — returns empty data if /fixes is unavailable.
 *
 * @param {string} siteId - Site ID
 * @param {Array} opportunities - Enriched opportunities (with suggestionsCounts)
 * @param {string|null} token - Auth token
 * @param {number} batchSize - Concurrent requests
 * @param {number} delayMs - Delay between batches
 * @returns {Promise<Map>} Map of opportunityId -> fix counts
 */
export async function fetchFixesForOpportunities(
  siteId,
  opportunities,
  token = null,
  batchSize = 20,
  delayMs = 50,
) {
  const fixesMap = new Map();

  // Only fetch fixes for opportunities that have at least one FIXED suggestion
  const oppsWithFixes = opportunities.filter(
    (opp) => (opp.suggestionsCounts?.fixedCount || 0) > 0,
  );

  if (oppsWithFixes.length === 0) return fixesMap;

  const requests = oppsWithFixes.map((opp) => async () => {
    try {
      const fixes = await fetchOpportunityFixes(siteId, opp.id, token);
      const counts = aggregateFixCounts(fixes);
      return { id: opp.id, fixes, counts };
    } catch (err) {
      console.warn(`Failed to fetch fixes for opportunity ${opp.id}:`, err);
      return { id: opp.id, fixes: [], counts: aggregateFixCounts([]) };
    }
  });

  const results = await batchRequests(requests, batchSize, delayMs);

  results.forEach((result) => {
    if (result && result.id) {
      fixesMap.set(result.id, {
        fixes: result.fixes,
        counts: result.counts,
      });
    }
  });

  return fixesMap;
}

/**
 * Filter opportunities to core ASO types
 * @param {Array} opportunities - Array of opportunity objects
 * @param {boolean} coreOnly - If true, filter to ASO_OPPORTUNITY_TYPES
 * @returns {Array} Filtered opportunities
 */
export function filterByASOTypes(opportunities, coreOnly = true) {
  if (!coreOnly) return opportunities;
  const typeSet = new Set(ASO_OPPORTUNITY_TYPES);
  return opportunities.filter((opp) => typeSet.has(opp.type));
}

/**
 * Aggregate suggestion counts by status.
 * Counts are strictly based on API status — no heuristic deployment detection.
 *
 * Exposes per-status counts plus derived totals:
 *   pendingCount  = NEW + APPROVED + IN_PROGRESS + PENDING_VALIDATION
 *   rejectedTotal = SKIPPED + REJECTED
 *   terminalCount = FIXED + rejectedTotal + ERROR + OUTDATED
 *
 * @param {Array} suggestions - Array of suggestion objects
 * @returns {Object} Counts by status plus derived totals
 */
export function aggregateSuggestionCounts(suggestions) {
  const counts = {
    // Per-status counts
    newCount: 0,
    approvedCount: 0,
    inProgressCount: 0,
    pendingValidationCount: 0,
    fixedCount: 0,
    skippedCount: 0,
    rejectedRawCount: 0,
    errorCount: 0,
    outdatedCount: 0,
    totalCount: suggestions.length,
  };

  suggestions.forEach((suggestion) => {
    const status = suggestion.status || SUGGESTION_STATUS.NEW;
    switch (status) {
      case SUGGESTION_STATUS.FIXED:
        counts.fixedCount++;
        break;
      case SUGGESTION_STATUS.SKIPPED:
        counts.skippedCount++;
        break;
      case SUGGESTION_STATUS.REJECTED:
        counts.rejectedRawCount++;
        break;
      case SUGGESTION_STATUS.APPROVED:
        counts.approvedCount++;
        break;
      case SUGGESTION_STATUS.IN_PROGRESS:
        counts.inProgressCount++;
        break;
      case SUGGESTION_STATUS.PENDING_VALIDATION:
        counts.pendingValidationCount++;
        break;
      case SUGGESTION_STATUS.ERROR:
        counts.errorCount++;
        break;
      case SUGGESTION_STATUS.OUTDATED:
        counts.outdatedCount++;
        break;
      default:
        // NEW or unknown status
        counts.newCount++;
    }
  });

  // Derived totals
  counts.pendingCount =
    counts.newCount +
    counts.approvedCount +
    counts.inProgressCount +
    counts.pendingValidationCount;

  // Skipped/Ignored = customer chose to skip (SKIPPED status)
  // Rejected = ESE flagged as false positive (REJECTED status)
  // These are tracked separately — no longer lumped together

  counts.terminalCount =
    counts.fixedCount +
    counts.skippedCount +
    counts.rejectedRawCount +
    counts.errorCount +
    counts.outdatedCount;

  return counts;
}

/**
 * Fetch suggestions for multiple opportunities with batching
 * @param {string} siteId - Site ID
 * @param {Array} opportunities - Array of opportunity objects
 * @param {string|null} token - Auth token
 * @param {number} batchSize - Number of concurrent requests
 * @param {number} delayMs - Delay between batches
 * @returns {Promise<Map>} Map of opportunityId -> suggestion counts
 */
export async function fetchSuggestionsForOpportunities(
  siteId, 
  opportunities, 
  token = null, 
  batchSize = 20, 
  delayMs = 50
) {
  const suggestionsMap = new Map();
  
  const requests = opportunities.map(opp => async () => {
    const suggestions = await fetchOpportunitySuggestions(siteId, opp.id, token);
    const counts = aggregateSuggestionCounts(suggestions);
    return { id: opp.id, suggestions, counts };
  });
  
  const results = await batchRequests(requests, batchSize, delayMs);
  
  results.forEach(result => {
    if (result && result.id) {
      suggestionsMap.set(result.id, {
        suggestions: result.suggestions,
        counts: result.counts,
      });
    }
  });
  
  return suggestionsMap;
}

/**
 * Update suggestion status
 * @param {string} siteId - Site ID
 * @param {string} opportunityId - Opportunity ID
 * @param {string} suggestionId - Suggestion ID
 * @param {string} status - New status
 * @param {string|null} token - Auth token
 * @returns {Promise<Object|null>} Updated suggestion or null on error
 */
export async function updateSuggestionStatus(siteId, opportunityId, suggestionId, status, token = null) {
  const url = ASO_ENDPOINTS.SUGGESTION(siteId, opportunityId, suggestionId);
  const response = await apiPatch(url, { status }, token);
  
  if (isApiError(response)) {
    console.error(`Failed to update suggestion ${suggestionId}:`, response.message);
    return null;
  }
  
  return response;
}

/**
 * Update opportunity status
 * @param {string} siteId - Site ID
 * @param {string} opportunityId - Opportunity ID
 * @param {string} status - New status
 * @param {string|null} token - Auth token
 * @returns {Promise<Object|null>} Updated opportunity or null on error
 */
export async function updateOpportunityStatus(siteId, opportunityId, status, token = null) {
  const url = ASO_ENDPOINTS.OPPORTUNITY(siteId, opportunityId);
  const response = await apiPatch(url, { status }, token);
  
  if (isApiError(response)) {
    console.error(`Failed to update opportunity ${opportunityId}:`, response.message);
    return null;
  }
  
  return response;
}

/**
 * Enrich opportunities with suggestion counts and (optionally) fix counts.
 * @param {string} siteId - Site ID
 * @param {Array} opportunities - Array of opportunities
 * @param {string|null} token - Auth token
 * @param {boolean} includeFixes - Whether to also fetch /fixes data
 * @returns {Promise<Array>} Opportunities with suggestionsCounts (and fixesCounts) properties
 */
export async function enrichOpportunitiesWithSuggestions(siteId, opportunities, token = null, includeFixes = true) {
  const suggestionsMap = await fetchSuggestionsForOpportunities(siteId, opportunities, token);

  // First pass: attach suggestion data so fixedCount is available
  let enriched = opportunities.map(opp => {
    const suggestionData = suggestionsMap.get(opp.id) || { suggestions: [], counts: {} };
    return {
      ...opp,
      suggestions: suggestionData.suggestions,
      suggestionsCounts: suggestionData.counts,
    };
  });

  // Second pass: fetch fixes (only for opps with FIXED suggestions)
  if (includeFixes) {
    try {
      const fixesMap = await fetchFixesForOpportunities(siteId, enriched, token);
      enriched = enriched.map(opp => {
        const fixData = fixesMap.get(opp.id);
        if (!fixData) return opp;

        // Cross-reference fixes with suggestions to identify auto-fixed vs manual
        const fixBySuggestionId = new Map();
        (fixData.fixes || []).forEach((fix) => {
          if (fix.suggestionId) fixBySuggestionId.set(fix.suggestionId, fix);
        });

        let autoFixedCount = 0;
        let manualFixedCount = 0;
        (opp.suggestions || []).forEach((sug) => {
          if (sug.status !== 'FIXED') return;
          const matchedFix = fixBySuggestionId.get(sug.id);
          if (matchedFix && matchedFix.status === 'COMPLETED') {
            autoFixedCount++;
          } else {
            manualFixedCount++;
          }
        });

        // Group failures by opportunity type
        const failedFixes = (fixData.fixes || []).filter(f => f.status === 'FAILED');

        return {
          ...opp,
          fixes: fixData.fixes,
          fixesCounts: fixData.counts,
          automationCounts: {
            autoFixedCount,
            manualFixedCount,
            failedFixCount: failedFixes.length,
          },
        };
      });
    } catch (err) {
      // /fixes is optional — don't break the page
      console.warn('Failed to fetch fixes data (non-fatal):', err);
    }
  }

  return enriched;
}

/**
 * Get full lifecycle data for a site
 * Fetches opportunities, enriches with suggestions, and returns structured data
 * @param {string} siteId - Site ID
 * @param {string|null} token - Auth token
 * @param {Object} options - Options for filtering and batching
 * @returns {Promise<Object>} Lifecycle data object
 */
export async function getSiteLifecycleData(siteId, token = null, options = {}) {
  const {
    includeResolved = true,
    includeIgnored = false,
    batchSize = 20,
  } = options;
  
  // Build filters
  const filters = {};
  if (!includeResolved && !includeIgnored) {
    filters.status = `${OPPORTUNITY_STATUS.NEW},${OPPORTUNITY_STATUS.IN_PROGRESS}`;
  }
  
  // Fetch site info and opportunities in parallel
  const [siteInfo, opportunities] = await Promise.all([
    fetchSiteInfo(siteId, token),
    fetchSiteOpportunities(siteId, token, filters),
  ]);
  
  const siteName = siteInfo?.baseURL || siteInfo?.deliveryType || null;
  
  if (opportunities.length === 0) {
    return {
      siteId,
      siteName,
      opportunities: [],
      totalOpportunities: 0,
      totalSuggestions: 0,
      fetchedAt: new Date().toISOString(),
    };
  }
  
  // Enrich with suggestions
  const enrichedOpportunities = await enrichOpportunitiesWithSuggestions(
    siteId, 
    opportunities, 
    token
  );
  
  // Only keep opportunities that have at least one suggestion
  const withSuggestions = enrichedOpportunities.filter(
    opp => (opp.suggestionsCounts?.totalCount || 0) > 0,
  );
  
  // Calculate totals
  const totalSuggestions = withSuggestions.reduce(
    (sum, opp) => sum + (opp.suggestionsCounts?.totalCount || 0), 
    0
  );
  
  return {
    siteId,
    siteName,
    opportunities: withSuggestions,
    totalOpportunities: withSuggestions.length,
    totalSuggestions,
    fetchedAt: new Date().toISOString(),
  };
}

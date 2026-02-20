import { Router } from 'express';
import axios from 'axios';
import { aggregateOpportunities } from '../aggregation.js';
import { cacheGet, cacheSet } from '../cache.js';
import { getSnapshot, getSnapshotDate } from '../snapshot-reader.js';

const router = Router();

const SPACECAT_BASE = process.env.SPACECAT_API_BASE || 'https://spacecat.experiencecloud.live/api/v1';
const BATCH_SIZE = 8;           // concurrent SpaceCat calls per batch
const BATCH_DELAY_MS = 100;     // delay between batches to avoid 503

// ---- Helpers ----

/**
 * Extract Bearer token from request.
 */
function extractToken(req) {
  return req.headers.authorization?.replace('Bearer ', '') || null;
}

/**
 * Make an authenticated GET to SpaceCat.
 */
async function spacecatGet(url, token) {
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    timeout: 30_000,
  });
  return res.data;
}

/**
 * Fetch ALL site IDs with a single GET /sites call.
 * This replaces the old fetchAllSiteIds() which made 1+N calls (orgs + per-org sites).
 */
async function fetchAllSiteIdsFlat(token) {
  const url = `${SPACECAT_BASE}/sites`;
  console.log('[Portfolio] Fetching all sites via GET /sites...');
  const data = await spacecatGet(url, token);
  const sites = Array.isArray(data) ? data : (data.sites || data.data || []);
  const siteIds = sites.map((s) => s.id || s.siteId).filter(Boolean);
  console.log(`[Portfolio] Got ${siteIds.length} sites from single GET /sites call`);
  return siteIds;
}

/**
 * Fetch sites for a single organization.
 */
async function fetchOrgSites(orgId, token) {
  const url = `${SPACECAT_BASE}/organizations/${orgId}/sites`;
  const data = await spacecatGet(url, token);
  const sites = Array.isArray(data) ? data : (data.sites || data.data || []);
  return sites.map((s) => s.id || s.siteId);
}

/**
 * Fetch all opportunities for a single site.
 */
async function fetchSiteOpportunities(siteId, token) {
  const url = `${SPACECAT_BASE}/sites/${siteId}/opportunities`;
  try {
    const data = await spacecatGet(url, token);
    const opps = Array.isArray(data) ? data : (data.opportunities || data.data || []);
    return opps;
  } catch (err) {
    const status = err.response?.status || 0;
    if (status !== 404) {
      console.warn(`[Portfolio] Failed to fetch opportunities for site ${siteId}: ${status}`);
    }
    return []; // partial failure is OK — skip this site
  }
}

/**
 * Fetch opportunities for multiple sites with concurrency control.
 * Logs progress every 10% of sites.
 */
async function fetchOpportunitiesForSites(siteIds, token) {
  const allOpps = [];
  const total = siteIds.length;
  let processed = 0;
  const logInterval = Math.max(1, Math.floor(total / 10));

  for (let i = 0; i < total; i += BATCH_SIZE) {
    const batch = siteIds.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map((id) => fetchSiteOpportunities(id, token)));
    for (const opps of results) {
      allOpps.push(...opps);
    }

    processed += batch.length;
    if (processed % logInterval < BATCH_SIZE || processed === total) {
      console.log(`[Portfolio] Progress: ${processed}/${total} sites fetched (${allOpps.length} opps so far)`);
    }

    // Delay between batches to be gentle on SpaceCat
    if (i + BATCH_SIZE < total) {
      await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
    }
  }

  return allOpps;
}

// ---- Route ----

/**
 * GET /api/portfolio/opportunity-metrics
 *
 * Query params:
 *   orgId     - SpaceCat org ID (for one customer's sites)
 *   siteIds   - comma-separated site IDs (explicit list)
 *   siteScope - 'global' to fetch ALL sites, or 'all' (default, requires orgId)
 *   from      - (required) 'YYYY-MM-DD'
 *   to        - (required) 'YYYY-MM-DD'
 *
 * Priority: siteIds > siteScope=global > orgId
 */
router.get('/opportunity-metrics', async (req, res) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const { orgId, siteIds: siteIdsParam, siteScope, from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({ error: '`from` and `to` query params are required (YYYY-MM-DD)' });
  }

  // Resolve which sites to query
  let siteIds;
  let scope = 'custom'; // for cache key

  if (siteIdsParam) {
    siteIds = siteIdsParam.split(',').map((s) => s.trim()).filter(Boolean);
    scope = 'custom';
  } else if (siteScope === 'global') {
    // ALL sites via single GET /sites call
    scope = 'global';
    const siteCacheKey = 'sites:global';
    siteIds = cacheGet(siteCacheKey);
    if (!siteIds) {
      try {
        siteIds = await fetchAllSiteIdsFlat(token);
        cacheSet(siteCacheKey, siteIds, 30 * 60 * 1000);
      } catch (err) {
        console.error('[Portfolio] Failed to fetch all sites:', err.message);
        return res.status(502).json({ error: 'Failed to fetch sites from SpaceCat' });
      }
    } else {
      console.log(`[Portfolio] Using cached site list (${siteIds.length} sites)`);
    }
  } else if (orgId) {
    scope = orgId;
    const siteCacheKey = `sites:${orgId}`;
    siteIds = cacheGet(siteCacheKey);
    if (!siteIds) {
      try {
        siteIds = await fetchOrgSites(orgId, token);
        cacheSet(siteCacheKey, siteIds, 30 * 60 * 1000);
      } catch (err) {
        console.error('[Portfolio] Failed to fetch org sites:', err.message);
        return res.status(502).json({ error: 'Failed to fetch organization sites from SpaceCat' });
      }
    }
  } else {
    return res.status(400).json({ error: 'Provide `siteScope=global`, `orgId`, or `siteIds`' });
  }

  if (!siteIds || siteIds.length === 0) {
    return res.json({ buckets: [], totalCounts: {}, siteCount: 0 });
  }

  // Check aggregation cache
  const cacheKey = `metrics:${scope}:${from}:${to}`;
  const cached = cacheGet(cacheKey);
  if (cached) {
    console.log(`[Portfolio] Cache hit for ${cacheKey}`);
    return res.json(cached);
  }

  // ---- Snapshot fast-path for global scope ----
  const snapshot = scope === 'global' ? getSnapshot() : null;

  if (snapshot) {
    // Use snapshot data — no live SpaceCat calls needed for the historical portion.
    // If the requested range extends beyond the snapshot date, fetch a live delta.
    const snapshotDate = snapshot.snapshotDate; // 'YYYY-MM-DD'
    const startTime = Date.now();

    let allOpps = snapshot.opportunities;
    let source = 'snapshot';

    if (to > snapshotDate) {
      // Need live data for the delta period (snapshotDate+1 .. to)
      console.log(`[Portfolio] Snapshot covers up to ${snapshotDate}, fetching live delta for ${snapshotDate} → ${to}`);
      const liveOpps = await fetchOpportunitiesForSites(siteIds, token);
      // Merge: use snapshot opps + any live opps not already in snapshot (by id)
      const snapshotIds = new Set(allOpps.map((o) => o.id));
      const deltaOpps = liveOpps.filter((o) => !snapshotIds.has(o.id));
      // Also update existing opps whose status may have changed since snapshot
      const liveById = new Map(liveOpps.map((o) => [o.id, o]));
      allOpps = allOpps.map((o) => liveById.get(o.id) || o);
      allOpps.push(...deltaOpps);
      source = 'snapshot+live';
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[Portfolio] Aggregating ${allOpps.length} opportunities (source: ${source}) in ${elapsed}s`);

    const result = aggregateOpportunities(allOpps, from, to);
    result.siteCount = snapshot.siteCount;
    result.snapshotDate = snapshotDate;
    result.source = source;

    cacheSet(cacheKey, result, 30 * 60 * 1000);
    return res.json(result);
  }

  // ---- Live fetch (no snapshot available, or single-org scope) ----
  const startTime = Date.now();
  console.log(`[Portfolio] Fetching opportunities for ${siteIds.length} sites (live)...`);
  const allOpps = await fetchOpportunitiesForSites(siteIds, token);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`[Portfolio] Fetched ${allOpps.length} total opportunities in ${elapsed}s`);

  const result = aggregateOpportunities(allOpps, from, to);
  result.siteCount = siteIds.length;
  result.source = 'live';

  // Cache the result
  cacheSet(cacheKey, result, 30 * 60 * 1000);

  return res.json(result);
});

export default router;

#!/usr/bin/env node
/**
 * Snapshot script — fetches opportunities from SpaceCat and writes
 * a JSON snapshot to server/data/snapshots/.
 *
 * Usage (all sites — global snapshot):
 *   node scripts/snapshot.js --token <SPACECAT_API_TOKEN>
 *
 * Usage (single org):
 *   node scripts/snapshot.js --token <TOKEN> --org <ORG_ID>
 *
 * Or set the SPACECAT_TOKEN env var:
 *   SPACECAT_TOKEN=xxx node scripts/snapshot.js
 *
 * The snapshot contains only the fields needed for portfolio aggregation,
 * keeping file size manageable (~50-80 bytes per opportunity).
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SNAPSHOTS_DIR = join(__dirname, '..', 'data', 'snapshots');

const SPACECAT_BASE = process.env.SPACECAT_API_BASE || 'https://spacecat.experiencecloud.live/api/v1';
const BATCH_SIZE = 10;
const BATCH_DELAY_MS = 80;

// ---- Helpers ----

async function spacecatGet(url, token) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    signal: AbortSignal.timeout(60_000),
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return res.json();
}

async function fetchAllSiteIds(token) {
  console.log('[Snapshot] Fetching all sites...');
  const data = await spacecatGet(`${SPACECAT_BASE}/sites`, token);
  const sites = Array.isArray(data) ? data : (data.sites || data.data || []);
  const ids = sites.map((s) => s.id || s.siteId).filter(Boolean);
  console.log(`[Snapshot] Found ${ids.length} sites`);
  return ids;
}

async function fetchOrgSiteIds(orgId, token) {
  console.log(`[Snapshot] Fetching sites for org ${orgId}...`);
  const url = `${SPACECAT_BASE}/organizations/${orgId}/sites`;
  const data = await spacecatGet(url, token);
  const sites = Array.isArray(data) ? data : (data.sites || data.data || []);
  const ids = sites.map((s) => s.id || s.siteId).filter(Boolean);
  console.log(`[Snapshot] Found ${ids.length} sites for org ${orgId}`);
  return ids;
}

async function fetchSiteOpportunities(siteId, token) {
  const url = `${SPACECAT_BASE}/sites/${siteId}/opportunities`;
  try {
    const data = await spacecatGet(url, token);
    const opps = Array.isArray(data) ? data : (data.opportunities || data.data || []);
    return opps.map((o) => ({
      id: o.id,
      siteId: o.siteId || siteId,
      status: o.status,
      type: o.type || o.opportunityType || '',
      createdAt: o.createdAt || '',
      updatedAt: o.updatedAt || '',
    }));
  } catch {
    return [];
  }
}

async function fetchOpportunitySuggestions(siteId, oppId, token) {
  const url = `${SPACECAT_BASE}/sites/${siteId}/opportunities/${oppId}/suggestions`;
  try {
    const data = await spacecatGet(url, token);
    return Array.isArray(data) ? data : (data.suggestions || data.data || []);
  } catch {
    return [];
  }
}

/** Suggestion status enum (match client). */
const SUG = {
  FIXED: 'FIXED',
  SKIPPED: 'SKIPPED',
  REJECTED: 'REJECTED',
  APPROVED: 'APPROVED',
  IN_PROGRESS: 'IN_PROGRESS',
  PENDING_VALIDATION: 'PENDING_VALIDATION',
  ERROR: 'ERROR',
  OUTDATED: 'OUTDATED',
  NEW: 'NEW',
};

function aggregateSuggestionCounts(suggestions) {
  const counts = {
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
  for (const s of suggestions) {
    const status = (s.status || SUG.NEW);
    switch (status) {
      case SUG.FIXED: counts.fixedCount++; break;
      case SUG.SKIPPED: counts.skippedCount++; break;
      case SUG.REJECTED: counts.rejectedRawCount++; break;
      case SUG.APPROVED: counts.approvedCount++; break;
      case SUG.IN_PROGRESS: counts.inProgressCount++; break;
      case SUG.PENDING_VALIDATION: counts.pendingValidationCount++; break;
      case SUG.ERROR: counts.errorCount++; break;
      case SUG.OUTDATED: counts.outdatedCount++; break;
      default: counts.newCount++; break;
    }
  }
  counts.pendingCount = counts.newCount + counts.approvedCount
    + counts.inProgressCount + counts.pendingValidationCount;
  counts.terminalCount = counts.fixedCount + counts.skippedCount
    + counts.rejectedRawCount + counts.errorCount + counts.outdatedCount;
  counts.awaitingCustomerReviewCount = counts.newCount + counts.approvedCount
   + counts.inProgressCount;
  return counts;
}

const SUGGESTION_BATCH_SIZE = 8;
const SUGGESTION_BATCH_DELAY_MS = 100;

async function enrichOpportunitiesWithSuggestionCounts(opportunities, token) {
  let done = 0;
  const total = opportunities.length;
  const logEvery = Math.max(1, Math.floor(total / 20));
  for (let i = 0; i < total; i += SUGGESTION_BATCH_SIZE) {
    const batch = opportunities.slice(i, i + SUGGESTION_BATCH_SIZE);
    const results = await Promise.all(
      batch.map(async (opp) => {
        const list = await fetchOpportunitySuggestions(opp.siteId, opp.id, token);
        return { opp, counts: aggregateSuggestionCounts(list) };
      }),
    );
    for (const { opp, counts } of results) {
      opp.suggestionCounts = counts;
    }
    done += batch.length;
    if (done % logEvery < SUGGESTION_BATCH_SIZE || done === total) {
      const pct = ((done / total) * 100).toFixed(0);
      console.log(`[Snapshot] Suggestions: ${done}/${total} opps (${pct}%)`);
    }
    if (i + SUGGESTION_BATCH_SIZE < total) {
      await new Promise((r) => { setTimeout(r, SUGGESTION_BATCH_DELAY_MS); });
    }
  }
}

function formatEta(elapsedMs, processed, total) {
  if (processed === 0) return '';
  const remaining = total - processed;
  const msPerItem = elapsedMs / processed;
  const etaSec = Math.round((remaining * msPerItem) / 1000);
  if (etaSec < 60) return `~${etaSec}s remaining`;
  return `~${Math.round(etaSec / 60)}m ${etaSec % 60}s remaining`;
}

function parseArg(flag) {
  const idx = process.argv.indexOf(flag);
  return idx !== -1 ? process.argv[idx + 1] : null;
}

// ---- Main ----

async function run() {
  const token = parseArg('--token') || process.env.SPACECAT_TOKEN;
  const orgId = parseArg('--org') || null;

  if (!token) {
    console.error('Error: provide a token via --token <TOKEN> or SPACECAT_TOKEN env var');
    process.exit(1);
  }

  const startTime = Date.now();
  const scope = orgId ? `org ${orgId}` : 'global';
  console.log(`[Snapshot] Starting ${scope} snapshot...`);

  // 1. Get site IDs
  const siteIds = orgId
    ? await fetchOrgSiteIds(orgId, token)
    : await fetchAllSiteIds(token);

  // 2. Fetch opportunities in batches
  const allOpps = [];
  let processed = 0;
  const logInterval = Math.max(1, Math.floor(siteIds.length / 20));

  for (let i = 0; i < siteIds.length; i += BATCH_SIZE) {
    const batch = siteIds.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map((id) => fetchSiteOpportunities(id, token)));
    for (const opps of results) {
      allOpps.push(...opps);
    }
    processed += batch.length;
    if (processed % logInterval < BATCH_SIZE || processed === siteIds.length) {
      const pct = ((processed / siteIds.length) * 100).toFixed(0);
      const eta = formatEta(Date.now() - startTime, processed, siteIds.length);
      console.log(`[Snapshot] ${processed}/${siteIds.length} sites (${pct}%) — ${allOpps.length} opps ${eta}`);
    }
    if (i + BATCH_SIZE < siteIds.length) {
      await new Promise((r) => { setTimeout(r, BATCH_DELAY_MS); });
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`[Snapshot] Fetched ${allOpps.length} opportunities from ${siteIds.length} sites in ${elapsed}s`);

  // 2b. Enrich each opportunity with suggestion counts (one request per opp)
  console.log('[Snapshot] Fetching suggestion counts per opportunity...');
  await enrichOpportunitiesWithSuggestionCounts(allOpps, token);

  // 3. Write snapshot
  const today = new Date().toISOString().slice(0, 10);
  const snapshot = {
    snapshotDate: today,
    generatedAt: new Date().toISOString(),
    scope: orgId || 'global',
    siteCount: siteIds.length,
    opportunityCount: allOpps.length,
    opportunities: allOpps,
  };

  if (!existsSync(SNAPSHOTS_DIR)) {
    mkdirSync(SNAPSHOTS_DIR, { recursive: true });
  }

  const prefix = orgId ? `org-${orgId}` : 'global';
  const filename = `${prefix}-${today}.json`;
  const filepath = join(SNAPSHOTS_DIR, filename);
  const jsonStr = JSON.stringify(snapshot);
  writeFileSync(filepath, jsonStr);
  const sizeMB = (Buffer.byteLength(jsonStr) / 1024 / 1024).toFixed(1);
  console.log(`[Snapshot] Wrote ${filepath} (${sizeMB} MB)`);

  // 4. Write latest pointer (only for global snapshots)
  if (!orgId) {
    const latestPath = join(SNAPSHOTS_DIR, 'latest.json');
    const latestData = { file: filename, date: today, generatedAt: snapshot.generatedAt };
    writeFileSync(latestPath, JSON.stringify(latestData));
    console.log(`[Snapshot] Updated ${latestPath}`);
  }

  console.log('[Snapshot] Done!');
}

run().catch((err) => {
  console.error('[Snapshot] Fatal error:', err);
  process.exit(1);
});

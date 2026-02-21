#!/usr/bin/env node
/**
 * Snapshot script — fetches all opportunities from SpaceCat and writes
 * a JSON snapshot to server/data/snapshots/.
 *
 * Usage:
 *   node scripts/snapshot.js --token <SPACECAT_API_TOKEN>
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
const BATCH_SIZE = 10; // higher concurrency for offline script
const BATCH_DELAY_MS = 80; // slightly gentler than real-time but still fast

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

async function fetchSiteOpportunities(siteId, token) {
  const url = `${SPACECAT_BASE}/sites/${siteId}/opportunities`;
  try {
    const data = await spacecatGet(url, token);
    const opps = Array.isArray(data) ? data : (data.opportunities || data.data || []);
    // Only keep the fields we need for aggregation
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

// ---- Main ----

async function run() {
  // Parse token from --token flag or env
  const tokenIdx = process.argv.indexOf('--token');
  const token = (tokenIdx !== -1 && process.argv[tokenIdx + 1])
    || process.env.SPACECAT_TOKEN;

  if (!token) {
    console.error('Error: provide a token via --token <TOKEN> or SPACECAT_TOKEN env var');
    process.exit(1);
  }

  const startTime = Date.now();

  // 1. Get all site IDs
  const siteIds = await fetchAllSiteIds(token);

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
      console.log(`[Snapshot] ${processed}/${siteIds.length} sites (${pct}%) — ${allOpps.length} opps`);
    }
    if (i + BATCH_SIZE < siteIds.length) {
      await new Promise((r) => { setTimeout(r, BATCH_DELAY_MS); });
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`[Snapshot] Fetched ${allOpps.length} opportunities from ${siteIds.length} sites in ${elapsed}s`);

  // 3. Write snapshot
  const today = new Date().toISOString().slice(0, 10);
  const snapshot = {
    snapshotDate: today,
    generatedAt: new Date().toISOString(),
    siteCount: siteIds.length,
    opportunityCount: allOpps.length,
    opportunities: allOpps,
  };

  if (!existsSync(SNAPSHOTS_DIR)) {
    mkdirSync(SNAPSHOTS_DIR, { recursive: true });
  }

  const filename = `global-${today}.json`;
  const filepath = join(SNAPSHOTS_DIR, filename);
  writeFileSync(filepath, JSON.stringify(snapshot));
  const sizeMB = (Buffer.byteLength(JSON.stringify(snapshot)) / 1024 / 1024).toFixed(1);
  console.log(`[Snapshot] Wrote ${filepath} (${sizeMB} MB)`);

  // 4. Write latest pointer
  const latestPath = join(SNAPSHOTS_DIR, 'latest.json');
  const latestData = { file: filename, date: today, generatedAt: snapshot.generatedAt };
  writeFileSync(latestPath, JSON.stringify(latestData));
  console.log(`[Snapshot] Updated ${latestPath}`);
  console.log('[Snapshot] Done!');
}

run().catch((err) => {
  console.error('[Snapshot] Fatal error:', err);
  process.exit(1);
});

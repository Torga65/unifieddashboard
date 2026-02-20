/**
 * Snapshot reader — loads the latest opportunity snapshot from disk
 * and provides it to the portfolio route for fast global queries.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SNAPSHOTS_DIR = join(__dirname, '..', 'data', 'snapshots');

let cachedSnapshot = null;
let cachedSnapshotFile = null;

/**
 * Load the latest snapshot from disk. Caches in memory so the file
 * is only read once per server process (call reload() to refresh).
 *
 * @returns {{ snapshotDate: string, siteCount: number,
 *   opportunityCount: number, opportunities: Array } | null}
 */
export function getSnapshot() {
  if (cachedSnapshot) return cachedSnapshot;
  return reload();
}

/**
 * Force-reload the snapshot from disk.
 */
export function reload() {
  const latestPath = join(SNAPSHOTS_DIR, 'latest.json');
  if (!existsSync(latestPath)) {
    console.log('[SnapshotReader] No snapshot found (no latest.json)');
    cachedSnapshot = null;
    cachedSnapshotFile = null;
    return null;
  }

  try {
    const latest = JSON.parse(readFileSync(latestPath, 'utf-8'));
    const snapshotPath = join(SNAPSHOTS_DIR, latest.file);
    if (!existsSync(snapshotPath)) {
      console.warn(`[SnapshotReader] latest.json points to ${latest.file} but file not found`);
      cachedSnapshot = null;
      return null;
    }

    // Only re-read if the file changed
    if (cachedSnapshotFile === latest.file && cachedSnapshot) {
      return cachedSnapshot;
    }

    console.log(`[SnapshotReader] Loading snapshot: ${latest.file}`);
    const data = JSON.parse(readFileSync(snapshotPath, 'utf-8'));
    cachedSnapshot = data;
    cachedSnapshotFile = latest.file;
    console.log(`[SnapshotReader] Loaded ${data.opportunityCount} opportunities from ${data.snapshotDate} (${data.siteCount} sites)`);
    return data;
  } catch (err) {
    console.error('[SnapshotReader] Failed to load snapshot:', err.message);
    cachedSnapshot = null;
    return null;
  }
}

/**
 * Get the snapshot date string (YYYY-MM-DD), or null if no snapshot.
 */
export function getSnapshotDate() {
  const snap = getSnapshot();
  return snap?.snapshotDate || null;
}

/**
 * Check if a snapshot is available.
 */
export function hasSnapshot() {
  return getSnapshot() !== null;
}

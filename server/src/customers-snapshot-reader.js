/**
 * Customer snapshot reader — loads the ASO customer/site list from disk
 * and provides it via GET /api/customers so the dashboard dropdown is fast.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SNAPSHOTS_DIR = join(__dirname, '..', 'data', 'snapshots');
const CUSTOMERS_FILE = 'customers.json';

let cached = null;

/**
 * Get the customer snapshot (cached). Returns null if not loaded or file missing.
 *
 * @returns {{
 *   snapshotDate: string, generatedAt: string, customerCount: number,
 *   siteCount: number, customers: Array
 * } | null}
 */
export function getCustomersSnapshot() {
  if (cached) return cached;
  return reloadCustomersSnapshot();
}

/**
 * Force-reload the customer snapshot from disk.
 *
 * @returns {typeof cached}
 */
export function reloadCustomersSnapshot() {
  const filepath = join(SNAPSHOTS_DIR, CUSTOMERS_FILE);
  if (!existsSync(filepath)) {
    console.log('[CustomersSnapshot] No customer snapshot found (no customers.json)');
    cached = null;
    return null;
  }

  try {
    const data = JSON.parse(readFileSync(filepath, 'utf-8'));
    cached = {
      snapshotDate: data.snapshotDate || '',
      generatedAt: data.generatedAt || '',
      customerCount: data.customerCount ?? (data.customers?.length ?? 0),
      siteCount: data.siteCount ?? 0,
      customers: Array.isArray(data.customers) ? data.customers : [],
    };
    console.log(`[CustomersSnapshot] Loaded ${cached.customerCount} customers, ${cached.siteCount} sites (${cached.snapshotDate})`);
    return cached;
  } catch (err) {
    console.error('[CustomersSnapshot] Failed to load snapshot:', err.message);
    cached = null;
    return null;
  }
}

/**
 * Whether a customer snapshot is available.
 */
export function hasCustomersSnapshot() {
  return getCustomersSnapshot() !== null;
}

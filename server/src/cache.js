/**
 * Simple in-memory cache with TTL and max-entry guard.
 */

const DEFAULT_TTL_MS = 30 * 60 * 1000; // 30 minutes
const MAX_ENTRIES = 100;

/** @type {Map<string, {value: any, expiresAt: number}>} */
const store = new Map();

/**
 * Get a cached value. Returns `null` on miss or expiry.
 * @param {string} key
 * @returns {any|null}
 */
export function cacheGet(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

/**
 * Store a value with optional TTL.
 * @param {string} key
 * @param {any}    value
 * @param {number} [ttlMs] - Time-to-live in ms (default 30 min).
 */
export function cacheSet(key, value, ttlMs = DEFAULT_TTL_MS) {
  // Evict expired entries first
  cleanup();

  // Guard against unbounded growth — evict oldest if at capacity
  if (store.size >= MAX_ENTRIES && !store.has(key)) {
    const oldestKey = store.keys().next().value;
    store.delete(oldestKey);
  }

  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

/**
 * Remove expired entries.
 */
export function cleanup() {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.expiresAt) {
      store.delete(key);
    }
  }
}

/**
 * Clear the entire cache (useful for tests).
 */
export function cacheClear() {
  store.clear();
}

/**
 * Return current cache size (useful for tests / debugging).
 * @returns {number}
 */
export function cacheSize() {
  return store.size;
}

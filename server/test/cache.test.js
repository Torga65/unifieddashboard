import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  cacheGet, cacheSet, cacheClear, cacheSize,
} from '../src/cache.js';

describe('cache', () => {
  beforeEach(() => {
    cacheClear();
  });

  it('should return null on cache miss', () => {
    assert.equal(cacheGet('nonexistent'), null);
  });

  it('should store and retrieve a value', () => {
    cacheSet('key1', { hello: 'world' });
    assert.deepEqual(cacheGet('key1'), { hello: 'world' });
  });

  it('should return null for expired entries', async () => {
    cacheSet('short-lived', 'value', 50); // 50ms TTL
    assert.equal(cacheGet('short-lived'), 'value');

    // Wait for expiry
    await new Promise((r) => { setTimeout(r, 80); });
    assert.equal(cacheGet('short-lived'), null);
  });

  it('should evict oldest entry when at capacity', () => {
    // Set 100 entries (max)
    for (let i = 0; i < 100; i++) {
      cacheSet(`key-${i}`, i);
    }
    assert.equal(cacheSize(), 100);

    // Adding one more should evict the oldest
    cacheSet('overflow', 'new');
    assert.equal(cacheSize(), 100);
    assert.equal(cacheGet('key-0'), null); // evicted
    assert.equal(cacheGet('overflow'), 'new');
  });

  it('should clear all entries', () => {
    cacheSet('a', 1);
    cacheSet('b', 2);
    assert.equal(cacheSize(), 2);

    cacheClear();
    assert.equal(cacheSize(), 0);
    assert.equal(cacheGet('a'), null);
  });
});

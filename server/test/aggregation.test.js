import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { aggregateOpportunities } from '../src/aggregation.js';

describe('aggregateOpportunities', () => {
  const opportunities = [
    { status: 'NEW', createdAt: '2025-01-01T10:00:00Z' },
    { status: 'NEW', createdAt: '2025-01-01T14:00:00Z' },
    { status: 'IN_PROGRESS', createdAt: '2025-01-01T12:00:00Z' },
    { status: 'RESOLVED', createdAt: '2025-01-02T08:00:00Z', updatedAt: '2025-01-02T10:00:00Z' },
    { status: 'IGNORED', createdAt: '2025-01-02T09:00:00Z', updatedAt: '2025-01-02T11:00:00Z' },
    { status: 'NEW', createdAt: '2025-01-03T10:00:00Z' },
    { status: 'RESOLVED', createdAt: '2025-01-05T10:00:00Z', updatedAt: '2025-01-05T12:00:00Z' }, // outside range
    { status: 'NEW', createdAt: '2024-12-31T23:59:00Z' },       // before range
  ];

  it('should bucket opportunities by date and status within the range', () => {
    const { buckets, totalCounts } = aggregateOpportunities(opportunities, '2025-01-01', '2025-01-03');

    assert.equal(buckets.length, 3);

    // Day 1
    assert.deepEqual(buckets[0], {
      date: '2025-01-01',
      counts: { NEW: 2, IN_PROGRESS: 1 },
    });

    // Day 2
    assert.deepEqual(buckets[1], {
      date: '2025-01-02',
      counts: { RESOLVED: 1, IGNORED: 1 },
    });

    // Day 3
    assert.deepEqual(buckets[2], {
      date: '2025-01-03',
      counts: { NEW: 1 },
    });

    // Totals
    assert.deepEqual(totalCounts, {
      NEW: 3,
      IN_PROGRESS: 1,
      RESOLVED: 1,
      IGNORED: 1,
    });
  });

  it('should return empty buckets when no opportunities created in range, but count open ones as available', () => {
    const { buckets, totalCounts, summary } = aggregateOpportunities(opportunities, '2025-06-01', '2025-06-30');
    assert.equal(buckets.length, 0);
    assert.deepEqual(totalCounts, {});
    assert.equal(summary.createdInPeriod, 0);
    // 5 opps are still open (NEW or IN_PROGRESS) and created before June → available via Rule 2
    assert.equal(summary.totalAvailable, 5);
  });

  it('should skip opportunities without createdAt or status', () => {
    const badOpps = [
      { status: 'NEW' },           // no createdAt
      { createdAt: '2025-01-01' }, // no status
      {},                          // neither
      { status: 'NEW', createdAt: '2025-01-01T00:00:00Z' }, // valid
    ];

    const { buckets, totalCounts } = aggregateOpportunities(badOpps, '2025-01-01', '2025-01-31');
    assert.equal(buckets.length, 1);
    assert.equal(totalCounts.NEW, 1);
  });

  it('should sort buckets by date ascending', () => {
    const unsorted = [
      { status: 'NEW', createdAt: '2025-01-10T00:00:00Z' },
      { status: 'NEW', createdAt: '2025-01-02T00:00:00Z' },
      { status: 'NEW', createdAt: '2025-01-05T00:00:00Z' },
    ];

    const { buckets } = aggregateOpportunities(unsorted, '2025-01-01', '2025-01-31');
    assert.deepEqual(
      buckets.map((b) => b.date),
      ['2025-01-02', '2025-01-05', '2025-01-10'],
    );
  });

  it('should compute summary.totalAvailable with asoboard-main logic', () => {
    // Scenario: period is Jan 2-3
    // - opp created Jan 1, status NEW → created before period, still open → available (Rule 2)
    // - opp created Jan 1, status NEW → same as above → available (Rule 2)
    // - opp created Jan 1, status IN_PROGRESS → still open → available (Rule 2)
    // - opp created Jan 2, status RESOLVED, updated Jan 2 → created in period → available (Rule 1)
    // - opp created Jan 2, status IGNORED, updated Jan 2 → created in period → available (Rule 1)
    // - opp created Jan 3, status NEW → created in period → available (Rule 1)
    // - opp created Jan 5 → outside period
    // - opp created Dec 31, status NEW → before period, still open → available (Rule 2)
    const result = aggregateOpportunities(opportunities, '2025-01-02', '2025-01-03');
    // Rule 1 (created in period): Jan 2 RESOLVED, Jan 2 IGNORED, Jan 3 NEW = 3
    // Rule 2 (before period, open at start): Dec 31 NEW, Jan 1 NEW×2, Jan 1 IN_PROGRESS = 4
    assert.equal(result.summary.totalAvailable, 7);
    assert.equal(result.summary.createdInPeriod, 3);
  });

  it('should compute fixedInPeriod and outdatedInPeriod from updatedAt', () => {
    const result = aggregateOpportunities(opportunities, '2025-01-01', '2025-01-03');
    // RESOLVED on Jan 2 (updatedAt within range) = 1
    assert.equal(result.summary.fixedInPeriod, 1);
    // IGNORED on Jan 2 (updatedAt within range) = 1
    assert.equal(result.summary.outdatedInPeriod, 1);
  });

  it('should produce statusChangeBuckets by updatedAt', () => {
    const result = aggregateOpportunities(opportunities, '2025-01-01', '2025-01-03');
    assert.equal(result.statusChangeBuckets.length, 1);
    assert.equal(result.statusChangeBuckets[0].date, '2025-01-02');
    assert.equal(result.statusChangeBuckets[0].counts.RESOLVED, 1);
    assert.equal(result.statusChangeBuckets[0].counts.IGNORED, 1);
  });

  it('should count pre-period RESOLVED opp as available if updatedAt is after period start', () => {
    // Opp created before period, RESOLVED after period started → was open at start
    const opps = [
      { status: 'RESOLVED', createdAt: '2024-12-15T00:00:00Z', updatedAt: '2025-01-05T00:00:00Z' },
    ];
    const result = aggregateOpportunities(opps, '2025-01-01', '2025-01-31');
    assert.equal(result.summary.totalAvailable, 1);
    assert.equal(result.summary.fixedInPeriod, 1);
  });

  it('should NOT count pre-period RESOLVED opp if updatedAt is before period start', () => {
    // Opp created and resolved before period → was already closed at start
    const opps = [
      { status: 'RESOLVED', createdAt: '2024-12-01T00:00:00Z', updatedAt: '2024-12-20T00:00:00Z' },
    ];
    const result = aggregateOpportunities(opps, '2025-01-01', '2025-01-31');
    assert.equal(result.summary.totalAvailable, 0);
  });
});

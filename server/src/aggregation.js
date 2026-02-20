/**
 * Aggregation logic for portfolio opportunity metrics.
 *
 * Pure functions — no side effects, easy to unit-test.
 *
 * "Total Available Opportunity" logic adopted from asoboard-main:
 *   Rule 1: Include all opportunities created DURING the period (any status).
 *   Rule 2: Include opportunities created BEFORE period start that were
 *           still open at period start (status is open, OR status changed
 *           after period start based on updatedAt).
 */

/** Statuses considered "open" (not terminal). */
const OPEN_STATUSES = new Set(['NEW', 'IN_PROGRESS']);

/**
 * Aggregate an array of opportunities into date x status buckets,
 * plus smarter summary metrics.
 *
 * @param {Array<Object>} opportunities - Raw opportunity objects from SpaceCat.
 *   Each must have at least { status: string, createdAt: string (ISO 8601) }.
 *   Optionally: updatedAt, type.
 * @param {string} from - Inclusive start date 'YYYY-MM-DD'.
 * @param {string} to   - Inclusive end date   'YYYY-MM-DD'.
 * @returns {Object} Aggregated metrics.
 */
export function aggregateOpportunities(opportunities, from, to) {
  // ---- Buckets by createdAt (existing behavior) ----
  /** @type {Map<string, Object>} date → { [status]: count } */
  const createdDayMap = new Map();
  /** @type {Object} status → total count (for opps created in range) */
  const totalCounts = {};

  // ---- Smart summary metrics ----
  let totalAvailable = 0;
  let createdInPeriod = 0;
  let fixedInPeriod = 0;    // RESOLVED during the period
  let outdatedInPeriod = 0; // IGNORED during the period

  // ---- Status-change buckets (by updatedAt) ----
  /** @type {Map<string, Object>} date → { RESOLVED: n, IGNORED: n } */
  const statusChangeDayMap = new Map();

  for (const opp of opportunities) {
    if (!opp.createdAt || !opp.status) continue;

    const createdDate = opp.createdAt.slice(0, 10);
    const updatedDate = opp.updatedAt ? opp.updatedAt.slice(0, 10) : null;
    const { status } = opp;

    // --- Created-in-period bucket (original behavior) ---
    const isCreatedInPeriod = createdDate >= from && createdDate <= to;
    if (isCreatedInPeriod) {
      if (!createdDayMap.has(createdDate)) {
        createdDayMap.set(createdDate, {});
      }
      const dayCounts = createdDayMap.get(createdDate);
      dayCounts[status] = (dayCounts[status] || 0) + 1;
      totalCounts[status] = (totalCounts[status] || 0) + 1;
      createdInPeriod++;
    }

    // --- Total Available Opportunity (asoboard-main logic) ---
    // Rule 1: Created during the period (any status)
    if (isCreatedInPeriod) {
      totalAvailable++;
    } else if (createdDate < from) {
      // Rule 2: Created before period, but was open at period start
      const isCurrentlyOpen = OPEN_STATUSES.has(status);
      const statusChangedAfterStart = updatedDate && updatedDate >= from;
      if (isCurrentlyOpen || statusChangedAfterStart) {
        totalAvailable++;
      }
    }

    // --- Fixed in period: status = RESOLVED and updatedAt within range ---
    if (status === 'RESOLVED' && updatedDate && updatedDate >= from && updatedDate <= to) {
      fixedInPeriod++;
      // Add to status-change bucket
      if (!statusChangeDayMap.has(updatedDate)) {
        statusChangeDayMap.set(updatedDate, {});
      }
      const dc = statusChangeDayMap.get(updatedDate);
      dc.RESOLVED = (dc.RESOLVED || 0) + 1;
    }

    // --- Outdated/Ignored in period ---
    if (status === 'IGNORED' && updatedDate && updatedDate >= from && updatedDate <= to) {
      outdatedInPeriod++;
      if (!statusChangeDayMap.has(updatedDate)) {
        statusChangeDayMap.set(updatedDate, {});
      }
      const dc = statusChangeDayMap.get(updatedDate);
      dc.IGNORED = (dc.IGNORED || 0) + 1;
    }
  }

  // Sort buckets by date ascending
  const buckets = Array.from(createdDayMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, counts]) => ({ date, counts }));

  const statusChangeBuckets = Array.from(statusChangeDayMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, counts]) => ({ date, counts }));

  return {
    buckets,
    totalCounts,
    summary: {
      totalAvailable,
      createdInPeriod,
      fixedInPeriod,
      outdatedInPeriod,
    },
    statusChangeBuckets,
  };
}

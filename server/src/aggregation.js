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
/** Suggestion statuses for "moved to" counts. */
const SUG_FIXED = 'FIXED';
const SUG_SKIPPED = 'SKIPPED';
const SUG_REJECTED = 'REJECTED';
const SUG_PENDING_VALIDATION = 'PENDING_VALIDATION';
const SUG_NEW = 'NEW';
const SUG_APPROVED = 'APPROVED';
const SUG_IN_PROGRESS = 'IN_PROGRESS';
const SUG_OUTDATED = 'OUTDATED';
const SUG_ERROR = 'ERROR';
const AWAITING_CUSTOMER_REVIEW = new Set([SUG_NEW, SUG_APPROVED, SUG_IN_PROGRESS]);

export function aggregateOpportunities(opportunities, from, to) {
  // ---- Buckets by createdAt (existing behavior) ----
  /** @type {Map<string, Object>} date → { [status]: count } */
  const createdDayMap = new Map();
  /** @type {Object} status → total count (for opps created in range) */
  const totalCounts = {};

  // ---- Smart summary metrics ----
  let totalAvailable = 0;
  let createdInPeriod = 0;
  let fixedInPeriod = 0; // RESOLVED during the period
  let outdatedInPeriod = 0; // IGNORED during the period

  // ---- Status-change buckets (by updatedAt) ----
  /** @type {Map<string, Object>} date → { RESOLVED: n, IGNORED: n } */
  const statusChangeDayMap = new Map();

  /** Indices of opportunities that are "in scope" for the date range (for suggestion sums). */
  const inScopeIndices = new Set();

  for (let i = 0; i < opportunities.length; i++) {
    const opp = opportunities[i];
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
      inScopeIndices.add(i);
    } else if (createdDate < from) {
      // Rule 2: Created before period, but was open at period start
      const isCurrentlyOpen = OPEN_STATUSES.has(status);
      const statusChangedAfterStart = updatedDate && updatedDate >= from;
      if (isCurrentlyOpen || statusChangedAfterStart) {
        totalAvailable++;
        inScopeIndices.add(i);
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

  // Sum suggestion-level counts only for in-scope opportunities (from snapshot)
  let skippedByCustomer = 0;
  let rejectedByEse = 0;
  let pendingValidation = 0;
  let awaitingCustomerReview = 0;
  let suggestionsFixed = 0;
  let totalSuggestions = 0;
  let outdatedSuggestions = 0;
  let movedToFixed = 0;
  let movedToAwaitingCustomerReview = 0;
  let movedToAwaitingEseReview = 0;
  let movedToSkipped = 0;
  let movedToRejected = 0;
  let movedToOutdated = 0;
  let movedToError = 0;

  /** @type {Object<string, { totalSuggestions, suggestionsFixed, skippedByCustomer, customerEngagement, movedToFixed, movedToSkipped, movedToCustomerEngagement }>} */
  const byType = {};

  function ensureByType(typeKey) {
    if (!byType[typeKey]) {
      byType[typeKey] = {
        totalSuggestions: 0,
        suggestionsFixed: 0,
        skippedByCustomer: 0,
        customerEngagement: 0,
        movedToFixed: 0,
        movedToSkipped: 0,
        movedToCustomerEngagement: 0,
      };
    }
    return byType[typeKey];
  }

  for (let i = 0; i < opportunities.length; i++) {
    if (!inScopeIndices.has(i)) continue;
    const opp = opportunities[i];
    const typeKey = (opp.type || 'Unknown').trim() || 'Unknown';
    const bt = ensureByType(typeKey);

    const sc = opp.suggestionCounts;
    if (sc) {
      const sk = sc.skippedCount ?? 0;
      const fx = sc.fixedCount ?? 0;
      const tot = sc.totalCount ?? 0;
      skippedByCustomer += sk;
      rejectedByEse += sc.rejectedRawCount ?? 0;
      pendingValidation += sc.pendingValidationCount ?? 0;
      awaitingCustomerReview += (sc.newCount ?? 0) + (sc.approvedCount ?? 0)
        + (sc.inProgressCount ?? 0);
      suggestionsFixed += fx;
      totalSuggestions += tot;
      outdatedSuggestions += sc.outdatedCount ?? 0;
      bt.totalSuggestions += tot;
      bt.suggestionsFixed += fx;
      bt.skippedByCustomer += sk;
      bt.customerEngagement += sk + fx;
    }

    // "Moved to" counts: updatedAt in [from, to], else createdAt when missing
    const states = opp.suggestionStates;
    if (Array.isArray(states)) {
      for (const { s: sugStatus, u: upd, c: created } of states) {
        const dateInRange = (upd && upd >= from && upd <= to)
          ? true
          : (!upd && created && created >= from && created <= to);
        if (!dateInRange) continue;
        switch (sugStatus) {
          case SUG_FIXED: movedToFixed++; bt.movedToFixed++; break;
          case SUG_SKIPPED: movedToSkipped++; bt.movedToSkipped++; break;
          case SUG_REJECTED: movedToRejected++; break;
          case SUG_PENDING_VALIDATION: movedToAwaitingEseReview++; break;
          case SUG_OUTDATED: movedToOutdated++; break;
          case SUG_ERROR: movedToError++; break;
          default:
            if (AWAITING_CUSTOMER_REVIEW.has(sugStatus)) movedToAwaitingCustomerReview++;
            break;
        }
      }
      bt.movedToCustomerEngagement = bt.movedToFixed + bt.movedToSkipped;
    }
  }

  const movedToCustomerEngagement = movedToSkipped + movedToFixed;
  const customerEngagement = skippedByCustomer + suggestionsFixed;

  // Suggestions with status change in period — denominator so "moved to" % add up to 100%
  const totalCreatedOrUpdatedInPeriod = movedToFixed + movedToAwaitingCustomerReview
    + movedToAwaitingEseReview + movedToSkipped + movedToRejected + movedToOutdated + movedToError;

  // Top lists by suggestion type (for portfolio "which type has most engagement / deployments / passed")
  const typeEntries = Object.entries(byType);
  const topByEngagement = typeEntries
    .map(([type, m]) => ({ type, value: m.movedToCustomerEngagement > 0 ? m.movedToCustomerEngagement : m.customerEngagement }))
    .filter((e) => e.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 15);
  const topByDeployed = typeEntries
    .map(([type, m]) => ({ type, value: m.movedToFixed > 0 ? m.movedToFixed : m.suggestionsFixed }))
    .filter((e) => e.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 15);
  const topByPassed = topByDeployed; // "suggestions passed" = deployed/fixed

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
      skippedByCustomer,
      rejectedByEse,
      pendingValidation,
      awaitingCustomerReview,
      suggestionsFixed,
      totalSuggestions,
      outdatedSuggestions,
      customerEngagement,
      movedToFixed,
      movedToAwaitingCustomerReview,
      movedToAwaitingEseReview,
      movedToSkipped,
      movedToRejected,
      movedToOutdated,
      movedToError,
      movedToCustomerEngagement,
      totalCreatedOrUpdatedInPeriod,
      byType,
      topByEngagement,
      topByDeployed,
      topByPassed,
    },
    statusChangeBuckets,
  };
}

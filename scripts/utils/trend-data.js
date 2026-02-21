/**
 * Trend Data Utilities
 *
 * Groups opportunities / suggestions into time-series buckets
 * for use with Chart.js line/bar charts.
 */

/**
 * Group items by time bucket.
 *
 * @param {Array} items — objects with a date field (ISO string)
 * @param {string} dateField — property name to read the date from
 * @param {'day'|'week'} bucketSize
 * @returns {Map<string, Array>} key = ISO date string (bucket start), value = items
 */
export function groupByTimeBucket(items, dateField = 'createdAt', bucketSize = 'day') {
  const buckets = new Map();

  items.forEach((item) => {
    const raw = item[dateField];
    if (!raw) return;
    const d = new Date(raw);
    let key;
    if (bucketSize === 'week') {
      // ISO week start (Monday)
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(d);
      monday.setDate(diff);
      key = monday.toISOString().slice(0, 10);
    } else {
      key = d.toISOString().slice(0, 10);
    }
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(item);
  });

  return buckets;
}

/**
 * Build a time-series dataset for a specific metric.
 *
 * @param {Array} opportunities — enriched opportunities with suggestions
 * @param {'created'|'fixed'|'rejected'|'error'|'skipped'|'outdated'} metric
 * @param {{ start: Date|null, end: Date|null }} dateRange
 * @param {'day'|'week'} bucket
 * @returns {Array<{date: string, value: number}>} sorted by date
 */
export function buildTrendSeries(opportunities, metric, dateRange = {}, bucket = 'day') {
  // Flatten suggestions from all opportunities
  const allSuggestions = [];
  opportunities.forEach((opp) => {
    (opp.suggestions || []).forEach((sug) => {
      allSuggestions.push({ ...sug, opportunityType: opp.type });
    });
  });

  // Choose which date field and filter to use
  let items;
  let dateField;
  switch (metric) {
    case 'created':
      items = allSuggestions;
      dateField = 'createdAt';
      break;
    case 'fixed':
      items = allSuggestions.filter((s) => s.status === 'FIXED');
      dateField = 'updatedAt'; // when they were fixed
      break;
    case 'rejected':
      items = allSuggestions.filter((s) => s.status === 'REJECTED');
      dateField = 'updatedAt';
      break;
    case 'error':
      items = allSuggestions.filter((s) => s.status === 'ERROR');
      dateField = 'updatedAt';
      break;
    case 'skipped':
      items = allSuggestions.filter((s) => s.status === 'SKIPPED');
      dateField = 'updatedAt';
      break;
    case 'outdated':
      items = allSuggestions.filter((s) => s.status === 'OUTDATED');
      dateField = 'updatedAt';
      break;
    default:
      items = allSuggestions;
      dateField = 'createdAt';
  }

  // Apply date range filter
  if (dateRange.start || dateRange.end) {
    items = items.filter((item) => {
      const d = new Date(item[dateField] || item.createdAt);
      if (dateRange.start && d < dateRange.start) return false;
      if (dateRange.end && d > dateRange.end) return false;
      return true;
    });
  }

  // Group into buckets
  const buckets = groupByTimeBucket(items, dateField, bucket);

  // Fill in missing days/weeks
  const series = [];
  const sortedKeys = [...buckets.keys()].sort();
  if (sortedKeys.length > 0) {
    let startDate = dateRange.start ? new Date(dateRange.start) : new Date(sortedKeys[0]);
    const lastKey = sortedKeys[sortedKeys.length - 1];
    const endDate = dateRange.end ? new Date(dateRange.end) : new Date(lastKey);
    const stepMs = bucket === 'week' ? 7 * 86400000 : 86400000;

    // For weekly buckets, align start to Monday so keys match groupByTimeBucket
    if (bucket === 'week') {
      const day = startDate.getDay();
      const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
      startDate = new Date(startDate);
      startDate.setDate(diff);
    }

    for (let d = new Date(startDate); d <= endDate; d = new Date(d.getTime() + stepMs)) {
      const key = d.toISOString().slice(0, 10);
      series.push({ date: key, value: (buckets.get(key) || []).length });
    }
  }

  return series;
}

/**
 * Build a per-type breakdown trend.
 *
 * @param {Array} opportunities
 * @param {string} metric
 * @param {Object} dateRange
 * @param {string} bucket
 * @returns {Object<string, Array<{date, value}>>} keyed by opportunity type
 */
export function buildTrendByType(opportunities, metric, dateRange = {}, bucket = 'day') {
  const typeGroups = {};
  opportunities.forEach((opp) => {
    const type = opp.type || 'Unknown';
    if (!typeGroups[type]) typeGroups[type] = [];
    typeGroups[type].push(opp);
  });

  const result = {};
  Object.entries(typeGroups).forEach(([type, opps]) => {
    result[type] = buildTrendSeries(opps, metric, dateRange, bucket);
  });
  return result;
}

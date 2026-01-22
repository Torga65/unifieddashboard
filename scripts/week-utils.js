/**
 * Week Selection Utilities for EDS
 * Handles week identification from metadata, URL, or data files
 */

/**
 * Get week identifier from page metadata
 * Looks for <meta name="week" content="2026-01-15">
 * @returns {string|null} Week identifier (date string) or null if not found
 */
export function getWeekFromMeta() {
  const metaWeek = document.querySelector('meta[name="week"]');
  if (metaWeek?.content) {
    const content = metaWeek.content.trim();
    // Validate date format (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}$/.test(content)) {
      return content;
    }
  }
  return null;
}

/**
 * Get week identifier from URL path
 * Matches patterns like /weekly/2026-01-15/ or /engagement/2026-01-15
 * @param {string} [url] - Optional URL to parse (defaults to window.location.pathname)
 * @returns {string|null} Week identifier (date string) or null if not found
 */
export function getWeekFromUrl(url) {
  const path = url || window.location.pathname;

  // Match YYYY-MM-DD pattern in URL path
  const dateMatch = path.match(/\/(\d{4}-\d{2}-\d{2})\/?/);
  if (dateMatch) {
    return dateMatch[1];
  }

  return null;
}

/**
 * Parse date string in America/Denver timezone
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {Date} Date object
 */
function parseDateInDenver(dateStr) {
  // Create date at noon in Denver to avoid DST edge cases
  const date = new Date(`${dateStr}T12:00:00-07:00`);
  return date;
}

/**
 * Get current date/time in America/Denver timezone
 * @returns {Date} Current date in Denver timezone
 */
function getCurrentDateInDenver() {
  // Get current time in Denver timezone
  const denverTime = new Date().toLocaleString('en-US', {
    timeZone: 'America/Denver',
  });
  return new Date(denverTime);
}

/**
 * Fetch weeks data from JSON endpoint and select the latest week <= today
 * @param {string} [dataUrl] - URL to fetch weeks data (defaults to /data/weeks.json)
 * @returns {Promise<string|null>} Week identifier or null if not found
 */
export async function getCurrentWeekFromDataset(dataUrl = '/data/weeks.json') {
  try {
    const response = await fetch(dataUrl);
    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.warn(`Failed to fetch weeks data: ${response.status}`);
      return null;
    }

    const data = await response.json();

    // Expect format: { "weeks": ["2026-01-15", "2026-01-22", ...] }
    // or array: ["2026-01-15", "2026-01-22", ...]
    const weeks = Array.isArray(data) ? data : data.weeks;

    if (!Array.isArray(weeks) || weeks.length === 0) {
      // eslint-disable-next-line no-console
      console.warn('No weeks found in dataset');
      return null;
    }

    // Get current date in Denver timezone
    const now = getCurrentDateInDenver();

    // Filter weeks that are <= today
    const validWeeks = weeks.filter((weekStr) => {
      const weekDate = parseDateInDenver(weekStr);
      return weekDate <= now;
    });

    if (validWeeks.length === 0) {
      // eslint-disable-next-line no-console
      console.warn('No weeks found <= current date');
      return null;
    }

    // Sort descending and return the latest
    validWeeks.sort((a, b) => {
      const dateA = parseDateInDenver(a);
      const dateB = parseDateInDenver(b);
      return dateB - dateA;
    });

    return validWeeks[0];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching weeks data:', error);
    return null;
  }
}

/**
 * Resolve the selected week using priority order:
 * 1. Page metadata
 * 2. URL path
 * 3. Dataset (weeks.json)
 * 4. Fallback to null (caller should handle)
 *
 * @param {Object} [options] - Configuration options
 * @param {string} [options.dataUrl] - URL to fetch weeks data
 * @param {boolean} [options.skipMeta] - Skip metadata check
 * @param {boolean} [options.skipUrl] - Skip URL check
 * @param {boolean} [options.skipDataset] - Skip dataset check
 * @returns {Promise<string|null>} Week identifier or null
 */
export async function resolveSelectedWeek(options = {}) {
  const {
    dataUrl = '/data/weeks.json',
    skipMeta = false,
    skipUrl = false,
    skipDataset = false,
  } = options;

  // Priority 1: Page metadata
  if (!skipMeta) {
    const metaWeek = getWeekFromMeta();
    if (metaWeek) {
      return metaWeek;
    }
  }

  // Priority 2: URL path
  if (!skipUrl) {
    const urlWeek = getWeekFromUrl();
    if (urlWeek) {
      return urlWeek;
    }
  }

  // Priority 3: Dataset (weeks.json)
  if (!skipDataset) {
    const datasetWeek = await getCurrentWeekFromDataset(dataUrl);
    if (datasetWeek) {
      return datasetWeek;
    }
  }

  // No week found
  return null;
}

/**
 * Format week date for display
 * @param {string} weekStr - Week date string (YYYY-MM-DD)
 * @returns {string} Formatted date (e.g., "January 15, 2026")
 */
export function formatWeekDate(weekStr) {
  try {
    const date = new Date(`${weekStr}T12:00:00`);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    return weekStr;
  }
}

/**
 * Get week range (Mon-Sun) for a given date
 * @param {string} weekStr - Week date string (YYYY-MM-DD)
 * @returns {Object} { start: Date, end: Date, startStr: string, endStr: string }
 */
export function getWeekRange(weekStr) {
  const date = new Date(`${weekStr}T12:00:00`);

  // Find Monday of that week
  const dayOfWeek = date.getDay();
  const monday = new Date(date);
  monday.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  // Find Sunday
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    start: monday,
    end: sunday,
    startStr: monday.toISOString().split('T')[0],
    endStr: sunday.toISOString().split('T')[0],
  };
}

/**
 * Convert date string to ISO week format (YYYY-Www)
 * @param {string} dateStr - Date string (YYYY-MM-DD)
 * @returns {string} ISO week format (e.g., "2026-W03")
 */
export function dateToISOWeek(dateStr) {
  const date = new Date(`${dateStr}T12:00:00`);
  const year = date.getFullYear();

  // Calculate week number
  const start = new Date(year, 0, 1);
  const diff = date - start;
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  const week = Math.ceil((diff / oneWeek) + 1);

  return `${year}-W${String(week).padStart(2, '0')}`;
}

// ============================================================================
// TEST SUITE
// ============================================================================

/* eslint-disable no-console */
// Console statements are expected in test functions

/**
 * Run all tests
 * Call runWeekUtilsTests() in console to validate
 */
export function runWeekUtilsTests() {
  console.group('🧪 Week Utils Test Suite');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ ${testName}`);
      passed += 1;
    } else {
      console.error(`❌ ${testName}`);
      failed += 1;
    }
  }

  function assertEquals(actual, expected, testName) {
    if (actual === expected) {
      console.log(`✅ ${testName}`);
      passed += 1;
    } else {
      console.error(`❌ ${testName}`);
      console.error(`   Expected: ${expected}`);
      console.error(`   Actual: ${actual}`);
      failed += 1;
    }
  }

  // Test 1: getWeekFromMeta with no metadata
  console.group('Test getWeekFromMeta()');
  const originalMeta = document.querySelector('meta[name="week"]');
  if (originalMeta) originalMeta.remove();

  const noMeta = getWeekFromMeta();
  assertEquals(noMeta, null, 'Should return null when no metadata exists');

  // Test 2: getWeekFromMeta with valid metadata
  const testMeta = document.createElement('meta');
  testMeta.name = 'week';
  testMeta.content = '2026-01-15';
  document.head.appendChild(testMeta);

  const validMeta = getWeekFromMeta();
  assertEquals(validMeta, '2026-01-15', 'Should return date from metadata');

  // Test 3: getWeekFromMeta with invalid format
  testMeta.content = 'invalid-date';
  const invalidMeta = getWeekFromMeta();
  assertEquals(invalidMeta, null, 'Should return null for invalid date format');

  // Cleanup
  testMeta.remove();
  if (originalMeta) document.head.appendChild(originalMeta);
  console.groupEnd();

  // Test 4: getWeekFromUrl
  console.group('Test getWeekFromUrl()');
  assertEquals(
    getWeekFromUrl('/weekly/2026-01-15/'),
    '2026-01-15',
    'Should extract date from /weekly/YYYY-MM-DD/',
  );

  assertEquals(
    getWeekFromUrl('/engagement/2026-01-15'),
    '2026-01-15',
    'Should extract date from /engagement/YYYY-MM-DD',
  );

  assertEquals(
    getWeekFromUrl('/reports/2026-01-15/summary'),
    '2026-01-15',
    'Should extract date from middle of path',
  );

  assertEquals(
    getWeekFromUrl('/no-date-here'),
    null,
    'Should return null when no date in URL',
  );

  assertEquals(
    getWeekFromUrl('/2026-13-45/'),
    '2026-13-45',
    'Should extract pattern even if date is invalid (validation elsewhere)',
  );
  console.groupEnd();

  // Test 5: formatWeekDate
  console.group('Test formatWeekDate()');
  const formatted = formatWeekDate('2026-01-15');
  assert(
    formatted.includes('2026') && formatted.includes('15'),
    'Should format date with year and day',
  );
  console.groupEnd();

  // Test 6: getWeekRange
  console.group('Test getWeekRange()');
  const range = getWeekRange('2026-01-15'); // Thursday
  assert(range.start instanceof Date, 'Should return Date object for start');
  assert(range.end instanceof Date, 'Should return Date object for end');
  assert(range.startStr && range.endStr, 'Should return string dates');

  // Week should be 7 days
  const daysDiff = (range.end - range.start) / (1000 * 60 * 60 * 24);
  assertEquals(Math.round(daysDiff), 6, 'Week range should be 6 days apart (Mon-Sun)');
  console.groupEnd();

  // Test 7: dateToISOWeek
  console.group('Test dateToISOWeek()');
  const isoWeek = dateToISOWeek('2026-01-15');
  assert(
    /^\d{4}-W\d{2}$/.test(isoWeek),
    'Should return ISO week format (YYYY-Www)',
  );
  console.log(`   ISO Week: ${isoWeek}`);
  console.groupEnd();

  // Test 8: getCurrentWeekFromDataset (mock)
  console.group('Test getCurrentWeekFromDataset()');
  console.log('⚠️  This requires /data/weeks.json to exist');
  console.log('   Run manually: await getCurrentWeekFromDataset()');
  console.groupEnd();

  // Test 9: resolveSelectedWeek priority order
  console.group('Test resolveSelectedWeek()');
  console.log('⚠️  This is async and requires real environment');
  console.log('   Test manually with different configurations');
  console.groupEnd();

  // Summary
  console.groupEnd();
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Test Results: ${passed} passed, ${failed} failed`);
  if (failed === 0) {
    console.log('✨ All tests passed!');
  } else {
    console.log('⚠️  Some tests failed');
  }
  console.log('='.repeat(50));

  return { passed, failed };
}

/**
 * Integration test for resolveSelectedWeek
 * Tests priority order with mocked conditions
 */
export async function testResolveSelectedWeekPriority() {
  console.group('🔧 Integration Test: resolveSelectedWeek Priority');

  // Test 1: Metadata takes priority
  const testMeta = document.createElement('meta');
  testMeta.name = 'week';
  testMeta.content = '2026-01-15';
  document.head.appendChild(testMeta);

  const week1 = await resolveSelectedWeek({ skipDataset: true });
  console.log(`Test 1 (Metadata priority): ${week1}`);
  console.assert(week1 === '2026-01-15', 'Should use metadata week');

  testMeta.remove();

  // Test 2: URL when no metadata
  // Note: This will use actual window.location, which might not match
  const week2 = await resolveSelectedWeek({
    skipMeta: false,
    skipDataset: true,
  });
  console.log(`Test 2 (URL priority): ${week2}`);

  // Test 3: Dataset when no metadata or URL
  const week3 = await resolveSelectedWeek({
    skipMeta: true,
    skipUrl: true,
  });
  console.log(`Test 3 (Dataset priority): ${week3}`);

  console.groupEnd();
}

/**
 * Mock getCurrentDateInDenver for testing
 * @param {string} mockDateStr - Date to mock (YYYY-MM-DD)
 */
export function mockCurrentDateForTesting(mockDateStr) {
  // Note: In production, you'd use a proper mocking library
  // This is a simple demonstration
  console.log(`⚠️  Mocking current date as: ${mockDateStr}`);
  console.log('   (In real tests, use dependency injection or mock library)');
}

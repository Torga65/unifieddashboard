/**
 * Data Loader Utilities
 * Fetch customer data from spreadsheets or JSON files
 */

/**
 * Fetch customer data from a data source
 * Supports both local JSON and EDS-converted Excel files
 *
 * @param {string} dataUrl - URL to fetch data from
 * @returns {Promise<Array>} Array of customer records
 */
export async function fetchCustomerData(dataUrl = '/data/customers.json') {
  try {
    const response = await fetch(dataUrl);
    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.warn(`Failed to fetch customer data: ${response.status}`);
      return [];
    }

    const data = await response.json();

    // Handle different data formats
    // Format 1: { "data": [...] } (EDS spreadsheet format)
    if (data.data && Array.isArray(data.data)) {
      return data.data;
    }

    // Format 2: Direct array
    if (Array.isArray(data)) {
      return data;
    }

    // Format 3: { "customers": [...] }
    if (data.customers && Array.isArray(data.customers)) {
      return data.customers;
    }

    // eslint-disable-next-line no-console
    console.warn('Unexpected data format', data);
    return [];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching customer data:', error);
    return [];
  }
}

/**
 * Parse customer record from spreadsheet format
 * Maps common column names to standardized format
 *
 * @param {Object} row - Raw row from spreadsheet
 * @returns {Object} Standardized customer object
 */
export function parseCustomerRow(row) {
  return {
    // Week/Date
    week: row.week || row.Week || row.date || row.Date || null,

    // Company identification
    companyName: row.companyName
      || row['Company Name']
      || row.company
      || row.Company
      || row.customer
      || row.Customer
      || '',

    // Status
    status: row.status
      || row.Status
      || row['Account Status']
      || row.accountStatus
      || 'Active',

    // Engagement level
    engagement: row.engagement
      || row.Engagement
      || row['Engagement Level']
      || row.engagementLevel
      || 'Medium',

    // Health score
    healthScore: parseInt(
      row.healthScore
      || row['Health Score']
      || row.health
      || row.Health
      || row.score
      || row.Score
      || 0,
      10,
    ),

    // Summary
    summary: row.summary
      || row.Summary
      || row['Summary of Engagement']
      || row.summaryOfEngagement
      || row.notes
      || row.Notes
      || '',

    // Blockers
    blockers: row.blockers
      || row.Blockers
      || row.issues
      || row.Issues
      || row.challenges
      || row.Challenges
      || 'None',

    // Feedback
    feedback: row.feedback
      || row.Feedback
      || row['Customer Feedback']
      || row.customerFeedback
      || row.sentiment
      || row.Sentiment
      || '',

    // Last updated
    lastUpdated: row.lastUpdated
      || row['Last Updated']
      || row.updated
      || row.Updated
      || row.date
      || row.Date
      || new Date().toISOString().split('T')[0],
  };
}

/**
 * Fetch and parse customer data
 * Combines fetching and parsing into one call
 *
 * @param {string} dataUrl - URL to fetch data from
 * @returns {Promise<Array>} Array of parsed customer records
 */
export async function loadCustomerData(dataUrl = '/data/customers.json') {
  const rawData = await fetchCustomerData(dataUrl);
  return rawData.map((row) => parseCustomerRow(row));
}

/**
 * Example: Load data from SharePoint (via EDS)
 * SharePoint Excel files are automatically converted to JSON by EDS
 *
 * @param {string} spreadsheetPath - Path to Excel file in repo
 * @returns {Promise<Array>} Array of customer records
 */
export async function loadFromSharePoint(spreadsheetPath) {
  // EDS converts Excel to JSON automatically
  // Example: /customer-data.xlsx becomes /customer-data.json
  const jsonPath = spreadsheetPath.replace(/\.xlsx?$/i, '.json');
  return loadCustomerData(jsonPath);
}

/**
 * Customer Data Manager
 * Handles loading and merging customer data with local edits from localStorage
 */

const STORAGE_KEY = 'customerDataEdits';

/**
 * Load edited customer data from localStorage
 * @returns {Object} Object with company names as keys and edited fields as values
 */
export function loadEditedData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const edits = JSON.parse(stored);
      console.log(`[CustomerDataManager] Loaded ${Object.keys(edits).length} edited records`);
      return edits;
    }
  } catch (error) {
    console.error('[CustomerDataManager] Error loading edits:', error);
  }
  return {};
}

/**
 * Save edited customer data to localStorage
 * @param {Object} editedData - Object with company names as keys and edited fields as values
 */
export function saveEditedData(editedData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(editedData));
    console.log(`[CustomerDataManager] Saved ${Object.keys(editedData).length} edited records`);
    return true;
  } catch (error) {
    console.error('[CustomerDataManager] Error saving edits:', error);
    return false;
  }
}

/**
 * Merge edited data with original customer data
 * @param {Array} customers - Array of customer objects
 * @returns {Array} Array of customer objects with edits applied
 */
export function mergeEditedData(customers) {
  const editedData = loadEditedData();

  if (Object.keys(editedData).length === 0) {
    return customers;
  }

  return customers.map((customer) => {
    const edits = editedData[customer.companyName];
    if (edits) {
      return {
        ...customer,
        ...edits,
        _edited: true,
        _editedFields: Object.keys(edits),
      };
    }
    return customer;
  });
}

/**
 * Fetch customer data with edits applied
 * @param {string} dataUrl - URL to customer data JSON (default: /data/customers.json)
 * @param {string} week - Optional week filter (e.g., '2026-01-23')
 * @returns {Promise<Array>} Array of customer objects with edits
 */
export async function fetchCustomerData(dataUrl = '/data/customers.json', week = null) {
  try {
    const response = await fetch(dataUrl);
    const data = await response.json();
    let customers = data.data || data;

    // Filter by week if specified
    if (week) {
      customers = customers.filter((c) => c.week === week);
    }

    // Merge with edited data
    customers = mergeEditedData(customers);

    console.log(`[CustomerDataManager] Loaded ${customers.length} customers${week ? ` for week ${week}` : ''}`);

    return customers;
  } catch (error) {
    console.error('[CustomerDataManager] Error fetching customer data:', error);
    throw error;
  }
}

/**
 * Get a single customer with edits applied
 * @param {string} companyName - Name of the company
 * @param {string} dataUrl - URL to customer data JSON
 * @returns {Promise<Object|null>} Customer object or null if not found
 */
export async function getCustomer(companyName, dataUrl = '/data/customers.json') {
  const customers = await fetchCustomerData(dataUrl);
  return customers.find((c) => c.companyName === companyName) || null;
}

/**
 * Check if a customer has been edited
 * @param {string} companyName - Name of the company
 * @returns {boolean} True if customer has edits
 */
export function isCustomerEdited(companyName) {
  const editedData = loadEditedData();
  return !!editedData[companyName];
}

/**
 * Get edited fields for a customer
 * @param {string} companyName - Name of the company
 * @returns {Object|null} Object with edited fields or null
 */
export function getCustomerEdits(companyName) {
  const editedData = loadEditedData();
  return editedData[companyName] || null;
}

/**
 * Reset all edits (clear localStorage)
 * @returns {boolean} True if successful
 */
export function resetAllEdits() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('[CustomerDataManager] All edits cleared');
    return true;
  } catch (error) {
    console.error('[CustomerDataManager] Error clearing edits:', error);
    return false;
  }
}

/**
 * Get statistics about edited data
 * @returns {Object} Stats object with counts
 */
export function getEditStats() {
  const editedData = loadEditedData();
  const customerCount = Object.keys(editedData).length;
  let totalFields = 0;

  Object.values(editedData).forEach((edits) => {
    totalFields += Object.keys(edits).length;
  });

  return {
    editedCustomers: customerCount,
    totalFieldsEdited: totalFields,
    averageFieldsPerCustomer: customerCount > 0 ? (totalFields / customerCount).toFixed(1) : 0,
  };
}

// Export default object with all functions
export default {
  loadEditedData,
  saveEditedData,
  mergeEditedData,
  fetchCustomerData,
  getCustomer,
  isCustomerEdited,
  getCustomerEdits,
  resetAllEdits,
  getEditStats,
};

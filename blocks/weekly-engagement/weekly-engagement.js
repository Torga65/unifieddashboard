/**
 * Weekly Engagement Block
 * Displays customer engagement data in an interactive table
 *
 * Expected structure from authoring (table format):
 * Week | Company | Status | Engagement | Health | Summary |
 * Blockers | Feedback | Last Updated
 *
 * Week identification priority:
 * 1. Page metadata (week: 2026-01-15)
 * 2. URL path (/weekly/2026-01-15/)
 * 3. Data file (latest from /data/weeks.json <= today in America/Denver)
 * 4. Week column in table
 */

import { resolveSelectedWeek, formatWeekDate } from '../../scripts/week-utils.js';

/**
 * Get week identifier (async)
 * Uses the new week-utils module
 */
async function getWeekIdentifier() {
  // Try to resolve week using utilities
  const week = await resolveSelectedWeek();

  if (week) {
    return week;
  }

  // Fallback: look for date pattern in URL (backward compatibility)
  const pathMatch = window.location.pathname.match(/(\d{4}-\d{2}-\d{2})/);
  if (pathMatch) {
    return pathMatch[1];
  }

  // No week found
  return null;
}

/**
 * Parse table data into structured objects
 */
function parseTableData(rows) {
  if (rows.length === 0) return [];

  const data = [];

  rows.forEach((row) => {
    const cells = [...row.children];

    // Determine if we have a Week column (8+ columns vs 7 columns)
    const hasWeekColumn = cells.length >= 8;

    let weekValue;
    let companyName;
    let status;
    let engagement;
    let healthScore;
    let summary;
    let blockers;
    let feedback;
    let lastUpdated;

    if (hasWeekColumn) {
      [weekValue, companyName, status, engagement, healthScore,
        summary, blockers, feedback, lastUpdated] = cells.map((cell) => cell.textContent.trim());
    } else {
      // No Week column - will use default week
      [companyName, status, engagement, healthScore,
        summary, blockers, feedback, lastUpdated] = cells.map((cell) => cell.textContent.trim());
      weekValue = null;
    }

    if (companyName) {
      data.push({
        week: weekValue,
        companyName,
        status,
        engagement,
        healthScore: parseInt(healthScore, 10) || 0,
        summary,
        blockers,
        feedback,
        lastUpdated,
      });
    }
  });

  return data;
}

/**
 * Filter data by week
 */
function filterByWeek(data, targetWeek) {
  return data.filter((item) => {
    // If item has no week, include it (will be shown for any week)
    if (!item.week) return true;
    // Otherwise match the target week
    return item.week === targetWeek;
  });
}

/**
 * Create filter controls
 */
function createFilters() {
  const filterBar = document.createElement('div');
  filterBar.className = 'weekly-engagement-filters';

  // Search
  const searchWrapper = document.createElement('div');
  searchWrapper.className = 'filter-search';
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search companies, summaries, blockers...';
  searchInput.className = 'search-input';
  searchWrapper.appendChild(searchInput);

  // Status filter
  const statusFilter = document.createElement('select');
  statusFilter.className = 'filter-select';
  statusFilter.innerHTML = `
    <option value="">All Statuses</option>
    <option value="Active">Active</option>
    <option value="At Risk">At Risk</option>
    <option value="Onboarding">Onboarding</option>
    <option value="Churned">Churned</option>
  `;

  // Engagement filter
  const engagementFilter = document.createElement('select');
  engagementFilter.className = 'filter-select';
  engagementFilter.innerHTML = `
    <option value="">All Engagement</option>
    <option value="High">High</option>
    <option value="Medium">Medium</option>
    <option value="Low">Low</option>
    <option value="None">None</option>
  `;

  // Health filter
  const healthFilter = document.createElement('select');
  healthFilter.className = 'filter-select';
  healthFilter.innerHTML = `
    <option value="">All Health Scores</option>
    <option value="critical">Critical (&lt;50)</option>
    <option value="attention">Needs Attention (50-75)</option>
    <option value="healthy">Healthy (&gt;75)</option>
  `;

  filterBar.appendChild(searchWrapper);
  filterBar.appendChild(statusFilter);
  filterBar.appendChild(engagementFilter);
  filterBar.appendChild(healthFilter);

  return {
    filterBar, searchInput, statusFilter, engagementFilter, healthFilter,
  };
}

/**
 * Create table header
 */
function createTableHeader() {
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Company</th>
      <th>Status</th>
      <th>Engagement</th>
      <th class="health-col">Health</th>
      <th>Summary</th>
      <th class="blockers-col">Blockers</th>
      <th class="feedback-col">Feedback</th>
      <th class="date-col">Updated</th>
    </tr>
  `;
  return thead;
}

/**
 * Create table row
 */
function createTableRow(item) {
  const tr = document.createElement('tr');
  tr.className = 'engagement-row';
  tr.dataset.company = item.companyName;

  // Status badge class
  const statusClass = item.status.toLowerCase().replace(/\s+/g, '-');

  // Engagement badge class
  const engagementClass = item.engagement.toLowerCase();

  // Health score color
  let healthClass = 'healthy';
  if (item.healthScore < 50) healthClass = 'critical';
  else if (item.healthScore < 75) healthClass = 'attention';

  tr.innerHTML = `
    <td class="company-cell"><strong>${item.companyName}</strong></td>
    <td><span class="status-badge ${statusClass}">${item.status}</span></td>
    <td><span class="engagement-badge ${engagementClass}">${item.engagement}</span></td>
    <td class="health-col">
      <div class="health-score ${healthClass}">
        <span class="score-value">${item.healthScore}</span>
        <div class="score-bar"><div class="score-fill" style="width: ${item.healthScore}%"></div></div>
      </div>
    </td>
    <td class="summary-cell">${item.summary}</td>
    <td class="blockers-col">${item.blockers}</td>
    <td class="feedback-col">${item.feedback}</td>
    <td class="date-col">${item.lastUpdated}</td>
  `;

  // Row click to expand
  tr.addEventListener('click', () => {
    tr.classList.toggle('expanded');
  });

  return tr;
}

/**
 * Apply filters to table
 */
function applyFilters(tbody, allData, filters) {
  const {
    searchInput, statusFilter, engagementFilter, healthFilter,
  } = filters;

  const searchTerm = searchInput.value.toLowerCase();
  const statusValue = statusFilter.value;
  const engagementValue = engagementFilter.value;
  const healthValue = healthFilter.value;

  const filteredData = allData.filter((item) => {
    // Search filter
    if (searchTerm) {
      const searchableText = `${item.companyName} ${item.summary} ${item.blockers} ${item.feedback}`.toLowerCase();
      if (!searchableText.includes(searchTerm)) return false;
    }

    // Status filter
    if (statusValue && item.status !== statusValue) return false;

    // Engagement filter
    if (engagementValue && item.engagement !== engagementValue) return false;

    // Health filter
    if (healthValue) {
      if (healthValue === 'critical' && item.healthScore >= 50) return false;
      if (healthValue === 'attention' && (item.healthScore < 50 || item.healthScore >= 75)) return false;
      if (healthValue === 'healthy' && item.healthScore < 75) return false;
    }

    return true;
  });

  // Clear tbody
  tbody.innerHTML = '';

  // Add filtered rows
  if (filteredData.length === 0) {
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = '<td colspan="8" class="empty-message">No customers match the current filters</td>';
    tbody.appendChild(emptyRow);
  } else {
    filteredData.forEach((item) => {
      tbody.appendChild(createTableRow(item));
    });
  }

  // Update count
  const countEl = document.querySelector('.engagement-count');
  if (countEl) {
    countEl.textContent = `Showing ${filteredData.length} of ${allData.length} customers`;
  }
}

/**
 * Main decorate function
 */
export default async function decorate(block) {
  // Check if block has data-source attribute for loading from JSON
  const dataSource = block.dataset.source;
  let allData = [];

  if (dataSource) {
    // Load data from JSON file
    try {
      const response = await fetch(dataSource);
      if (response.ok) {
        const json = await response.json();
        allData = json.data || json;
      } else {
        block.innerHTML = `<p class="weekly-engagement-empty">Failed to load data from ${dataSource}</p>`;
        return;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error loading data:', error);
      block.innerHTML = '<p class="weekly-engagement-empty">Error loading data</p>';
      return;
    }
  } else {
    // Parse data from HTML table rows
    const rows = [...block.children];
    if (rows.length === 0) {
      block.innerHTML = '<p class="weekly-engagement-empty">No engagement data available</p>';
      return;
    }
    allData = parseTableData(rows);
  }

  if (allData.length === 0) {
    block.innerHTML = '<p class="weekly-engagement-empty">No data available</p>';
    return;
  }

  // Get current week (async)
  const currentWeek = await getWeekIdentifier();

  // Filter to current week
  const weekData = currentWeek ? filterByWeek(allData, currentWeek) : allData;

  if (weekData.length === 0) {
    const weekMsg = currentWeek ? ` for ${formatWeekDate(currentWeek)}` : '';
    block.innerHTML = `<p class="weekly-engagement-empty">No engagement data${weekMsg}</p>`;
    return;
  }

  // Create container
  const container = document.createElement('div');
  container.className = 'weekly-engagement-container';

  // Header with week info
  const header = document.createElement('div');
  header.className = 'engagement-header';

  const weekDisplay = currentWeek ? formatWeekDate(currentWeek) : 'All Weeks';

  header.innerHTML = `
    <div class="week-info">
      <h3 class="week-title">Weekly Engagement Report</h3>
      <p class="week-subtitle">Week: ${weekDisplay}</p>
    </div>
    <div class="engagement-count">Showing ${weekData.length} customers</div>
  `;
  container.appendChild(header);

  // Create filters
  const {
    filterBar, searchInput, statusFilter, engagementFilter, healthFilter,
  } = createFilters();
  container.appendChild(filterBar);

  // Create table
  const table = document.createElement('table');
  table.className = 'engagement-table';
  table.appendChild(createTableHeader());

  const tbody = document.createElement('tbody');
  weekData.forEach((item) => {
    tbody.appendChild(createTableRow(item));
  });
  table.appendChild(tbody);

  container.appendChild(table);

  // Attach filter listeners
  const filterHandlers = {
    searchInput, statusFilter, engagementFilter, healthFilter,
  };

  searchInput.addEventListener('input', () => {
    applyFilters(tbody, weekData, filterHandlers);
  });

  statusFilter.addEventListener('change', () => {
    applyFilters(tbody, weekData, filterHandlers);
  });

  engagementFilter.addEventListener('change', () => {
    applyFilters(tbody, weekData, filterHandlers);
  });

  healthFilter.addEventListener('change', () => {
    applyFilters(tbody, weekData, filterHandlers);
  });

  // Replace block content
  block.textContent = '';
  block.appendChild(container);
}

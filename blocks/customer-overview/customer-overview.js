/**
 * Customer Overview Block
 * Displays customer cards with key metrics in a grid layout
 */

import { resolveSelectedWeek, formatWeekDate } from '../../scripts/week-utils.js';
import { analyzeEngagement } from '../../scripts/engagement-analyzer.js';

/**
 * Load customer data from JSON
 */
async function loadCustomerData(dataSource) {
  try {
    const response = await fetch(dataSource);
    if (!response.ok) {
      return [];
    }
    const json = await response.json();
    return json.data || json;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error loading customer data:', error);
    return [];
  }
}

/**
 * Create a customer card with AI insights
 */
function createCustomerCard(customer) {
  const card = document.createElement('div');
  card.className = 'customer-card';

  // Add status class for styling
  const statusClass = customer.status.toLowerCase().replace(/\s+/g, '-');
  const engagementClass = customer.engagement.toLowerCase().replace(/\s+/g, '-');
  card.classList.add(`status-${statusClass}`);
  card.classList.add(`engagement-${engagementClass}`);

  // Health score color
  let healthClass = 'healthy';
  if (customer.healthScore < 50) healthClass = 'critical';
  else if (customer.healthScore < 75) healthClass = 'attention';

  // Determine if there are blockers
  const hasBlockers = customer.blockersStatus
    && (customer.blockersStatus.toLowerCase() === 'yellow'
      || customer.blockersStatus.toLowerCase() === 'red');

  // Generate AI insights
  const analysis = analyzeEngagement(customer);

  // Urgency badge
  let urgencyClass = '';
  let urgencyLabel = '';
  if (analysis.urgency === 'high') {
    urgencyClass = 'urgent';
    urgencyLabel = '🚨 URGENT';
  } else if (analysis.urgency === 'medium') {
    urgencyClass = 'attention';
    urgencyLabel = '⚠️ ATTENTION';
  }

  card.innerHTML = `
    <div class="customer-card-header">
      <h3 class="customer-name">${customer.companyName}</h3>
      <div class="customer-badges">
        <span class="badge status-badge ${statusClass}">${customer.status}</span>
        ${urgencyLabel ? `<span class="badge urgency-badge ${urgencyClass}">${urgencyLabel}</span>` : ''}
      </div>
    </div>
    
    <div class="customer-metrics">
      <div class="metric">
        <div class="metric-label">Engagement</div>
        <div class="metric-value">
          <span class="engagement-indicator ${engagementClass}">●</span>
          ${customer.engagement}
        </div>
      </div>
      
      <div class="metric">
        <div class="metric-label">Health Score</div>
        <div class="metric-value ${healthClass}">
          <strong>${customer.healthScore}</strong>
          <div class="health-bar">
            <div class="health-fill" style="width: ${customer.healthScore}%"></div>
          </div>
        </div>
      </div>
      
      ${customer.mau ? `
        <div class="metric">
          <div class="metric-label">MAU</div>
          <div class="metric-value"><strong>${customer.mau}</strong></div>
        </div>
      ` : ''}
      
      ${customer.ttiv ? `
        <div class="metric">
          <div class="metric-label">TTIV</div>
          <div class="metric-value">${customer.ttiv}</div>
        </div>
      ` : ''}
    </div>
    
    ${customer.summary ? `
      <div class="customer-summary">
        <div class="summary-text">${customer.summary}</div>
      </div>
    ` : ''}
    
    ${hasBlockers ? `
      <div class="customer-alerts">
        <span class="alert-icon">⚠️</span>
        <span class="alert-text">Has blockers</span>
      </div>
    ` : ''}
    
    <!-- AI Insights Section (visible when expanded) -->
    <div class="ai-insights-section">
      <div class="ai-insights-header">
        <span class="ai-icon">📊</span>
        <h4>Data-Driven Insights</h4>
      </div>
      
      <div class="ai-synopsis">
        <h5>Historical Analysis</h5>
        <p>${analysis.synopsis}</p>
      </div>
      
      ${analysis.keyObservations && analysis.keyObservations.length > 0 ? `
        <div class="ai-observations">
          <h5>Key Observations</h5>
          <ul>
            ${analysis.keyObservations.map((obs) => `<li>${obs}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      
      ${analysis.trends && analysis.trends.length > 0 ? `
        <div class="ai-trends">
          <h5>Trend Indicators</h5>
          <ul>
            ${analysis.trends.map((trend) => `<li>${trend}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    </div>
    
    <div class="customer-footer">
      <div class="customer-meta">
        <span class="meta-item">${customer.industry || 'N/A'}</span>
        <span class="meta-separator">•</span>
        <span class="meta-item">${customer.eseLead || 'Unassigned'}</span>
      </div>
      <button class="expand-btn">
        <span class="expand-text">View Data Insights</span>
        <span class="collapse-text">Hide Data Insights</span>
        <span class="expand-icon">▼</span>
      </button>
    </div>
  `;

  // Toggle expansion on button click
  const expandBtn = card.querySelector('.expand-btn');
  expandBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    card.classList.toggle('expanded');
  });

  return card;
}

/**
 * Create filter controls
 */
function createFilters() {
  const filterBar = document.createElement('div');
  filterBar.className = 'overview-filters';

  const searchWrapper = document.createElement('div');
  searchWrapper.className = 'filter-search';
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search customers...';
  searchInput.className = 'search-input';
  searchWrapper.appendChild(searchInput);

  const statusFilter = document.createElement('select');
  statusFilter.className = 'filter-select';
  statusFilter.innerHTML = `
    <option value="">All Statuses</option>
    <option value="Production">Production</option>
    <option value="Pre-Production">Pre-Production</option>
    <option value="On Hold">On Hold</option>
  `;

  const engagementFilter = document.createElement('select');
  engagementFilter.className = 'filter-select';
  engagementFilter.innerHTML = `
    <option value="">All Engagement</option>
    <option value="Active">Active</option>
    <option value="At Risk">At Risk</option>
    <option value="Critical">Critical</option>
  `;

  const healthFilter = document.createElement('select');
  healthFilter.className = 'filter-select';
  healthFilter.innerHTML = `
    <option value="">All Health</option>
    <option value="critical">Critical (&lt;50)</option>
    <option value="attention">Needs Attention (50-75)</option>
    <option value="healthy">Healthy (&gt;75)</option>
  `;

  const sortSelect = document.createElement('select');
  sortSelect.className = 'filter-select';
  sortSelect.innerHTML = `
    <option value="name">Sort by Name</option>
    <option value="health-desc">Health Score (High to Low)</option>
    <option value="health-asc">Health Score (Low to High)</option>
    <option value="engagement">Engagement Level</option>
  `;

  filterBar.appendChild(searchWrapper);
  filterBar.appendChild(statusFilter);
  filterBar.appendChild(engagementFilter);
  filterBar.appendChild(healthFilter);
  filterBar.appendChild(sortSelect);

  return {
    filterBar, searchInput, statusFilter, engagementFilter, healthFilter, sortSelect,
  };
}

/**
 * Apply filters and sorting
 */
function applyFiltersAndSort(customers, filters) {
  const {
    searchInput, statusFilter, engagementFilter, healthFilter, sortSelect,
  } = filters;

  let filtered = [...customers];

  // Search filter
  const searchTerm = searchInput.value.toLowerCase();
  if (searchTerm) {
    filtered = filtered.filter((customer) => {
      const searchable = `${customer.companyName} ${customer.industry} ${customer.summary}`.toLowerCase();
      return searchable.includes(searchTerm);
    });
  }

  // Status filter
  if (statusFilter.value) {
    filtered = filtered.filter((c) => c.status === statusFilter.value);
  }

  // Engagement filter
  if (engagementFilter.value) {
    filtered = filtered.filter((c) => c.engagement === engagementFilter.value);
  }

  // Health filter
  if (healthFilter.value) {
    filtered = filtered.filter((c) => {
      if (healthFilter.value === 'critical') return c.healthScore < 50;
      if (healthFilter.value === 'attention') return c.healthScore >= 50 && c.healthScore < 75;
      if (healthFilter.value === 'healthy') return c.healthScore >= 75;
      return true;
    });
  }

  // Sorting
  switch (sortSelect.value) {
    case 'name':
      filtered.sort((a, b) => a.companyName.localeCompare(b.companyName));
      break;
    case 'health-desc':
      filtered.sort((a, b) => b.healthScore - a.healthScore);
      break;
    case 'health-asc':
      filtered.sort((a, b) => a.healthScore - b.healthScore);
      break;
    case 'engagement':
      filtered.sort((a, b) => {
        const order = { Critical: 0, 'At Risk': 1, Active: 2 };
        return (order[a.engagement] || 3) - (order[b.engagement] || 3);
      });
      break;
    default:
      break;
  }

  return filtered;
}

/**
 * Main decorate function
 */
export default async function decorate(block) {
  const dataSource = block.dataset.source || '/data/customers.json';

  // Show loading
  block.innerHTML = '<div class="overview-loading">Loading customer data...</div>';

  // eslint-disable-next-line no-console
  console.log('Customer Overview: Loading from', dataSource);

  // Load data
  const allData = await loadCustomerData(dataSource);

  // eslint-disable-next-line no-console
  console.log('Customer Overview: Loaded', allData.length, 'records');

  if (allData.length === 0) {
    block.innerHTML = '<p class="overview-empty">No customer data available</p>';
    return;
  }

  // Get current week
  const currentWeek = await resolveSelectedWeek();

  // eslint-disable-next-line no-console
  console.log('Customer Overview: Current week', currentWeek);

  // Filter to current week
  let weekData = currentWeek
    ? allData.filter((customer) => customer.week === currentWeek)
    : allData;

  // eslint-disable-next-line no-console
  console.log('Customer Overview: Filtered to', weekData.length, 'customers for week', currentWeek);

  // If no data for current week, use latest available
  if (weekData.length === 0) {
    const weeks = [...new Set(allData.map((c) => c.week))].sort().reverse();
    // eslint-disable-next-line no-console
    console.log('Customer Overview: No data for current week, using latest:', weeks[0]);
    if (weeks.length > 0) {
      weekData = allData.filter((customer) => customer.week === weeks[0]);
    }
  }

  if (weekData.length === 0) {
    block.innerHTML = '<p class="overview-empty">No customer data available for selected week</p>';
    return;
  }

  // eslint-disable-next-line no-console
  console.log('Customer Overview: Rendering', weekData.length, 'customer cards');
  // eslint-disable-next-line no-console
  console.log('Sample customers:', weekData.slice(0, 3).map((c) => c.companyName));

  // Create container
  const container = document.createElement('div');
  container.className = 'customer-overview-container';

  // Header
  const header = document.createElement('div');
  header.className = 'overview-header';

  const weekDisplay = currentWeek ? formatWeekDate(currentWeek) : 'Latest Data';

  header.innerHTML = `
    <div class="overview-title">
      <h2>Customer Overview</h2>
      <p class="overview-subtitle">Week of ${weekDisplay}</p>
    </div>
    <div class="overview-stats">
      <div class="stat-card">
        <div class="stat-value">${weekData.length}</div>
        <div class="stat-label">Total Customers</div>
      </div>
      <div class="stat-card green">
        <div class="stat-value">${weekData.filter((c) => c.engagement === 'Active').length}</div>
        <div class="stat-label">Active</div>
      </div>
      <div class="stat-card yellow">
        <div class="stat-value">${weekData.filter((c) => c.engagement === 'At Risk').length}</div>
        <div class="stat-label">At Risk</div>
      </div>
      <div class="stat-card red">
        <div class="stat-value">${weekData.filter((c) => c.engagement === 'Critical').length}</div>
        <div class="stat-label">Critical</div>
      </div>
    </div>
  `;
  container.appendChild(header);

  // Filters
  const {
    filterBar, searchInput, statusFilter, engagementFilter, healthFilter, sortSelect,
  } = createFilters();
  container.appendChild(filterBar);

  // Grid container
  const grid = document.createElement('div');
  grid.className = 'customer-grid';

  // Render initial cards
  const renderCards = () => {
    const filtered = applyFiltersAndSort(weekData, {
      searchInput, statusFilter, engagementFilter, healthFilter, sortSelect,
    });

    grid.innerHTML = '';

    if (filtered.length === 0) {
      grid.innerHTML = '<p class="no-results">No customers match the current filters</p>';
    } else {
      filtered.forEach((customer) => {
        grid.appendChild(createCustomerCard(customer));
      });
    }
  };

  renderCards();
  container.appendChild(grid);

  // Attach filter listeners
  searchInput.addEventListener('input', renderCards);
  statusFilter.addEventListener('change', renderCards);
  engagementFilter.addEventListener('change', renderCards);
  healthFilter.addEventListener('change', renderCards);
  sortSelect.addEventListener('change', renderCards);

  // Replace block
  block.textContent = '';
  block.appendChild(container);
}

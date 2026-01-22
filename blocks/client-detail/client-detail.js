import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Client Detail Block
 * Displays detailed client information with AI-powered summary
 *
 * Expected structure from authoring (table format):
 * | Field | Value |
 * | Client Name | Acme Corporation |
 * | Industry | Technology |
 * | Status | Active |
 * | Logo | [image reference] |
 * | AI Summary | [summary text or reference] |
 */

export default function decorate(block) {
  const rows = [...block.children];

  if (rows.length === 0) {
    block.innerHTML = '<p class="client-detail-empty">No client information available</p>';
    return;
  }

  const clientData = {};
  let logoElement = null;
  let aiSummary = null;

  // Parse the table structure
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const field = cells[0]?.textContent.trim().toLowerCase();
      const valueCell = cells[1];

      // Check if the value contains an image
      const picture = valueCell.querySelector('picture');
      if (picture && field.includes('logo')) {
        const img = picture.querySelector('img');
        if (img) {
          logoElement = createOptimizedPicture(img.src, img.alt || 'Client Logo', false, [{ width: '200' }]);
        }
      } else if (field.includes('ai summary') || field.includes('summary')) {
        aiSummary = valueCell.textContent.trim();
      } else {
        clientData[field] = valueCell.textContent.trim();
      }
    }
  });

  // Build the client detail layout
  const container = document.createElement('div');
  container.className = 'client-detail-container';

  // Header section with logo and basic info
  const header = document.createElement('div');
  header.className = 'client-detail-header';

  if (logoElement) {
    const logoWrapper = document.createElement('div');
    logoWrapper.className = 'client-detail-logo';
    logoWrapper.appendChild(logoElement);
    header.appendChild(logoWrapper);
  }

  const basicInfo = document.createElement('div');
  basicInfo.className = 'client-detail-basic-info';

  // Client name (prioritize various field names)
  const clientName = clientData['client name']
    || clientData.name
    || clientData.company
    || 'Unknown Client';
  const nameEl = document.createElement('h2');
  nameEl.className = 'client-detail-name';
  nameEl.textContent = clientName;
  basicInfo.appendChild(nameEl);

  // Status badge
  const status = clientData.status || clientData['account status'];
  if (status) {
    const statusEl = document.createElement('span');
    statusEl.className = 'client-detail-status';
    statusEl.classList.add(status.toLowerCase().replace(/\s+/g, '-'));
    statusEl.textContent = status;
    basicInfo.appendChild(statusEl);
  }

  header.appendChild(basicInfo);
  container.appendChild(header);

  // AI Summary section (integrated)
  if (aiSummary) {
    const summarySection = document.createElement('div');
    summarySection.className = 'client-detail-ai-summary';

    const summaryTitle = document.createElement('h3');
    summaryTitle.className = 'ai-summary-title';
    summaryTitle.innerHTML = '<span class="ai-badge">AI</span> Summary';

    const summaryContent = document.createElement('div');
    summaryContent.className = 'ai-summary-content';
    summaryContent.textContent = aiSummary;

    summarySection.appendChild(summaryTitle);
    summarySection.appendChild(summaryContent);
    container.appendChild(summarySection);
  }

  // Details grid for remaining fields
  const detailsGrid = document.createElement('div');
  detailsGrid.className = 'client-detail-grid';

  Object.entries(clientData).forEach(([field, value]) => {
    // Skip fields already displayed
    if (field.includes('name') || field.includes('status')) return;

    const detailItem = document.createElement('div');
    detailItem.className = 'client-detail-item';

    const label = document.createElement('div');
    label.className = 'detail-label';
    // Capitalize each word
    label.textContent = field.split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const valueEl = document.createElement('div');
    valueEl.className = 'detail-value';
    valueEl.textContent = value;

    detailItem.appendChild(label);
    detailItem.appendChild(valueEl);
    detailsGrid.appendChild(detailItem);
  });

  if (detailsGrid.children.length > 0) {
    container.appendChild(detailsGrid);
  }

  block.textContent = '';
  block.appendChild(container);
}

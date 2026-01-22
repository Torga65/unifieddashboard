/**
 * AI Summary Block
 * Displays AI-generated summaries and insights
 * Can be used standalone or integrated into other blocks
 *
 * Expected structure from authoring (table format):
 * | Title | Content |
 * | Key Insights | [summary text] |
 * | Recommendations | [recommendations text] |
 */

export default function decorate(block) {
  const rows = [...block.children];

  if (rows.length === 0) {
    block.innerHTML = '<p class="ai-summary-empty">No AI summary available</p>';
    return;
  }

  const container = document.createElement('div');
  container.className = 'ai-summary-container';

  // Add AI badge header
  const header = document.createElement('div');
  header.className = 'ai-summary-header';
  header.innerHTML = '<span class="ai-badge">AI</span><span class="ai-title">Generated Insights</span>';
  container.appendChild(header);

  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'ai-summary-content-wrapper';

  // Parse rows into summary sections
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const title = cells[0]?.textContent.trim();
      const content = cells[1]?.textContent.trim();

      if (title && content) {
        const section = document.createElement('div');
        section.className = 'ai-summary-section';

        const sectionTitle = document.createElement('h4');
        sectionTitle.className = 'ai-summary-section-title';
        sectionTitle.textContent = title;

        const sectionContent = document.createElement('div');
        sectionContent.className = 'ai-summary-section-content';

        // Handle bullet points if content contains line breaks or bullets
        if (content.includes('\n') || content.includes('•') || content.includes('-')) {
          const items = content
            .split(/\n|•/)
            .map((item) => item.trim())
            .filter((item) => item.length > 0);

          if (items.length > 1) {
            const ul = document.createElement('ul');
            items.forEach((item) => {
              const li = document.createElement('li');
              // Remove leading dash if present
              li.textContent = item.replace(/^-\s*/, '');
              ul.appendChild(li);
            });
            sectionContent.appendChild(ul);
          } else {
            sectionContent.textContent = content;
          }
        } else {
          sectionContent.textContent = content;
        }

        section.appendChild(sectionTitle);
        section.appendChild(sectionContent);
        contentWrapper.appendChild(section);
      }
    } else if (cells.length === 1) {
      // Single column - treat as plain content
      const content = cells[0]?.textContent.trim();
      if (content) {
        const section = document.createElement('div');
        section.className = 'ai-summary-section';

        const sectionContent = document.createElement('div');
        sectionContent.className = 'ai-summary-section-content';
        sectionContent.textContent = content;

        section.appendChild(sectionContent);
        contentWrapper.appendChild(section);
      }
    }
  });

  container.appendChild(contentWrapper);

  // Add generation timestamp
  const footer = document.createElement('div');
  footer.className = 'ai-summary-footer';
  const now = new Date();
  footer.textContent = `Generated on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`;
  container.appendChild(footer);

  block.textContent = '';
  block.appendChild(container);
}

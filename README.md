# Unified Dashboard - Adobe EDS Project

A comprehensive client engagement dashboard built with Adobe Edge Delivery Services (EDS). Features custom blocks for weekly engagement metrics, client details with AI-powered summaries, and standalone AI insights.

## Environments
- Preview: https://main--{repo}--{owner}.aem.page/
- Live: https://main--{repo}--{owner}.aem.live/

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Adobe AEM CLI
- Git

### Installation

```sh
npm install
```

### Local Development

1. **Install the AEM CLI** (if not already installed):
   ```sh
   npm install -g @adobe/aem-cli
   ```

2. **Start the local development server**:
   ```sh
   aem up
   ```
   This will start the Helix development proxy and open your browser at `http://localhost:3000`

3. **Edit files** in your IDE:
   - Blocks: `blocks/{block-name}/`
   - Scripts: `scripts/`
   - Styles: `styles/`
   - Content: `.html` files in the root

4. **View changes**: The development server will automatically reload when you save files

5. **Sample page**: Navigate to `http://localhost:3000/dashboard.html` to see the blocks in action

### Linting

```sh
npm run lint
```

## Custom Blocks

This project includes three custom blocks designed for client engagement dashboards:

### 1. Weekly Engagement Block
**Path**: `blocks/weekly-engagement/`

Displays weekly engagement metrics in a dashboard format with metric cards showing values and percentage changes.

**Authoring Pattern** (in Google Docs/SharePoint):

| Week   | Metric              | Value  | Change  |
|--------|---------------------|--------|---------|
| Week 1 | Active Users        | 1,234  | +5.2%   |
| Week 1 | Total Sessions      | 5,678  | +12.3%  |
| Week 1 | Engagement Rate     | 78%    | +3.1%   |
| Week 2 | Active Users        | 1,456  | +18.0%  |

Then insert as a "Weekly Engagement" block in your document.

### 2. Client Detail Block
**Path**: `blocks/client-detail/`

Displays comprehensive client information with an integrated AI-powered summary section.

**Authoring Pattern** (in Google Docs/SharePoint):

| Field          | Value                                                          |
|----------------|----------------------------------------------------------------|
| Client Name    | Acme Corporation                                               |
| Industry       | Technology                                                     |
| Status         | Active                                                         |
| Region         | North America                                                  |
| Contract Value | $250,000                                                       |
| Logo           | [Insert image here]                                            |
| AI Summary     | [Your AI-generated summary text about the client...]           |

Then insert as a "Client Detail" block in your document.

### 3. AI Summary Block
**Path**: `blocks/ai-summary/`

Displays AI-generated insights and recommendations. Can be used standalone or integrated into the client-detail block.

**Authoring Pattern** (in Google Docs/SharePoint):

| Title             | Content                                              |
|-------------------|------------------------------------------------------|
| Key Insights      | • User engagement increased 15% month-over-month     |
|                   | • Session duration up significantly                  |
| Recommendations   | • Expand onboarding program                          |
|                   | • Schedule quarterly business review                 |
| Risk Factors      | • Contract renewal upcoming in Q4                    |

Then insert as an "AI Summary" block in your document.

## Content Authoring Guidelines

### Creating Pages with Blocks

1. **Create a new Google Doc or SharePoint document**
2. **Add your content** using standard formatting (headings, paragraphs, tables)
3. **Insert blocks** by creating a table with the specific structure for each block type
4. **Add a section divider** (horizontal rule `---`) between sections if needed
5. **Publish** via the AEM Sidekick extension

### Block Authoring Best Practices

- **Use tables** for structured data - EDS automatically converts table rows into block children
- **Column headers** become field names (case-insensitive)
- **Images** can be inserted directly in table cells
- **Multi-line content** is preserved within cells
- **Status values** (Active, Inactive, Pending) automatically get styled badges
- **Percentage changes** with + or - get automatic color coding (green/red)

### Example Document Structure

```
Heading 1: Dashboard Title
Paragraph: Introduction text

---

Heading 2: Weekly Metrics
[Weekly Engagement block table]

---

Heading 2: Client Information  
[Client Detail block table]

---

Heading 2: AI Insights
[AI Summary block table]
```

## Project Structure

```
/blocks/                      # Custom blocks
  /weekly-engagement/         # Engagement metrics block
  /client-detail/             # Client information block
  /ai-summary/                # AI insights block
  /cards/                     # Standard cards block
  /columns/                   # Standard columns block
  /footer/                    # Footer block
  /header/                    # Header block
  /hero/                      # Hero block
  /fragment/                  # Fragment block
/scripts/                     # Core scripts
  aem.js                      # AEM/EDS utilities
  scripts.js                  # Main initialization
  delayed.js                  # Delayed loading
/styles/                      # Global styles
  styles.css                  # Main styles
  lazy-styles.css             # Lazy-loaded styles
  fonts.css                   # Web fonts
/icons/                       # SVG icons
/fonts/                       # Web font files
*.html                        # Content pages
```

## EDS Conventions Used

This project follows Adobe Edge Delivery Services best practices:

- **`decorateBlock()`**: Transforms block markup into enhanced UI
- **`decorateSections()`**: Processes page sections
- **`createOptimizedPicture()`**: Creates responsive, optimized images
- **Vanilla JavaScript**: No frameworks, pure JS for performance
- **Progressive enhancement**: Content works without JavaScript
- **Semantic HTML**: Accessible, SEO-friendly markup

## Development Workflow

1. **Author content** in Google Docs/SharePoint with the AEM Sidekick
2. **Test locally** using `aem up` to preview changes
3. **Commit code** changes to git (blocks, styles, scripts)
4. **Push to GitHub** - changes deploy automatically to preview environment
5. **Preview** at `https://main--{repo}--{owner}.aem.page/`
6. **Publish** via AEM Sidekick when ready for production

## Data Sources

For dynamic data integration:

1. **Spreadsheets**: Use Google Sheets or Excel as data sources
2. **JSON endpoints**: Fetch data from APIs in block decorators
3. **Fragment blocks**: Reuse common content across pages
4. **Metadata**: Configure per-page settings in document metadata

Example fetching from a spreadsheet:

```javascript
// In your block's JS file
const resp = await fetch('/data/clients.json');
const data = await resp.json();
// Process data...
```

## Additional Resources

- [Adobe EDS Documentation](https://www.aem.live/docs/)
- [Developer Tutorial](https://www.aem.live/developer/tutorial)
- [Block Development Guide](https://www.aem.live/developer/block-collection)
- [Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
- [Web Performance](https://www.aem.live/developer/keeping-it-100)
- [Markup, Sections, Blocks](https://www.aem.live/developer/markup-sections-blocks)

## Support

For issues or questions:
1. Check the [Adobe EDS documentation](https://www.aem.live/docs/)
2. Review existing blocks in `/blocks` for patterns
3. Test locally with `aem up` before deploying

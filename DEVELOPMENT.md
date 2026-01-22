# Development Guide

Quick reference for developers working on the Unified Dashboard EDS project.

## Quick Start

```bash
# Install dependencies
npm install

# Install AEM CLI globally (one-time)
npm install -g @adobe/aem-cli

# Start local development server
aem up

# Open browser to http://localhost:3000
```

## Project Structure

```
/blocks/
  /weekly-engagement/     # Engagement metrics dashboard block
    weekly-engagement.js  # Block decorator function
    weekly-engagement.css # Block styles
  /client-detail/         # Client information block with AI summary
    client-detail.js
    client-detail.css
  /ai-summary/           # Standalone AI insights block
    ai-summary.js
    ai-summary.css
  /{other-blocks}/       # Standard EDS blocks

/scripts/
  aem.js                 # Core EDS utilities (decorateBlocks, etc.)
  scripts.js             # Main initialization and auto-blocking
  delayed.js             # Delayed loading (3rd party scripts, etc.)

/styles/
  styles.css             # Global styles (eagerly loaded)
  lazy-styles.css        # Lazy-loaded styles
  fonts.css              # Web font definitions

/*.html                  # Content pages (e.g., dashboard.html)
```

## Block Development Pattern

### 1. Block Structure

Every block follows this structure:

```
/blocks/{block-name}/
  {block-name}.js        # JavaScript decorator
  {block-name}.css       # Block-specific styles
```

### 2. JavaScript Pattern

```javascript
/**
 * Block description and authoring pattern documentation
 */
export default function decorate(block) {
  // 1. Parse the block children (table rows from authoring)
  const rows = [...block.children];

  // 2. Extract data from rows
  rows.forEach((row) => {
    const cells = [...row.children];
    // Process cells...
  });

  // 3. Build new DOM structure
  const container = document.createElement('div');
  container.className = 'block-name-container';
  // Build content...

  // 4. Replace block content
  block.textContent = '';
  block.appendChild(container);
}
```

### 3. CSS Pattern

```css
/* Container */
.block-name-container {
  /* Base styles */
}

/* Child elements with BEM-style naming */
.block-name-item {
  /* Item styles */
}

.block-name-item-detail {
  /* Nested element styles */
}

/* Responsive */
@media (max-width: 768px) {
  /* Mobile styles */
}
```

## EDS Core Functions

Import from `scripts/aem.js`:

```javascript
import {
  createOptimizedPicture,  // Create responsive images
  decorateIcons,           // Decorate icon placeholders
  loadCSS,                 // Dynamically load CSS
  toClassName,             // Convert strings to class names
  fetchPlaceholders,       // Load i18n placeholders
} from '../../scripts/aem.js';
```

### Common Functions

**`createOptimizedPicture(src, alt, eager, breakpoints)`**
```javascript
// Create responsive, optimized image
const picture = createOptimizedPicture(
  img.src,
  img.alt,
  false,  // not eager loaded
  [{ width: '750' }]  // breakpoints
);
```

**`loadCSS(href)`**
```javascript
// Dynamically load additional CSS
await loadCSS('/styles/custom.css');
```

**`decorateIcons(element)`**
```javascript
// Convert :icon-name: to SVG icons
decorateIcons(block);
```

## Block Loading Lifecycle

1. **HTML Parsing**: Browser parses HTML, blocks are `<div class="block-name">`
2. **decorateBlocks()**: Identifies all blocks in `scripts.js`
3. **Lazy Loading**: Dynamically imports `/blocks/{block-name}/{block-name}.js`
4. **Decoration**: Calls default export function with block element
5. **CSS Loading**: Automatically loads `/blocks/{block-name}/{block-name}.css`

## Authoring Blocks

Content authors create blocks using tables in Google Docs/SharePoint:

### Weekly Engagement
```
| Week   | Metric       | Value | Change |
|--------|--------------|-------|--------|
| Week 1 | Active Users | 1234  | +5%    |
```

### Client Detail
```
| Field        | Value            |
|--------------|------------------|
| Client Name  | Acme Corp        |
| Status       | Active           |
| AI Summary   | Summary text...  |
```

### AI Summary
```
| Title          | Content                |
|----------------|------------------------|
| Key Insights   | • Insight 1            |
|                | • Insight 2            |
```

## Local Development Workflow

1. **Edit block files**: Make changes to JS/CSS in `/blocks`
2. **Save file**: AEM dev server auto-reloads
3. **View at**: `http://localhost:3000/dashboard.html`
4. **Check console**: Look for errors in browser DevTools
5. **Test changes**: Verify functionality and styling

## Testing

### Manual Testing
```bash
# Start dev server
aem up

# Navigate to test page
open http://localhost:3000/dashboard.html
```

### Linting
```bash
# Check code quality
npm run lint

# Auto-fix issues
npm run lint:fix
```

## Common Tasks

### Adding a New Block

1. **Create block directory**:
   ```bash
   mkdir -p blocks/my-block
   ```

2. **Create JS file** (`blocks/my-block/my-block.js`):
   ```javascript
   export default function decorate(block) {
     // Your block logic
   }
   ```

3. **Create CSS file** (`blocks/my-block/my-block.css`):
   ```css
   .my-block {
     /* Your styles */
   }
   ```

4. **Author content**: Create table in Google Docs and convert to block

5. **Test locally**: View in browser at `http://localhost:3000`

### Fetching External Data

```javascript
export default async function decorate(block) {
  try {
    const resp = await fetch('/data/metrics.json');
    const data = await resp.json();

    // Use data to build block...

  } catch (error) {
    console.error('Failed to load data:', error);
    block.textContent = 'Error loading data';
  }
}
```

### Using Images

```javascript
import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const img = block.querySelector('img');

  if (img) {
    const optimizedPicture = createOptimizedPicture(
      img.src,
      img.alt,
      false,  // lazy load
      [
        { media: '(min-width: 600px)', width: '2000' },
        { width: '750' }
      ]
    );

    img.closest('picture').replaceWith(optimizedPicture);
  }
}
```

## Performance Best Practices

1. **Lazy Load**: Don't eagerly load unless above-the-fold
2. **Minimize DOM Operations**: Build fragments, append once
3. **Optimize Images**: Use `createOptimizedPicture()`
4. **Defer Heavy Operations**: Use `requestIdleCallback()` or `setTimeout()`
5. **CSS Efficiency**: Avoid deep nesting, use CSS Grid/Flexbox

## Debugging

### Check Block Loading
```javascript
// In browser console
console.log(document.querySelectorAll('[class*="block"]'));
```

### Verify Block Decorator Runs
```javascript
// Add to your block's decorate function
export default function decorate(block) {
  console.log('Decorating block:', block);
  // Rest of your code...
}
```

### Check Network Requests
- Open DevTools → Network tab
- Look for block JS/CSS files loading
- Verify data fetches (if any)

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-enhancement

# Make changes
# ... edit files ...

# Stage changes
git add .

# Commit
git commit -m "Add: new feature for X"

# Push
git push origin feature/my-enhancement

# Create PR via GitHub
```

## Deployment

### Preview Environment
- **Automatic**: Pushes to `main` branch deploy to preview
- **URL**: `https://main--{repo}--{owner}.aem.page/`
- **Use**: Test changes before production

### Production Environment
- **Manual**: Use AEM Sidekick to publish from preview
- **URL**: `https://main--{repo}--{owner}.aem.live/`
- **Use**: Production content

## Useful Commands

```bash
# Install dependencies
npm install

# Start local dev server
aem up

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Check bundle size (if configured)
npm run build

# Update AEM CLI
npm update -g @adobe/aem-cli
```

## Resources

- [Adobe EDS Documentation](https://www.aem.live/docs/)
- [Block Development Tutorial](https://www.aem.live/developer/tutorial)
- [Block Collection](https://www.aem.live/developer/block-collection)
- [EDS Discord Community](https://discord.gg/adobe-experience-league)

## Troubleshooting

### Block Not Loading
- Check browser console for errors
- Verify file naming: `{block-name}.js` matches `class="block-name"`
- Ensure block is in `/blocks/{block-name}/` directory

### Styles Not Applying
- Check CSS file name matches JS file name
- Verify CSS file exists
- Check browser DevTools → Network for 404s
- Clear browser cache

### AEM CLI Issues
```bash
# Reinstall AEM CLI
npm uninstall -g @adobe/aem-cli
npm install -g @adobe/aem-cli

# Check version
aem --version
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
aem up --port 3001
```

## Code Style

- **JavaScript**: Follow Airbnb style guide (enforced by ESLint)
- **CSS**: Use standard CSS practices (enforced by Stylelint)
- **Naming**: Use kebab-case for files, camelCase for JS variables
- **Comments**: Document complex logic and authoring patterns

## Getting Help

1. Check this guide and README.md
2. Review existing blocks for patterns
3. Consult [Adobe EDS Docs](https://www.aem.live/docs/)
4. Ask the team in Slack/Teams

---

**Happy Coding!** 🚀

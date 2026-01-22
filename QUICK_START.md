# Quick Start Guide

Get up and running with the Unified Dashboard in 5 minutes.

## For Developers

### 1. Setup (One-Time)

```bash
# Install dependencies
npm install

# Install AEM CLI globally
npm install -g @adobe/aem-cli
```

### 2. Start Development

```bash
# Start local server
aem up

# Open http://localhost:3000 in your browser
# View sample: http://localhost:3000/dashboard.html
```

### 3. Make Changes

1. Edit files in `blocks/`, `scripts/`, or `styles/`
2. Save → auto-reload in browser
3. Check console for errors

### 4. Lint & Test

```bash
npm run lint          # Check code
npm run lint:fix      # Fix issues
```

---

## For Content Authors

### 1. Access Your Document

- Open Google Docs or SharePoint
- Have AEM Sidekick browser extension installed

### 2. Create a Block

**Example: Weekly Engagement**

1. Insert a table:
   ```
   | Week   | Metric       | Value | Change |
   |--------|--------------|-------|--------|
   | Week 1 | Active Users | 1234  | +5%    |
   ```

2. Select table → AEM Sidekick → "Convert to Block" → "Weekly Engagement"

### 3. Preview & Publish

1. Click "Preview" in AEM Sidekick
2. Review at preview URL
3. Click "Publish" when ready

---

## Available Blocks

| Block              | Purpose                               | Columns              |
|--------------------|---------------------------------------|----------------------|
| Weekly Engagement  | Display metrics with trends           | Week, Metric, Value, Change |
| Client Detail      | Show client info + AI summary         | Field, Value         |
| AI Summary         | Present AI-generated insights         | Title, Content       |

---

## Common Commands

```bash
aem up                # Start dev server
npm run lint          # Check code quality
npm run lint:fix      # Auto-fix issues
git status            # Check git status
git add .             # Stage changes
git commit -m "msg"   # Commit changes
git push              # Push to remote
```

---

## File Structure

```
/blocks/
  /weekly-engagement/  ← Engagement metrics block
  /client-detail/      ← Client info block
  /ai-summary/         ← AI insights block

/scripts/
  scripts.js           ← Main initialization

/styles/
  styles.css           ← Global styles

*.html                 ← Content pages
```

---

## Getting Help

- **Developers**: See `DEVELOPMENT.md`
- **Authors**: See `AUTHORING_GUIDE.md`
- **Setup**: See `README.md`
- **Sample**: Open `dashboard.html`

---

## Next Steps

1. ✅ Run `aem up` to start local server
2. ✅ Open `http://localhost:3000/dashboard.html`
3. ✅ Review the three custom blocks
4. ✅ Read `AUTHORING_GUIDE.md` for content creation
5. ✅ Read `DEVELOPMENT.md` for block development

---

**You're all set!** Start building amazing dashboards with Adobe EDS. 🚀

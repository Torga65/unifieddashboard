# Weekly Engagement Block - Authoring Format

## 1. Table Format for Authors

### Basic Structure

Authors paste this table into their Google Doc or SharePoint document:

```
| Week       | Company Name      | Status  | Engagement | Health Score | Summary of Engagement                    | Blockers                    | Feedback                | Last Updated |
|------------|-------------------|---------|------------|--------------|------------------------------------------|-----------------------------|-----------------------|--------------|
| 2024-W03   | Acme Corp         | Active  | High       | 95           | Completed Q1 planning, 15 active users   | None                        | Positive onboarding   | 2024-01-22   |
| 2024-W03   | TechStart Inc     | Active  | Medium     | 78           | 8 active users, slow feature adoption    | Budget approval pending     | Needs training        | 2024-01-21   |
| 2024-W03   | Global Solutions  | At Risk | Low        | 45           | Only 3 active users, no engagement       | Technical integration issues| Frustrated with setup | 2024-01-20   |
| 2024-W03   | DataFlow Systems  | Active  | High       | 88           | Strong adoption, requesting new features | None                        | Very satisfied        | 2024-01-22   |
| 2024-W02   | Acme Corp         | Active  | Medium     | 90           | 12 active users, steady growth           | None                        | Good progress         | 2024-01-15   |
| 2024-W02   | TechStart Inc     | Active  | Medium     | 75           | 7 active users                           | Waiting on approval         | Neutral               | 2024-01-14   |
```

### Column Definitions

| Column                  | Format          | Description                                      | Values                                    |
|-------------------------|-----------------|--------------------------------------------------|-------------------------------------------|
| **Week**                | YYYY-Www        | ISO week format (e.g., 2024-W03)                 | YYYY-W01 to YYYY-W52                      |
| **Company Name**        | Text            | Customer/client name                             | Any text                                  |
| **Status**              | Text            | Account status                                   | Active, At Risk, Churned, Onboarding      |
| **Engagement**          | Text            | Engagement level                                 | High, Medium, Low, None                   |
| **Health Score**        | Number (0-100)  | Overall account health                           | 0-100                                     |
| **Summary of Engagement** | Text          | Brief description of weekly activity             | Any text (max 200 chars recommended)      |
| **Blockers**            | Text            | Current obstacles or issues                      | Any text or "None"                        |
| **Feedback**            | Text            | Customer feedback or sentiment                   | Any text                                  |
| **Last Updated**        | Date            | When this record was last updated                | YYYY-MM-DD or any date format             |

### Alternative: Minimal Format

For simpler authoring, you can omit the Week column if using metadata/URL to identify the week:

```
| Company Name      | Status  | Engagement | Health Score | Summary of Engagement                    | Blockers                    | Feedback                | Last Updated |
|-------------------|---------|------------|--------------|------------------------------------------|-----------------------------|-----------------------|--------------|
| Acme Corp         | Active  | High       | 95           | Completed Q1 planning, 15 active users   | None                        | Positive onboarding   | 2024-01-22   |
| TechStart Inc     | Active  | Medium     | 78           | 8 active users, slow feature adoption    | Budget approval pending     | Needs training        | 2024-01-21   |
```

## 2. Week Identification Rules

The block determines the current week using this priority order:

### Priority 1: Page Metadata (Recommended)

Add metadata to the document:

```
---
Week: 2024-W03
---
```

Or in Google Docs, use AEM Sidekick metadata:
- Key: `week`
- Value: `2024-W03`

### Priority 2: URL Parameter

Access page with week parameter:
```
https://example.com/engagement?week=2024-W03
https://example.com/engagement/2024-W03
```

### Priority 3: Week Column in Table

The block reads the "Week" column from the table data.

### Priority 4: Current Week

If no week specified, calculate current ISO week from system date.

### Week Format

**Standard Format**: `YYYY-Www`
- `2024-W01` = Week 1 of 2024
- `2024-W52` = Week 52 of 2024

**Alternative Formats** (auto-converted):
- `Week 3, 2024` → `2024-W03`
- `2024-01-22` (date) → Converts to ISO week
- `W03 2024` → `2024-W03`

## 3. Interactive Features

### Default Behavior
- **On Load**: Shows only data for current week (or specified week)
- **No Data**: Shows message "No engagement data for Week [XX]"

### Filters (Applied via UI)
- **Status**: All, Active, At Risk, Churned, Onboarding
- **Engagement**: All, High, Medium, Low, None
- **Health Score**: All, Critical (<50), Needs Attention (50-75), Healthy (>75)

### Search
- Real-time search across Company Name, Summary, Blockers, Feedback
- Highlight matching text

### Row Click
- Expands row to show full details
- Or navigates to client detail page (if configured)

### Week Navigation
- Previous/Next week buttons
- Week selector dropdown
- "View All Weeks" toggle

## 4. Example Authoring Workflow

### Step 1: Create Document
Create a new Google Doc named: `Weekly Engagement Report`

### Step 2: Add Metadata
Use AEM Sidekick to add metadata:
- `week`: `2024-W03`
- `title`: `Weekly Engagement - Week 3, 2024`

### Step 3: Add Content
Add a heading and table:

```
# Weekly Engagement Report

## Week 3, 2024 (Jan 15-21)

[Insert table here with all customer rows]
```

### Step 4: Convert to Block
1. Select the entire table
2. Click AEM Sidekick → "Convert to Block"
3. Choose "Weekly Engagement"

### Step 5: Preview & Publish
1. Click "Preview" to see the interactive table
2. Test filters and search
3. Click "Publish" when ready

## 5. Data Management Options

### Option A: Single Document with All Weeks
- One table with Week column
- Authors add new rows each week
- Block filters to show current week

### Option B: Separate Document per Week
- New document each week
- Metadata specifies the week
- No Week column needed

### Option C: Google Sheets Integration
- Maintain data in Google Sheets
- Multiple sheets per workbook (one per week)
- Block fetches data via JSON endpoint
- Authors only update spreadsheet

**Recommended**: Option C for larger datasets, Option B for simpler management

## 6. Sample Data Templates

### Small Team (< 10 clients)
```
| Company Name    | Status  | Engagement | Health Score | Summary of Engagement           | Blockers | Feedback      | Last Updated |
|-----------------|---------|------------|--------------|--------------------------------|----------|---------------|--------------|
| Client A        | Active  | High       | 95           | Excellent progress this week   | None     | Very positive | 2024-01-22   |
| Client B        | Active  | Medium     | 80           | Steady engagement              | None     | Satisfied     | 2024-01-22   |
| Client C        | At Risk | Low        | 55           | Minimal activity               | Budget   | Concerned     | 2024-01-21   |
```

### Enterprise (with Week column)
```
| Week     | Company Name        | Status      | Engagement | Health Score | Summary of Engagement                          | Blockers                     | Feedback                  | Last Updated |
|----------|---------------------|-------------|------------|--------------|------------------------------------------------|------------------------------|---------------------------|--------------|
| 2024-W03 | Enterprise Corp     | Active      | High       | 92           | 50+ active users, strong feature adoption      | None                         | Requesting mobile app     | 2024-01-22   |
| 2024-W03 | MidMarket LLC       | Active      | High       | 88           | Completed integration, going live next week    | Minor training gaps          | Excited about launch      | 2024-01-21   |
| 2024-W03 | StartupXYZ          | Onboarding  | Medium     | 70           | Week 2 of onboarding, 5 users trained          | Slow IT response             | Positive but impatient    | 2024-01-20   |
| 2024-W03 | Legacy Systems Inc  | At Risk     | Low        | 45           | No usage for 10 days, renewal coming up        | Technical issues unresolved  | Frustrated and considering alternatives | 2024-01-19   |
```

## 7. Best Practices

### ✅ DO:
- Use consistent date formats (YYYY-MM-DD recommended)
- Keep summaries concise (under 200 characters)
- Update Last Updated date when changing any field
- Use standard status values (Active, At Risk, Churned, Onboarding)
- Include "None" for empty Blockers (not blank)
- Add new week's data at the top of the table

### ❌ DON'T:
- Mix date formats in the same column
- Leave required columns empty (Company Name, Status)
- Use merged cells
- Include formulas in table cells
- Use special characters in Status or Engagement fields

## 8. Advanced: Multiple Tables

You can include multiple tables for different segments:

```
## Enterprise Customers

[Table with enterprise customer data]

## SMB Customers

[Table with SMB customer data]

## Trial Users

[Table with trial user data]
```

Each table becomes a separate Weekly Engagement block with its own filters.

---

**Last Updated**: January 2026
**Version**: 2.0

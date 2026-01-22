# Content Authoring Guide for Unified Dashboard

This guide explains how to create and maintain dashboard content using Google Docs or SharePoint with Adobe Edge Delivery Services.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Block Types](#block-types)
3. [Authoring Patterns](#authoring-patterns)
4. [Publishing Workflow](#publishing-workflow)

## Getting Started

### Prerequisites
- Google Docs or Microsoft SharePoint access
- AEM Sidekick browser extension installed
- Edit permissions for the content repository

### Basic Concepts
- **Blocks** are interactive components that display data in specific formats
- **Tables** in your document become blocks when published
- **Metadata** controls page settings (title, description, etc.)

## Block Types

### 1. Weekly Engagement Block

**Purpose**: Display weekly engagement metrics with trend indicators

**How to Create**:

1. Add a heading: `## Weekly Engagement Metrics`
2. Insert a table below with these columns:

```
| Week   | Metric              | Value  | Change  |
|--------|---------------------|--------|---------|
| Week 1 | Active Users        | 1,234  | +5.2%   |
| Week 1 | Total Sessions      | 5,678  | +12.3%  |
| Week 1 | Engagement Rate     | 78%    | +3.1%   |
```

3. Select the table
4. Use AEM Sidekick → Click "Convert to Block" → Choose "Weekly Engagement"

**Tips**:
- Use consistent week labels (Week 1, Week 2, etc.)
- Changes with `+` show as green, `-` show as red
- Metrics are grouped by week automatically
- You can add as many metrics per week as needed

**Column Definitions**:
- **Week**: The week identifier (groups metrics together)
- **Metric**: Name of the metric (e.g., "Active Users", "Page Views")
- **Value**: The metric value (formatted as shown)
- **Change**: Percentage or absolute change (include + or - for color coding)

---

### 2. Client Detail Block

**Purpose**: Display comprehensive client information with AI summary

**How to Create**:

1. Add a heading: `## Client Information`
2. Insert a table with key-value pairs:

```
| Field          | Value                                    |
|----------------|------------------------------------------|
| Client Name    | Acme Corporation                         |
| Industry       | Technology                               |
| Status         | Active                                   |
| Region         | North America                            |
| Contract Value | $250,000                                 |
| Account Manager| Jane Smith                               |
| Start Date     | January 15, 2024                         |
| Logo           | [Insert your logo image here]            |
| AI Summary     | [Your AI-generated summary text...]      |
```

3. Select the table
4. Use AEM Sidekick → "Convert to Block" → "Client Detail"

**Tips**:
- **Status** field accepts: Active, Inactive, Pending (automatically styled)
- **Logo** field: Paste image directly into the cell
- **AI Summary** can be multi-paragraph text
- Add any custom fields you need (Region, Budget, etc.)

**Standard Fields** (recognized and specially formatted):
- Client Name / Name / Company
- Status / Account Status
- Logo (image)
- AI Summary / Summary

**Custom Fields**:
You can add any additional fields. They'll appear in the details grid with automatic formatting.

---

### 3. AI Summary Block

**Purpose**: Display AI-generated insights, recommendations, and analysis

**How to Create**:

1. Add a heading: `## AI Insights`
2. Insert a table with section titles and content:

```
| Title             | Content                                              |
|-------------------|------------------------------------------------------|
| Key Insights      | • User engagement increased 15% month-over-month     |
|                   | • Session duration up significantly                  |
|                   | • Feature adoption exceeding projections             |
| Recommendations   | • Expand onboarding program                          |
|                   | • Schedule quarterly business review                 |
|                   | • Invest in analytics training                       |
| Risk Factors      | • Contract renewal upcoming in Q4 2024               |
|                   | • Budget constraints mentioned in QBR                |
```

3. Select the table
4. Use AEM Sidekick → "Convert to Block" → "AI Summary"

**Tips**:
- Use bullet points (•) or line breaks for multiple items
- Title column creates section headers
- Content automatically formats lists
- Timestamp is added automatically when published

**Formatting Content**:
- **Bullet lists**: Start lines with `•` or `-`
- **Multi-line**: Press Shift+Enter in table cells
- **Paragraphs**: Use regular line breaks

---

## Authoring Patterns

### Document Structure

A typical dashboard page structure:

```
Title: Unified Dashboard
[Metadata section if needed]

# Dashboard Title
Introduction paragraph explaining the dashboard

---

## Weekly Engagement Metrics
[Weekly Engagement Block Table]

---

## Client Overview
[Client Detail Block Table]

---

## AI-Generated Insights
[AI Summary Block Table]

---

## Additional Information
Regular content, images, and text
```

### Using Horizontal Rules
- Insert `---` (horizontal rule) to create section breaks
- Each section becomes a separate `<div>` when published
- Helps organize content visually

### Adding Images
- **In blocks**: Paste images directly into table cells
- **Outside blocks**: Insert images normally in the document
- Images are automatically optimized for web performance

### Updating Data

**For Spreadsheet-Based Data**:

1. Maintain your data in Google Sheets or Excel
2. Format as JSON or use a structured table
3. Link the spreadsheet as a data source
4. Blocks can fetch data automatically on page load

**Manual Updates**:

1. Open the document in Google Docs/SharePoint
2. Edit the table values directly
3. Save the document
4. Preview changes using AEM Sidekick
5. Publish when ready

## Publishing Workflow

### 1. Preview Your Changes

1. Make edits in your document
2. Click the AEM Sidekick extension
3. Click "Preview"
4. Review at: `https://main--{repo}--{owner}.aem.page/your-page`

### 2. Publish to Production

1. Verify preview looks correct
2. Click "Publish" in AEM Sidekick
3. Content goes live at: `https://main--{repo}--{owner}.aem.live/your-page`

### 3. Rollback if Needed

1. Open AEM Sidekick
2. Click "..." menu
3. Select "Unpublish" or revert to previous version

## Best Practices

### Content Management

✅ **DO**:
- Keep table structures consistent
- Use descriptive metric names
- Update AI summaries regularly
- Test in preview before publishing
- Use consistent date formats
- Include units in metric values (%, $, etc.)

❌ **DON'T**:
- Break table structure (blocks won't render correctly)
- Use merged cells (not supported)
- Include special characters in field names
- Leave required fields empty
- Mix data types in value columns

### Performance

- Limit tables to reasonable sizes (< 100 rows per block)
- Optimize images before inserting (< 500KB recommended)
- Use external data sources for large datasets
- Consider pagination for lengthy data

### Accessibility

- Use descriptive headings (H1, H2, H3)
- Add alt text to all images
- Write clear metric labels
- Ensure sufficient color contrast

## Troubleshooting

### Block Not Displaying

**Problem**: Block shows as plain table instead of formatted component

**Solution**:
1. Verify table structure matches the pattern exactly
2. Make sure you converted the table using AEM Sidekick
3. Check for typos in field names
4. Preview again after fixing

### Images Not Showing

**Problem**: Logo or images don't appear in published page

**Solution**:
1. Ensure image is pasted directly in document (not linked)
2. Check image file size (< 2MB recommended)
3. Use supported formats: JPG, PNG, WebP
4. Re-insert image if necessary

### Data Not Updating

**Problem**: Changes don't appear after publishing

**Solution**:
1. Clear browser cache and reload
2. Use AEM Sidekick "Reload" button
3. Verify you published (not just previewed)
4. Check if correct document is linked

### Styling Issues

**Problem**: Colors or layout look wrong

**Solution**:
1. Don't apply custom colors/fonts in the document
2. Let the block CSS handle styling
3. Report issues to development team
4. Use plain text formatting only

## Examples

### Complete Dashboard Page Example

See `dashboard.html` in the repository for a complete working example with all three blocks.

### Minimal Example

```
# My Dashboard

## Engagement
[Weekly Engagement Block - Table with 4 metrics]

## Client Info
[Client Detail Block - Table with 5 fields]
```

## Getting Help

- **Documentation**: Check the main README.md
- **Examples**: Review dashboard.html
- **Technical Issues**: Contact development team
- **Authoring Questions**: Refer to this guide

## Quick Reference

| Block Type         | Columns                    | Use Case                          |
|--------------------|----------------------------|-----------------------------------|
| Weekly Engagement  | Week, Metric, Value, Change| Display weekly performance metrics|
| Client Detail      | Field, Value               | Show client information           |
| AI Summary         | Title, Content             | Present AI-generated insights     |

---

**Last Updated**: January 2026  
**Version**: 1.0  
**Maintained By**: Development Team

# Date filtering semantics (Suggestion Lifecycle)

## Summary

| Level        | What is filtered / counted | Date field used | Where |
|-------------|----------------------------|------------------|--------|
| **Opportunity** | Which opportunities are "in range" (health, breakdown, table) | **Opportunity `createdAt`** only | `filter-state.js`: `filterByDateRange()` |
| **Suggestion**  | Trend chart + stat cards (Fixed, Rejected, etc.)              | **Suggestion** `createdAt` or `updatedAt` (see below) | `trend-data.js`: `buildTrendSeries()`, `getTrendTotals()` |

So: **opportunity-level** uses **createdAt** only. **Suggestion-level** uses **both** depending on the metric.

## Suggestion-level (trend chart and cards)

- **Created** – `suggestion.createdAt` (when the suggestion was created).
- **Fixed / Rejected / Skipped / Outdated / Error** – `suggestion.updatedAt` (when it reached that state).

If the API omits suggestion dates, we fall back to the **opportunity** `updatedAt` / `createdAt`, and we support both camelCase (`updatedAt`) and snake_case (`updated_at`).

So for "Rejected" in "Last 7 days", the card and chart count suggestions whose **rejection** happened in that range (suggestion `updatedAt` in range), not when the opportunity was created.

## Why the card was wrong before

- **Cards** were driven by **opportunity**-filtered metrics: "rejected count in opportunities **created** in the range" → e.g. 0 for Last 7 days if no opportunities were created then.
- **Chart** used **suggestion** `updatedAt` in the range → e.g. 92 rejected in last 7 days.

We fixed this by making the stat cards use **suggestion-level** totals from `getTrendTotals()` (same logic as the chart) and by normalizing suggestion dates and adding opportunity fallbacks in `trend-data.js`.

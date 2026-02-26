# ASO Dashboard Server

Backend for the Suggestion Lifecycle dashboard: portfolio opportunity metrics and snapshot-backed data.

## Run the server

```bash
npm install
npm run dev    # development (nodemon)
# or
npm start      # production
```

Server runs on `http://localhost:3001` by default (`PORT` env var overrides).

## Portfolio snapshot workflow

The Portfolio view can use a pre-built snapshot so it doesn’t hit SpaceCat for every request. Run the snapshot script, then start the server so it loads the data.

### 1. Generate the snapshot (first time or when you want to update)

From the `server/` directory:

```bash
npm run snapshot -- --token <YOUR_SPACECAT_TOKEN>
```

Or set the token in the environment:

```bash
SPACECAT_TOKEN=your_token_here npm run snapshot
```

This writes:

- `data/snapshots/global-YYYY-MM-DD.json` — all sites’ opportunities with per-opportunity `suggestionCounts` and `suggestionStates` (status + dates per suggestion for date-filtered “moved to” metrics). File size is larger than before due to `suggestionStates`.
- `data/snapshots/latest.json` — pointer to the current snapshot file

Portfolio “moved to” metrics (e.g. Moved to Fixed, Moved to Awaiting Customer Review in the selected range) and Customer Engagement use `suggestionStates` when present. Older snapshots without `suggestionStates` still work; those metrics then show current-state counts only.

**ASO-only (smaller, faster):** To limit the opportunity snapshot to ASO customer sites only (fewer API calls, smaller file), run the **customer snapshot first**, then run the opportunity snapshot with `--customers`:

```bash
npm run snapshot:customers -- --token <TOKEN>
npm run snapshot -- --token <TOKEN> --customers
```

With `--customers`, the script reads `data/snapshots/customers.json` and only fetches opportunities for those sites. If the file is missing or empty, it falls back to all sites. You can pass a path explicitly: `--customers path/to/customers.json`.

Optional: snapshot a single org only:

```bash
npm run snapshot -- --token <TOKEN> --org <ORG_ID>
```

(Output: `data/snapshots/org-<ORG_ID>-YYYY-MM-DD.json`. The server’s “latest” global snapshot is still used for portfolio; single-org is for local/backup use.)

### 2. Start the server

```bash
npm start
# or
npm run dev
```

On startup the server loads the snapshot from `data/snapshots/latest.json`. Portfolio “All Customers” (and single-org) requests then use this data with no extra SpaceCat calls for the snapshot period.

**Automatic merge when loading Portfolio:** If the requested date range extends past the snapshot date (e.g. "Last 7 days" and the snapshot is from two days ago), the server fetches new opportunity data from SpaceCat for the gap, merges it with the snapshot, and caches the merged result for 30 minutes. So each load that needs fresh data triggers one live fetch; subsequent requests for the same scope and range use the cache.

### 3. Refresh the snapshot later

When you want to update the data:

1. Run the snapshot again (same command as step 1).
2. Tell the running server to reload:

```bash
npm run snapshot:refresh -- --token <YOUR_SPACECAT_TOKEN>
```

This runs the snapshot script **and** POSTs to `http://localhost:3001/api/snapshot/reload` so the server picks up the new file without restarting.

If the server isn’t running locally, run only the snapshot; the next time you start the server it will load the new file.

## Customer snapshot

The dashboard customer dropdown can use a pre-built list of **ASO-only** customers and their sites so it shows ~100 orgs instead of 5000+ and loads quickly.

### 1. Generate the customer snapshot

From the `server/` directory:

```bash
npm run snapshot:customers -- --token <YOUR_SPACECAT_TOKEN>
```

Or set the token in the environment:

```bash
SPACECAT_TOKEN=your_token_here npm run snapshot:customers
```

This writes `data/snapshots/customers.json` (ASO-entitled orgs with sites). The script fetches all orgs and sites from SpaceCat, checks entitlements in batches, and keeps only orgs with an ASO entitlement. After this, you can run the **opportunity snapshot** with `--customers` (see Portfolio snapshot workflow above) so portfolio data only includes ASO sites.

### 2. How the dashboard uses it

The server serves this file via **`GET /api/customers`**. On load, the dashboard calls this endpoint first; if it returns a non-empty list, the customer dropdown is filled from it. If the endpoint is missing or returns empty, the dashboard falls back to building the customer list live from SpaceCat (same behavior as before).

### 3. Refresh the customer snapshot

Regenerate periodically (e.g. nightly) or on demand:

1. Run `npm run snapshot:customers -- --token <TOKEN>` again.
2. Optionally tell the running server to reload without restart:

```bash
curl -X POST http://localhost:3001/api/snapshot/reload-customers
```

The server also loads the customer snapshot on startup; if `customers.json` is present, it will be used for `GET /api/customers`.

## Environment

- `PORT` — Server port (default `3001`).
- `SPACECAT_TOKEN` — Used by `npm run snapshot` if you don’t pass `--token`.
- `SPACECAT_API_BASE` — SpaceCat API base URL (default `https://spacecat.experiencecloud.live/api/v1`).
- `CORS_ORIGIN` — Allowed origins for CORS (default includes `http://localhost:3000`).

## API

- `GET /api/health` — Server status and snapshot date (if loaded).
- `POST /api/snapshot/reload` — Reload opportunity snapshot from disk (no body).
- `GET /api/customers` — Customer snapshot (ASO-only orgs with sites). Returns `{ snapshotDate, generatedAt, customers }` or 404/empty so the client can fall back to live build.
- `POST /api/snapshot/reload-customers` — Reload customer snapshot from disk (no body).
- `GET /api/portfolio/opportunity-metrics?from=YYYY-MM-DD&to=YYYY-MM-DD&siteScope=global` — Portfolio metrics (query params: `siteScope=global`, `orgId`, or `siteIds`).

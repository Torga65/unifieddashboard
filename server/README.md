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

- `data/snapshots/global-YYYY-MM-DD.json` — all sites’ opportunities
- `data/snapshots/latest.json` — pointer to the current snapshot file

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

## Environment

- `PORT` — Server port (default `3001`).
- `SPACECAT_TOKEN` — Used by `npm run snapshot` if you don’t pass `--token`.
- `SPACECAT_API_BASE` — SpaceCat API base URL (default `https://spacecat.experiencecloud.live/api/v1`).
- `CORS_ORIGIN` — Allowed origins for CORS (default includes `http://localhost:3000`).

## API

- `GET /api/health` — Server status and snapshot date (if loaded).
- `POST /api/snapshot/reload` — Reload snapshot from disk (no body).
- `GET /api/portfolio/opportunity-metrics?from=YYYY-MM-DD&to=YYYY-MM-DD&siteScope=global` — Portfolio metrics (query params: `siteScope=global`, `orgId`, or `siteIds`).

# Sarang Naga — Execution Plan

Status: implemented locally; live activation requires Netlify environment values and deployment  
Target UI: `https://faizeffendi.online/sarang-naga`  
Target API: `GET https://faizeffendi.online/api/sarang-naga/status`  
Last updated: 2026-09-09

Implementation note: routing, dashboard UI, normalized API proxy, caching, polling, stale/error handling, and automated tests are complete in this repository. Production verification remains pending until `UPTIMEROBOT_API_TOKEN` and `UPTIMEROBOT_PORTFOLIO_MONITOR_ID` are configured in Netlify.

## 1. Source of truth and fixed decisions

Order of authority for this implementation:

1. This execution plan.
2. The current repository and its working behavior.
3. `DESIGN.md` for visual tokens and component language.
4. The original `custom-web-monitoring-plan.md` as background only.

Decisions that are already fixed:

- Sarang Naga is a page inside the existing portfolio app, not a second Vite project.
- The portfolio and Sarang Naga stay in one repository and one Netlify deployment.
- `/sarang-naga` is the browser page; it is not the data API.
- The browser calls only `/api/sarang-naga/status`.
- Privileged access to UptimeRobot happens only inside a Netlify Function.
- Use UptimeRobot API v3 with a read-only token.
- Keep the existing JavaScript/JSX + ESM stack. A TypeScript migration is outside V1.
- Use React Router for real client-side routes.
- Keep Vite's base path as `/`.
- Use a lightweight custom SVG chart; do not add Recharts in V1.
- `DESIGN.md` controls the visual system. Do not create a second dashboard theme.
- This is a public monitoring dashboard, not an independent incident status page. If the portfolio deployment or domain is unavailable, Sarang Naga will also be unavailable.

## 2. V1 goal

Build a public dashboard that:

- Shows an overall status: `operational`, `degraded`, `outage`, or `unknown`.
- Shows only explicitly approved public services.
- Shows current service status, 30-day uptime, response time, and the latest response sample timestamp.
- Shows a truthful 30-day availability bar and a 24-hour response-time chart.
- Refreshes automatically without overlapping requests.
- Handles loading, empty, partial, stale, and error states honestly.
- Matches the existing portfolio on desktop, tablet, and mobile.
- Preserves all existing portfolio behavior.

## 3. Non-goals for V1

Do not add:

- Grafana or an embedded UptimeRobot dashboard.
- VPS CPU, RAM, disk, Docker, database, or log monitoring.
- Web analytics.
- Authentication.
- Alert-management or incident-management UI.
- A second deploy, subdomain, reverse proxy, or new DNS configuration.
- TanStack Query, Recharts, or another chart library.
- A production fallback to mock data.
- Separate 1-day, 7-day, and 30-day uptime-ratio requests. V1 uses one rolling 30-day percentage because the official uptime statistics response does not include a time series.

## 4. Target architecture

```text
UptimeRobot
    |
    | read-only API v3
    v
Netlify Function
/.netlify/functions/sarang-naga-status
    |
    | normalized, cached JSON
    v
/api/sarang-naga/status
    |
    v
React page
/sarang-naga
```

The browser must never receive the UptimeRobot token or depend on the raw UptimeRobot response shape.

## 5. Planned repository structure

```text
src/
├── App.jsx
├── main.jsx
├── pages/
│   ├── PortfolioPage.jsx
│   ├── SarangNagaPage.jsx
│   └── NotFoundPage.jsx
├── components/
│   ├── SiteLayout.jsx
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   └── sarang-naga/
│       ├── OverallStatus.jsx
│       ├── SummaryMetrics.jsx
│       ├── ServiceCard.jsx
│       ├── ServiceStatusBadge.jsx
│       ├── UptimeHistory.jsx
│       ├── ResponseTimeChart.jsx
│       ├── MonitoringSkeleton.jsx
│       ├── MonitoringError.jsx
│       └── MonitoringEmpty.jsx
├── hooks/
│   └── useMonitoring.js
└── lib/
    ├── monitoringContract.js
    └── monitoringFormat.js

netlify/
├── config/
│   └── sarangNagaServices.js
├── functions/
│   └── sarang-naga-status.js
└── lib/
    ├── uptimeRobotClient.js
    └── normalizeMonitoring.js

test/
└── fixtures/
    └── uptimerobot-v3/

.env.example
netlify.toml
PLAN.md
```

Files may be colocated differently if the implementation stays modular and the public contract remains unchanged.

## 6. Public API contract

### Success response

```json
{
  "schemaVersion": 1,
  "generatedAt": "2026-09-09T03:00:00.000Z",
  "overallStatus": "operational",
  "summary": {
    "total": 2,
    "up": 2,
    "down": 0,
    "unknown": 0,
    "averageUptime30d": 99.98,
    "averageResponseTimeMs": 184
  },
  "services": [
    {
      "id": "portfolio",
      "name": "Portfolio",
      "url": "https://faizeffendi.online",
      "status": "up",
      "uptime": {
        "percentage": 99.98,
        "windowDays": 30
      },
      "responseTime": {
        "latestMs": 143,
        "average24hMs": 184
      },
      "lastResponseSampleAt": "2026-09-09T02:59:00.000Z",
      "history": {
        "responseTime": [
          {
            "timestamp": "2026-09-09T02:59:00.000Z",
            "valueMs": 143
          }
        ]
      }
    }
  ],
  "warnings": []
}
```

Contract rules:

- All timestamps are ISO 8601 UTC strings.
- `generatedAt` is when the proxy response was built.
- `lastResponseSampleAt` is the newest response-time sample, not a guaranteed timestamp for the latest availability check. It must never be replaced with `generatedAt`.
- Missing numeric data is `null`, never `0` and never `NaN`.
- Summary averages exclude `null`; if no usable values exist, the average is `null`.
- Uptime is rounded to two decimals; response time is rounded to whole milliseconds.
- `warnings` has the fixed shape `{ code, serviceId }`. Allowed V1 codes are `MONITOR_NOT_FOUND`, `UPTIME_UNAVAILABLE`, and `RESPONSE_TIME_UNAVAILABLE`; it never contains raw provider errors.
- Uptime history is not synthesized. V1 visualizes only the rolling 30-day uptime percentage returned by the provider.
- `history.responseTime` is chronological, deduplicated by timestamp, limited to the previous 24 hours, and deterministically bucket-averaged to at most 96 points.
- Summary averages are unweighted arithmetic means of the corresponding service-level values, exclude `null`, and are rounded only after aggregation.
- Services are returned in the order defined by the curated service configuration.

### Error response

```json
{
  "schemaVersion": 1,
  "generatedAt": "2026-09-09T03:00:00.000Z",
  "error": {
    "code": "UPSTREAM_UNAVAILABLE",
    "message": "Monitoring data is temporarily unavailable."
  }
}
```

HTTP behavior:

| Situation | Status | Error code |
|---|---:|---|
| Any query string is supplied | 400 | `INVALID_QUERY` |
| Unsupported method | 405 | `METHOD_NOT_ALLOWED` |
| Missing server configuration | 500 | `SERVER_MISCONFIGURED` |
| UptimeRobot rate limit | 503 | `UPSTREAM_RATE_LIMITED` |
| UptimeRobot authentication/permission failure | 502 | `UPSTREAM_AUTH_FAILED` |
| Timeout, network/provider failure, invalid payload | 502 | `UPSTREAM_UNAVAILABLE` |

Every error response uses `Cache-Control: no-store`. A 405 response also includes `Allow: GET`. Do not expose stack traces, tokens, request headers, upstream bodies, or private URLs.

### Provider status mapping

```text
UP                         -> up
LOOKS_DOWN, DOWN           -> down
PAUSED, STARTED, missing,
unrecognized               -> unknown
```

### Overall status calculation

Apply these checks in this exact order:

```text
total == 0       -> unknown
down == total    -> outage
down > 0         -> degraded
unknown > 0      -> unknown
up == total      -> operational
otherwise        -> unknown
```

An API/provider failure does not produce a success payload with `overallStatus: unknown`; it produces the non-2xx error envelope. The frontend then renders the effective status as unknown.

Partial-success rules:

- An empty but valid service allowlist returns HTTP 200 with `total: 0` and `overallStatus: "unknown"` without calling UptimeRobot.
- A missing token or syntactically invalid non-empty service configuration returns `SERVER_MISCONFIGURED`.
- If at least one configured monitor state is fetched successfully, failed monitors may remain in the success payload as `unknown` with safe warnings.
- If no monitor state can be fetched because of authentication, network, timeout, or provider failure, return the non-2xx error envelope instead of a success payload containing only unknown services.

## 7. Provider and security rules

- Use `https://api.uptimerobot.com/v3` and Bearer authentication.
- Create a read-only token; do not use an account token with write permissions.
- Store the token as `UPTIMEROBOT_API_TOKEN` in local and Netlify server environments.
- Never prefix the token with `VITE_`.
- Maintain a curated service allowlist in `netlify/config/sarangNagaServices.js`:

```js
export const services = [
  {
    id: 'portfolio',
    monitorId: 123456789, // Replace with the real positive integer ID.
    name: 'Portfolio',
    url: 'https://faizeffendi.online',
  },
]
```

- A monitor ID is configuration, not a secret. The allowlist keeps labels, URLs, order, and exposure deliberate.
- Never return monitors that are not in the allowlist.
- A configured monitor missing from UptimeRobot remains visible as `unknown` with null metrics and a safe warning.
- Validate configuration before any provider request: service slugs must be unique and non-empty, monitor IDs must be unique positive integers, and public URLs must be absolute HTTPS URLs. An empty list is a valid empty-dashboard state; any invalid non-empty entry is `500 SERVER_MISCONFIGURED`.
- The code may support up to three services, but production starts with one. Add services one at a time only after a measured cold-cache run remains at or below eight provider requests in a rolling minute. Do not claim multi-service Free-tier capacity from a theoretical call count alone.
- The intended minimum call budget is one monitor-list request plus one 30-day uptime request and one 24-hour response-time request per service: `1 + (2 × N)`. Pagination, retries, or provider changes may increase it.
- Use the current official v3 OpenAPI document when implementing exact monitor/statistics URLs and response fields. Do not guess field names.
- The intended call matrix is `GET /monitors`, one uptime-statistics request covering 30 days per service, and one response-time-statistics request covering 24 hours with time-series data per service. Confirm the exact URLs and parameters against the current OpenAPI specification during Phase 3.
- Follow cursor pagination only when the next URL stays on `api.uptimerobot.com` and inside `/v3/`.
- Use an approximately eight-second timeout per upstream request.
- Use an explicit concurrency limiter with at most two upstream requests running at once. Handle results with all-settled semantics; `Promise.allSettled` by itself is not a concurrency limiter.
- Enforce one total Function deadline in addition to per-request timeouts so sequential batches cannot consume the full platform execution window.
- If a metric call fails but current monitor state is known, keep the state, set that metric to `null`, and add a safe warning.
- Reject every query string before any provider request. The endpoint has no inputs, and arbitrary query parameters could otherwise create distinct CDN cache keys and exhaust the provider quota.
- Before shipping, measure a cold-cache request with the one production service. The request graph must leave headroom below the Free-plan limit. Repeat the measurement before adding each later service.

Local `.env`:

```env
UPTIMEROBOT_API_TOKEN=
UPTIMEROBOT_PORTFOLIO_MONITOR_ID=
```

`.env.example` contains only the empty variable name. Add these rules to `.gitignore`:

```gitignore
.env
.env.*
!.env.example
```

## 8. Caching and freshness

Successful function responses should include:

```http
Content-Type: application/json; charset=utf-8
Cache-Control: public, max-age=30, stale-while-revalidate=30
Netlify-CDN-Cache-Control: public, durable, s-maxage=120, stale-while-revalidate=300
```

Rules:

- Cache only successful, validated responses.
- Do not append cache-busting query parameters from the browser.
- The frontend refreshes every 60 seconds, but most requests may correctly receive cached data.
- The UI must show both provider `lastResponseSampleAt` and proxy `generatedAt` so freshness is understandable.
- UptimeRobot Free checks run approximately every five minutes; a 60-second UI refresh does not create a new external availability check.
- Forward a valid `Retry-After` value for provider rate limits without forwarding other raw headers.
- Durable caching reduces duplicate regional function executions but does not guarantee a single provider refresh. The per-fill call budget must therefore retain rate-limit headroom.

## 9. Netlify routing

Add `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[functions]
  directory = "netlify/functions"

[[redirects]]
  from = "/api/sarang-naga/status"
  to = "/.netlify/functions/sarang-naga-status"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

The API rewrite must remain above the SPA catch-all. Netlify evaluates the first matching rule. Adding `netlify.toml` can override equivalent settings in the Netlify UI, so confirm the existing build command and publish directory before the first deploy.

Required route behavior:

```text
/                 -> PortfolioPage
/sarang-naga      -> SarangNagaPage
unknown route     -> NotFoundPage
```

Keep `/sarang-naga` as the canonical page path. Direct navigation and refresh must work.

Unknown client routes render `NotFoundPage`, but Netlify still responds with HTTP 200 because the SPA fallback serves `index.html`. A true server-level 404 is outside V1.

## 10. Frontend behavior

### Routing and shared shell

- Install `react-router-dom`.
- Wrap the app with `BrowserRouter` in `src/main.jsx`.
- Move the current portfolio composition and `PdfModal` state from `App.jsx` to `PortfolioPage.jsx` without changing behavior.
- Make `App.jsx` define `/`, `/sarang-naga`, and `*` routes.
- Lazy-load `SarangNagaPage` so the monitoring feature has minimal effect on the homepage bundle. Provide a `Suspense` fallback on the portfolio canvas with a single `main-content` target.
- Reuse the existing `Navbar` and `Footer`.
- Keep native anchors for portfolio fragments and make them root-qualified: `/#about`, `/#projects`, `/#experience`, `/#capabilities`, and `/#contact`. Use router links only for page routes.
- Add a `Sarang Naga` link and apply `aria-current="page"` only to the active page-route link. Do not mark fragment links as the active page unless section tracking is deliberately implemented.
- Add `scroll-margin-top` matching the fixed 64-pixel navbar to every portfolio anchor target.
- Reset scroll to the top when navigating to `/sarang-naga` or another page route; preserve normal native hash scrolling for portfolio fragments.
- Add a skip link and one `<main id="main-content">` per page.
- Set `document.title` per route without adding another dependency.
- Keep all Sarang Naga interface copy in English to match the existing portfolio.

### Page hierarchy

```text
Navbar
└── Status hero (7/5 desktop grid)
    ├── Sarang Naga title and description
    └── Overall status telemetry panel

Summary metrics
└── Services (with up/down/unknown) / average uptime / average response time

Services
└── Service cards with status, 30-day uptime, response, latest sample, history

Response time
└── Service selector and responsive SVG chart

Footer
```

### Data hook

`useMonitoring.js` returns:

```js
{
  data,
  isInitialLoading,
  isRefreshing,
  isStale,
  error,
  refresh
}
```

Hook requirements:

- Fetch `/api/sarang-naga/status` on mount.
- Check `response.ok`, JSON `Content-Type`, `schemaVersion === 1`, and the minimum normalized payload shape.
- Use `AbortController`, clear the scheduled timeout, and clean up on unmount.
- Schedule the next refresh 60 seconds after the previous request finishes; do not use an interval that can overlap requests.
- Coalesce refresh attempts with an in-flight guard. Disable Retry while a request is running so React Strict Mode, a manual retry, and the scheduled refresh cannot create parallel requests.
- Initial failure shows the full error state.
- A background failure keeps the last successful data as context, marks it stale, and changes the displayed overall status to unknown.
- Also derive stale state from payload age. Treat a successful payload as stale when `generatedAt` is older than the complete CDN fresh-plus-stale window, currently 420 seconds.
- Retry triggers an immediate request.
- Never use fixtures as a silent production fallback.

Render safe warning codes through a curated copy map. One or more warnings show a nonfatal banner such as “Some metrics are temporarily unavailable”; never display a raw warning code or provider message to visitors.

### UI states

The following must be reproducible using fixtures or mocked fetch responses:

- Initial loading.
- All systems operational.
- Mixed up/down (degraded).
- All down (outage).
- Unknown/paused service.
- Empty allowlist response.
- Partial metrics with safe warnings.
- Initial API error.
- Stale data after a failed refresh.

Null values display as an em dash, not zero.

## 11. Visual implementation rules

Use runtime tokens in `src/index.css`; do not use the stale blue palette in `tailwind.config.js`.

- Canvas: `bg-canvas`.
- Panels: `bg-surface-card` or `bg-surface-soft`.
- Dividers: `border-hairline`.
- Brand emphasis: `primary` electric yellow.
- Headings: Inter 700 with negative tracking.
- Primary summary and uptime numbers: Inter 700 with negative tracking, matching the existing portfolio stat pattern.
- Telemetry labels, URLs, and timestamps: JetBrains Mono.
- Card radius: `rounded-lg`; button radius: `rounded-md`.
- Containers: `page-container` and `section-container`.
- No gradients, glow, glassmorphism, drop shadows, or pixel font.
- Use yellow for brand emphasis, not as an operational status color.
- Use green, orange, red, and gray only for semantic status.

Add missing runtime tokens already present in `DESIGN.md`:

```css
--color-warning: #f59e0b;
--color-error: #ef4444;
```

Status indicators always include text:

| Status | Token | Visible label |
|---|---|---|
| `up` / `operational` | `success` | Operational |
| `degraded` | `warning` | Degraded |
| `down` / `outage` | `error` | Outage |
| `unknown` | `muted` | Unknown |

The `DESIGN.md` references to ClickHouse, SQL, and its marketing navigation are visual reference material only. Do not copy that content into Sarang Naga.

Uptime history buckets use truthful percentage semantics:

```text
100%             -> success
0%               -> error
greater than 0
and below 100%   -> warning
null or invalid  -> muted/unknown
```

Accessible copy must describe the bucket percentage and time window; it must not claim a number of individual checks that the API did not provide.

## 12. Responsive and accessibility requirements

- The fixed-navbar page shell starts below the 64-pixel header (`pt-16`).
- Mobile `<768px`: one column, full-width chart, no horizontal page overflow.
- Summary metrics use a deterministic 2-by-2 grid and become four columns only when space permits; do not leave a fourth metric orphaned in a three-column row.
- Tablet `768–1024px`: services may use two columns.
- Desktop `>=1024px`: hero uses the portfolio's 7/5 grid; service cards use at most two columns.
- Test widths: 320, 375, 768, 1024, and 1440 px.
- Long URLs and timestamps use `min-w-0` plus safe word wrapping so they cannot force horizontal overflow.
- Do not hide essential information behind hover.
- Use semantic headings in order: `h1`, `h2`, then `h3`.
- Overall status and refresh messages use `aria-live="polite"`.
- Initial errors use `role="alert"`.
- Status is never communicated by color alone.
- SVG charts have an accessible name and summary; decorative segments are hidden from assistive technology.
- Do not add every time-series point to the Tab order. Use one chart focus target with arrow-key exploration/roving focus, or provide an accessible textual summary while pointer and touch expose tooltips.
- Honor the existing `prefers-reduced-motion` behavior; do not animate charts or counters.
- All important controls should meet a 44 by 44 pixel touch target.

## 13. Execution phases

### Phase 0 — Baseline and safety

- [ ] Create branch `feat/sarang-naga`.
- [ ] Run `npm.cmd ci`, `npm.cmd run lint`, and `npm.cmd run build` in this PowerShell workspace.
- [ ] In the current Codex runner, invoke Git as `git -c safe.directory=D:/all_project/personal_project/personal_portfolio_software ...`; do not modify global Git configuration without user approval.
- [ ] Record the current Git SHA and successful Netlify production deploy for rollback.
- [ ] Smoke-test root navbar, anchors, CV download, project links, PDF modal, images, and PDFs.
- [ ] Confirm Netlify UI uses build command `npm run build` and publish directory `dist`.

Gate: the existing portfolio passes before feature work begins.

### Phase 1 — Tooling, routing, and shell

- [ ] In this Windows PowerShell workspace use `npm.cmd install react-router-dom`.
- [x] Run `npm.cmd install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom`. The Netlify CLI remains an on-demand `npx` tool to avoid its current OpenTelemetry peer conflict with Vitest.
- [x] Add `"test": "vitest run"` and `"dev:netlify": "npx netlify dev"` scripts. Keep `npm run build` inside `netlify.toml` because Netlify builds in Linux.
- [ ] Add the Node/test-specific ESLint configuration needed for `netlify/**` and test files.
- [ ] Create `PortfolioPage`, route configuration, shared shell, and internal 404 page.
- [ ] Fix navbar links for cross-route navigation.
- [ ] Add the empty `/sarang-naga` page shell.
- [ ] Add `netlify.toml` with API-first redirect ordering.
- [ ] Add `.env` ignore rules and `.env.example`.
- [ ] Run the full site and Functions locally through `npm.cmd run dev:netlify`; `npm.cmd run dev` alone is not sufficient for API rewrite verification.

Gate:

- `/` renders the unchanged portfolio.
- `/sarang-naga` renders the page shell.
- Reloading `/sarang-naga` works through Netlify local development.

### Phase 2 — Contract, fixtures, and pure domain logic

- [ ] Add JSDoc types/constants for the normalized contract.
- [x] Add sanitized test responses shaped like the current v3 monitor, uptime-statistics, and response-time-statistics resources.
- [ ] Implement pure provider status mapping.
- [ ] Implement overall status and summary aggregation.
- [ ] Implement null-safe rounding and timestamp normalization.
- [ ] Define and test the fixed `{ code, serviceId }` warning schema.
- [x] Remove histogram normalization: the official v3 uptime-statistics schema exposes an aggregate percentage, not a time series.
- [ ] Unit-test all pure logic before making live provider calls.

Gate: all-up, mixed, all-down, unknown, empty, missing monitor, null metrics, and malformed payload tests pass.

### Phase 3 — UptimeRobot and Netlify Function

- [ ] Create the approved HTTP monitors in UptimeRobot.
- [ ] Create a v3 read-only token.
- [ ] Fill the curated service allowlist with real monitor IDs.
- [ ] Implement the v3 client from the current official OpenAPI spec.
- [ ] Implement trusted pagination, timeouts, safe error mapping, and sanitized logging.
- [ ] Implement the fixed request matrix: monitor list, one 30-day uptime request per service, and one 24-hour response-time request per service.
- [ ] Implement the function response, success caching, and no-store errors.
- [ ] Validate the curated service configuration before any upstream request.
- [ ] Reject query strings before any upstream request and add `Allow: GET` to 405 responses.
- [ ] Measure the one-service cold-cache request count and confirm it stays at or below eight provider requests in a rolling minute. Re-run this gate before adding every service.
- [ ] Test locally using `npm.cmd run dev:netlify`.

Gate: one production service returns the normalized contract, the measured cold-cache request count is at most eight per rolling minute, the API path returns JSON rather than SPA HTML, and no unapproved service or secret is exposed.

### Phase 4 — Dashboard UI

- [ ] Build the status hero and overall status.
- [ ] Build a 2-by-2/four-column summary grid using the existing hero telemetry pattern; show up, down, and unknown counts in the service tile.
- [ ] Build accessible service cards and status badges.
- [ ] Build the uptime strip from percentage buckets without inventing checks.
- [ ] Build the responsive SVG response-time chart and service selector.
- [ ] Implement formatters for percentages, milliseconds, absolute time, and relative time.
- [ ] Implement loading, empty, partial, error, retry, refresh, and stale states.
- [ ] Add route-specific document titles.

Gate: every UI state is testable using fixtures and no state falsely claims operational health.

### Phase 5 — Integration and hardening

- [ ] Connect `useMonitoring` to the real internal API.
- [ ] Verify the 60-second non-overlapping refresh cycle, in-flight coalescing, timeout cleanup, and abort cleanup.
- [ ] Test invalid query, 405 plus `Allow`, missing env, 401/403, 429, timeout, malformed JSON, and partial metric failures with mocked upstream responses. Do not deliberately exhaust the live UptimeRobot quota.
- [ ] Test a cached HTTP 200 payload whose `generatedAt` has crossed the 420-second stale threshold.
- [ ] Confirm success responses have CDN caching and errors use `no-store`.
- [ ] Search `dist`, client network responses, and logs for the token or raw provider data.
- [ ] Run accessibility, responsive, console, and portfolio regression checks.
- [ ] Run `npm.cmd run lint`, `npm.cmd test`, and `npm.cmd run build`.

Gate: all automated and manual release checks pass.

### Phase 6 — Deploy Preview and production

- [ ] Set `UPTIMEROBOT_API_TOKEN` in Netlify Production and Deploy Preview contexts.
- [ ] Deploy a preview and test direct URLs, refreshes, API content type, and cache headers.
- [ ] Re-run the complete portfolio regression checklist in the preview.
- [ ] Publish production only after the preview passes.
- [ ] Smoke-test root, `/sarang-naga`, the API, navbar hash links, assets, and PDF modal in production.
- [ ] Watch function logs for at least one full UptimeRobot check cycle.

Gate: Definition of Done is complete.

## 14. Verification checklist

### Automated

- [ ] `npm.cmd run lint`
- [ ] `npm.cmd test`
- [ ] `npm.cmd run build`
- [ ] Mapping and aggregate tests cover every known status.
- [ ] All-down resolves to `outage`, not `degraded`.
- [ ] Averages never become `NaN`.
- [ ] Only allowlisted services are serialized.
- [ ] Invalid service configuration fails before any provider request.
- [ ] Query strings are rejected without bypassing the cache or calling the provider.
- [ ] Unsupported methods return 405 with `Allow: GET`.
- [ ] Missing env and provider errors return safe non-2xx JSON.
- [ ] A partial success is returned only when at least one configured monitor state was fetched successfully.
- [ ] Success responses are cacheable; errors are not.
- [ ] The API token is absent from `dist`.

### Routing and integration

- [ ] `/` renders the portfolio.
- [ ] `/#projects` and other root anchors work from both routes.
- [ ] `/sarang-naga` works through navigation, direct visit, reload, back, and forward.
- [ ] `/sarang-naga/` behaves consistently with the canonical route.
- [ ] Unknown routes render the intentional internal 404 page.
- [ ] `/api/sarang-naga/status` returns JSON, never `index.html`.

### UI and accessibility

- [ ] Loading state does not cause extreme layout shift.
- [ ] Empty/error states include an understandable message and retry action.
- [ ] Stale data is clearly marked.
- [ ] Null data displays as an em dash.
- [ ] Every status has visible text.
- [ ] Keyboard order and visible focus are correct.
- [ ] Chart controls and service links are keyboard-accessible.
- [ ] Time-series points do not create hundreds of Tab stops.
- [ ] No important data is hover-only.
- [ ] No horizontal overflow exists at 320 px.
- [ ] No new console or React warnings appear.

### Portfolio regression

- [ ] Hero and all existing sections render unchanged.
- [ ] Navbar and mobile menu work.
- [ ] CV download works.
- [ ] Project filtering and external links work.
- [ ] PDF modal opens and closes correctly.
- [ ] Existing images, PDFs, fonts, and favicon load.

### Production

- [ ] `https://faizeffendi.online/` returns the portfolio.
- [ ] `https://faizeffendi.online/sarang-naga` returns the dashboard and survives reload.
- [ ] The public API returns the documented schema and correct content type.
- [ ] Cache headers are visible on successful API responses.
- [ ] Data updates after the next provider check cycle.
- [ ] Function logs show no repeated 401, 429, timeout, or secret leakage.

## 15. Rollback plan

Rollback immediately if:

- The root portfolio or its assets regress.
- The API path returns SPA HTML or repeated 5xx responses.
- A secret appears in the bundle, network response, or logs.
- Provider failure is displayed as operational.
- Direct route refresh breaks production.

Procedure:

1. Republish the previously recorded successful Netlify deploy.
2. Revert the Sarang Naga merge/commit so the next Git deploy does not reintroduce the issue.
3. If a token leaked, revoke and rotate it immediately; code rollback is not enough.
4. Re-test the root portfolio, navbar, public assets, and PDFs.
5. Leave UptimeRobot monitors running unless their configuration caused the incident.

## 16. Definition of Done

- [ ] The existing portfolio and Sarang Naga run in one Vite app and one Netlify site.
- [ ] `/sarang-naga` works by navigation, direct visit, and reload.
- [ ] `/api/sarang-naga/status` returns normalized JSON.
- [ ] API routing is evaluated before the SPA catch-all.
- [ ] The homepage and all existing interactions still work.
- [ ] At least one public service is monitored; no unapproved service is exposed.
- [ ] The read-only token is stored only in ignored local environment files and Netlify environment variables, referenced only by server-side Function code, and absent from client bundles, responses, and logs. Use Functions-only Netlify scope when the account supports scoped variables.
- [ ] Overall status, service status, 30-day uptime, response time, latest response sample, and history render correctly.
- [ ] Loading, empty, partial, error, retry, refresh, and stale states exist.
- [ ] Operational, degraded, outage, and unknown logic is covered by tests.
- [ ] Refresh runs every 60 seconds without overlap.
- [ ] Success responses are cached and errors are not.
- [ ] The UI follows `DESIGN.md`, is responsive, and communicates status without relying on color alone.
- [ ] Lint, unit tests, production build, routing QA, security QA, and portfolio regression QA pass.
- [ ] Deploy Preview and production smoke tests pass.
- [ ] The same-deployment limitation is accepted for V1.

## 17. Suggested commit sequence

```text
chore: add sarang naga routing and netlify configuration
test: add monitoring contract fixtures and domain tests
feat: add uptime robot monitoring function
feat: build sarang naga monitoring dashboard
test: harden monitoring states and portfolio regression
docs: finalize sarang naga deployment runbook
```

## 18. References

- `DESIGN.md`
- UptimeRobot API v3: https://uptimerobot.com/api/v3/
- UptimeRobot v3 OpenAPI: https://github.com/uptimerobot/uptimerobot-cli/blob/main/openapi/openapi.yaml
- UptimeRobot v3 announcement: https://uptimerobot.com/blog/introducing-the-uptimerobot-v3-api/
- UptimeRobot Free-plan interval: https://help.uptimerobot.com/en/articles/11360876-what-is-a-monitoring-interval-in-uptimerobot
- Netlify JavaScript SPA routing: https://docs.netlify.com/build/configure-builds/javascript-spas/
- Netlify redirects and rule order: https://docs.netlify.com/manage/routing/redirects/overview/
- Netlify caching: https://docs.netlify.com/build/caching/caching-overview/

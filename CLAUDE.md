# CLAUDE.md - Document Authoring Platform Developer Guide

This file provides critical build commands, architecture guides, and coding guidelines for the request-time composing Document Authoring Platform.

## Build and Dev Commands

### Docker Compose Dev Server
The stack runs **three** services:
* **Build and Boot Services**: `docker-compose up --build -d`
* **Stop Services**: `docker-compose down`
* **View Web Engine Logs**: `docker-compose logs -f web-engine`
* **Verify Production Build inside Container**: `docker-compose exec web-engine npm run build`
* The `web-engine` container runs `npm run build && npm run preview` (production build, not dev server).

### Performance & Verification Tests
* **Run Local Benchmark Query**: `node scratch/test_server.mjs`
* **CDN Simulator Port**: `http://localhost:8080` (serves raw HTML/CSS/JS assets via `cdn-simulator`)
* **Image Optimizer Port**: `http://localhost:3002` (Sharp-based WebP resizing via `apps/image-optimizer`)
* **Astro SSR Port**: `http://localhost:3001` (serves the Edge Composed site via `web-engine`)

### Local Dev (outside Docker)
* `cd apps/web-engine-project && npm run dev` — Astro dev server on port 3001.
* `npm run debug-doc` — runs `debug-doc.ts` to inspect the raw Google Doc structure (paragraphs, tables, styles) returned by the Docs API.

---

## Coding Guidelines and Constraints

### 1. Zero-Compile Constraint (Core Assets)
* All core templates inside `core-assets-pipeline/src/` **must remain raw browser-native files**.
* Do **NOT** introduce compilation, packaging, or transpilation tools (Webpack, Vite, Rollup) inside `core-assets-pipeline/`.
* Styling must use separate `.css` files rather than embedded `<style>` blocks (e.g. `Hero.html` is accompanied by `Hero.css`).

### 2. Client Interactivity Rules
* Client-side scripting must remain pure Vanilla JS (ES Modules) to ensure a perfect 100 Lighthouse performance score.
* Do **NOT** install React, Vue, or Svelte libraries unless building specialized Custom Elements (Web Components) compiled into standalone micro-frontend bundles.

### 3. Server-Side Rendering (Astro SSR)
* Astro is configured in SSR mode (`output: 'server'` in `astro.config.mjs`).
* All component files and CDN stylesheets are retrieved using Stale-While-Revalidate (SWR) caching logic (`assetFetcher.ts`) to keep server composition times **under 5ms**.
* Auto-generate Schema.org JSON-LD scripts dynamically inside `[...slug].astro` for rich-result pages (like `FAQ` or `HowTo`).
* External raster images (JPEG/PNG) referenced in content are routed through the Image Optimizer microservice via `optimizeImageUrl()` / `generateSrcset()` in `[...slug].astro`; SVGs and local paths bypass it.

---

## Content Model (Google Docs)

* Authors write component tables (Hero, ServicesGrid, Metrics, FAQ, etc.) directly inside a Google Doc.
* `contentProvider.ts:getPageAST()` fetches the doc via the Google Docs/Drive APIs and `docParser.ts` parses paragraphs, tables, and inline styles into a `Block` AST (`PageContent`) consumed by `[...slug].astro`.
* The `globant-demo` slug maps to the doc identified by the `GOOGLE_DOC_ID` env var; other slugs are resolved by filename within `GOOGLE_DRIVE_FOLDER_ID`.
* Required setup: a Google Service Account credentials JSON at `apps/web-engine-project/service-account.json`, plus env vars `GOOGLE_DOC_ID`, `GOOGLE_DRIVE_FOLDER_ID`, `GOOGLE_APPLICATION_CREDENTIALS` (set in root `.env`, consumed by `docker-compose.yml`).

## Caching & Revalidation

* Two independent SWR caches, each with their own freshness window:
  * `assetFetcher.ts` — caches raw CDN component HTML/CSS/JS (10s fresh TTL).
  * `contentProvider.ts` — caches the parsed Google Doc AST per slug (`clearDocCache`).
* `apps/web-engine-project/pre_warm.js` primes both caches by requesting `/globant-demo` ~8s after container boot.
* `POST /api/revalidate` (in `src/pages/api/revalidate.ts`) clears one or both caches. It accepts either a `?slug=`/`?clearAll=true` query, or a Google Drive push-notification webhook (`x-goog-channel-id` / `x-goog-resource-state` headers). Optionally gated by the `REVALIDATE_SECRET` env var (checked via `?secret=` or `x-revalidate-secret` header).

---

## Directory Architecture
```
/
├── core-assets-pipeline/         # Raw component layouts pushed straight to CDN
│   ├── .github/workflows/        # CI/CD pipelines (sync.yml pushes src/ to the edge CDN)
│   └── src/                      # Component HTML, CSS, and JS files
├── apps/
│   ├── image-optimizer/          # Sharp-based WebP resizing microservice (port 3002)
│   └── web-engine-project/       # Astro SSR composing engine (port 3001)
│       ├── src/
│       │   ├── pages/            # Catch-all router [...slug].astro + api/ (revalidate, drive-image)
│       │   └── utils/            # ContentProvider, DocParser, AssetFetcher, Renderer
│       ├── pre_warm.js           # Boot-time cache warming
│       └── Dockerfile            # Dev-mount container
└── scratch/                      # Benchmark and test simulators
```

<!-- kg:start - managed by knowledge-graph-poc, safe to remove this block -->
# Knowledge Graph Project Rules

This project has a knowledge graph index at `.knowledge-graph-poc/graph.db`.
Always use the MCP tools below instead of reading files directly — they use ~10× fewer tokens.

## Mandatory first step

**Always call `get_minimal_context` at the start of every session** with a brief description of the task.
It returns ~150 tokens of project context (hubs, hot files, owner map) that informs every subsequent tool call.

## Tool usage priority

1. `get_minimal_context` — start here, always
2. `localize` — when debugging; returns ranked candidates, not file contents
3. `recall_lessons` — check for previously solved similar bugs before reading code
4. `impact_radius` — before changing anything, know what breaks
5. `query_graph` — for structural questions (who calls X, what implements Y)
6. `search_code` — for keyword/semantic search when you don't know where to look
7. `get_snippet` — to read a specific function/component; always pass `max_tokens`
8. `get_owners` — when you need to know who to ping for review
9. `get_contracts` — when changing an API endpoint

## Do NOT

- Read full files with the Read tool unless `get_snippet` is insufficient
- Grep the entire codebase — use `search_code` instead
- Open >3 files without first calling `impact_radius`

## Slash commands

- `/kg:localize <symptom>` — find likely bug location
- `/kg:impact <file>` — blast radius analysis
- `/kg:tour` — architectural overview
- `/kg:why <file>` — history and intent
- `/kg:lesson` — record or recall lessons
<!-- kg:end -->

# CLAUDE.md - Document Authoring Platform Developer Guide

This file provides critical build commands, architecture guides, and coding guidelines for the request-time composing Document Authoring Platform.

## Build and Dev Commands

### Docker Compose Dev Server
* **Build and Boot Services**: `docker-compose up --build -d`
* **Stop Services**: `docker-compose down`
* **View Web Engine Logs**: `docker-compose logs -f web-engine`
* **Verify Production Build inside Container**: `docker-compose exec web-engine npm run build`

### Performance & Verification Tests
* **Run Local Benchmark Query**: `node scratch/test_server.mjs`
* **CDN Simulator Port**: `http://localhost:8080` (serves raw HTML/CSS/JS assets)
* **Astro SSR Port**: `http://localhost:3000` (serves the Edge Composed site)

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

---

## Directory Architecture
```
/
├── core-assets-pipeline/         # Raw component layouts pushed straight to CDN
│   ├── .github/workflows/        # CI/CD pipelines
│   └── src/                      # Component HTML, CSS, and JS files
├── apps/
│   └── web-engine-project/       # Astro SSR composing engine
│       ├── src/
│       │   ├── pages/            # Catch-all router [...slug].astro
│       │   └── utils/            # ContentProvider, DocParser, AssetFetcher, Renderer
│       └── Dockerfile            # Dev-mount container
└── scratch/                      # Benchmark and test simulators
```

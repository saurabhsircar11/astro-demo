# Project Execution Checklist: Astro SSR Document Authoring Platform POC

- [x] **Phase 1: Project Scaffolding & Setup**
  - [x] Initialize repository structure (`core-assets-pipeline/`, `apps/web-engine-project/`)
  - [x] Configure Astro web-engine `package.json`, `astro.config.mjs` in SSR mode
  - [x] Create Docker environment (`Dockerfile` for Astro, `docker-compose.yml` to orchestrate Astro and local Nginx/CDN simulator)

- [x] **Phase 2: Core Assets Pipeline (CDN)**
  - [x] Create global styles (`core-assets-pipeline/src/index.css`) with Globant-inspired dark mode styling and typography
  - [x] Create `core-assets-pipeline/src/Hero.html` & `core-assets-pipeline/src/Hero.css`
  - [x] Create `core-assets-pipeline/src/ServicesGrid.html` & `core-assets-pipeline/src/ServicesGrid.css`
  - [x] Create `core-assets-pipeline/src/Metrics.html` & `core-assets-pipeline/src/Metrics.css`
  - [x] Create `core-assets-pipeline/src/FAQ.html` & `core-assets-pipeline/src/FAQ.css`
  - [x] Create `core-assets-pipeline/src/FAQ.js` for accordion interactivity logging

- [x] **Phase 3: The Google Doc & AST Content Provider**
  - [x] Implement `src/utils/contentProvider.ts` with standard interface
  - [x] Implement `src/utils/docParser.ts` for parsing headings, rich text formatting, inline images, and metadata blocks
  - [x] Integrate mock fallback payload mimicking a premium Globant-style page structure (for testing without API keys)

- [x] **Phase 4: SWR Caching & Dynamic Composition**
  - [x] Implement `src/utils/assetFetcher.ts` with in-memory Stale-While-Revalidate caching (target < 5ms lookups)
  - [x] Create `src/pages/[...slug].astro` dynamic route
    - [x] Dynamic meta, OpenGraph, and Geo tags injection in `<head>`
    - [x] AST parsing and sequential component stitching
    - [x] Auto-generation of JSON-LD Schema (e.g. `FAQPage` for FAQ) in `<head>`
    - [x] Aggregated style and client script injection
    - [x] Decouple global styling by fetching `index.css` dynamically from the CDN and inlining it

- [x] **Phase 5: Live Integration & Verification**
  - [x] Connect Google Service Account and test with a shared Google Drive folder (`1SuWQ9MJmfzJzhRD20bnV3A5ejIf8zVfy`)
  - [x] Enable Google Drive and Google Docs APIs in the GCP Project Console
  - [x] Resolve Google Docs API field mapping discrepancy (`doc.body.content` vs `doc.body.structuralElements`)
  - [x] Verify Dynamic Slug Routing (`/globant-demo` mapping to Google Doc ID `1VvQ0mb-e2J1qBD24f3geBcnqU28ep8eZDLzOKSVOIw4`)
  - [x] Implement accordion open telemetry reporting (`core-assets-pipeline/src/FAQ.js` logging expands to console)
  - [x] Execute benchmark scripts verifying in-memory SWR cached response times are **~2-8ms** on average

- [x] **Phase 6: Image Optimization API Route & Responsive Integration (Internal)**
  - [x] Implement self-hosted dynamic image optimization route `/api/image` with `sharp`
  - [x] Implement persistent disk cache for processed WebP images
  - [x] Update component layouts (`Hero.html`, `TwoColumn.html`, `StudioCards.html`) and LCP preloading to use `srcset`/`sizes`

- [x] **Phase 7: Decouple Image Optimizer into a Dedicated Microservice**
  - [x] Create `apps/image-optimizer/package.json` with `sharp` dependency
  - [x] Implement `apps/image-optimizer/server.js` (native HTTP node server, caching, whitelisting)
  - [x] Create `apps/image-optimizer/Dockerfile`
  - [x] Delete `apps/web-engine-project/src/pages/api/image.ts` from Astro
  - [x] Modify `docker-compose.yml` to define `image-optimizer` service and set `IMAGE_OPTIMIZER_URL` in `web-engine`
  - [x] Update URL helpers in `[...slug].astro` to map image endpoints to port `3002`
  - [x] Verify execution by building and running the containers and testing image/HTML output

- [x] **Phase 8: Critical Rendering Path (CRP) & Font Loading Optimizations**
  - [x] Remove render-blocking `@import` from `core-assets-pipeline/src/index.css`
  - [x] Implement asynchronous, non-blocking font loading in `[...slug].astro`
  - [x] Add preconnect resource hints for `IMAGE_OPTIMIZER_URL`
  - [ ] Verify FCP and LCP improvements via Lighthouse auditing


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

- [x] **Phase 9: Zero-Config Extensible Page Composition Refactoring**
  - [x] Rename component assets inside `core-assets-pipeline/src/` to lowercase kebab-case naming standard (e.g. `studio-cards.html`)
  - [x] Implement dynamic list table column mapping in `docParser.ts` (using row headers for list component keys)
  - [x] Add cell image URL extraction in `resolveCellValue` for inline pasted images in Google Docs
  - [x] Remove component-specific checks from `[...slug].astro` rendering loop
  - [x] Implement recursive schema-free image optimization scanner and dynamic LCP image preloading
  - [x] Update Google Doc populator script (`populate_doc.mjs`) to write kebab-case table names and list headers
  - [x] Repopulate active Google Doc and verify flawless composition of `/globant-demo` under 30ms response times

- [x] **Phase 8: Critical Rendering Path (CRP) & Font Loading Optimizations**
  - [x] Remove render-blocking `@import` from `core-assets-pipeline/src/index.css`
  - [x] Implement asynchronous, non-blocking font loading in `[...slug].astro`
  - [x] Add preconnect resource hints for `IMAGE_OPTIMIZER_URL`
  - [x] **Phase 10: Grid-Based Positional Authoring**
  - [x] Refactor `docParser.ts` to map cell values strictly to `cell_r_c` variables
  - [x] Simplify `hero.html` and `two-column.html` to consume full HTML blocks directly
  - [x] Create cell-to-item parser (`parseCellToItem`) resolving images, titles, descriptions, and links from single cell contents
  - [x] Configure list components (`studio-cards`, `logo-scroll`) to build clean `items` from grid cells under positional layout
  - [x] Create fallback for raw image URLs and SVG logo extraction to bypass Google Doc inline SVG constraints
  - [x] Refactor and update `populate_new_authoring.mjs` script to write visual grids with bolding and inline image attachments
  - [x] Verify rendering on `localhost:3001/globant-demo-new-authoring` returns 200 OK and correctly formatted markup

- [x] **Phase 11: Decoupled Native Headings and FAQ Integration**
  - [x] Support native `updateParagraphStyle` requests inside `populate_new_authoring.mjs`
  - [x] Configure positional `faq` table definition inside populator content
  - [x] Update `faq.css` to target `.faq__header > h2` and `.faq__header > p`
  - [x] Update `hero.css` to target `.hero__content > p:first-of-type` and `.hero__content > p:nth-of-type(2)`
  - [x] Rebuild Astro engine and verify visual rendering on `localhost:3001/globant-demo-new-authoring`
  - [x] Upgrade `renderer.ts` to strip Handlebars comments and convert Logo Scroll comment to clean HTML comment
  - [x] Fix nested h2 elements in logo-scroll.html by converting the outer h2 tag to a div class="logoscroll__title"

- [x] **Phase 12: Globant Homepage Replica**
  - [x] Add `'case-study'` to the positional list components array in `docParser.ts`
  - [x] Create `disclaimer.html` and `disclaimer.css` inside `core-assets-pipeline/src/`
  - [x] Create `case-study.html`, `case-study.css`, and `case-study.js` inside `core-assets-pipeline/src/`
  - [x] Update `GLOBANT_MOCK_PAYLOAD` in `contentProvider.ts` to contain the full suite of homepage replica components
  - [x] Update the `populate_new_authoring.mjs` script with the full set of replica components (Disclaimer, Hero, Two-Column AI Pods, Studio-Cards AI Studios, Logo-Scroll, Metrics, Services-Grid Core Studios, Case-Study Success Stories, Two-Column Careers, Two-Column Be Kind, FAQ)
  - [x] Run the populator script to update the live Google Doc `globant-demo-new-authoring`
  - [x] Rebuild and restart the container services to load the new assets
  - [x] Update `test_server.mjs` to verify presence of the new replica components
  - [x] Run benchmark tests and verify correct HTML composition and performance




- [x] **Phase 16: Live-Site Evaluation & Full Componentization**
  - [x] Build `scratch/capture.mjs` (Playwright + system Chrome) to screenshot live globant.com (past the Incapsula bot wall) and the replica at 1440px/390px
  - [x] Convert hardcoded header/footer in `[...slug].astro` into authored CDN components (`header.html/.css/.js`, `footer.html/.css`) driven by positional Google Doc tables
  - [x] Rewrite `renderer.ts` conditional parsing: balanced nested `{{#if}}` + real `{{else}}` support (fixes leaked template syntax and double-rendered hero/contact media)
  - [x] Fix `{{{label}}}` triple-brace leak in `metrics.html`
  - [x] Close live-site drift: dark disclaimer, headingless white metrics band, centered Let's Connect pill, light Be Kind, light contact-form card, live footer content (Contact Us / Follow Us / newsletter / legal bar), FAQ removed
  - [x] Fix two-column eyebrow rule (`p:first-child`) and add `center` variant CSS
  - [x] Update `scratch/test_server.mjs` (18 markers incl. header/footer + no-template-leaks) — all pass, warm SSR 26–46ms
  - [x] Interactivity spot-checks pass: sticky header, case-study carousel, mobile hamburger; mobile width clean at 390px
- [x] **Phase 17: Exact CSS Parity Pass**
  - [x] Extract live design tokens from `scratch/globant_combined.css` (Heebo, #bfd732/#8cc63f/#d9e021/#6daa52, button specs)
  - [x] Swap site typeface to Heebo (index.css tokens + async Google Fonts link in `[...slug].astro`)
  - [x] Rebuild `.btn--primary` as live `primary-square-large` (gradient, .8rem radius) and `.btn--secondary` as live `cta-primary` (white outline pill)
  - [x] Move "Find your industry" CTA below the studios grid via `ctaText`/`ctaUrl` key-value rows in the positional table
  - [x] Match live section specs: hero h1 6.4rem, h2 scale 4.8rem, accelerators-card cards, services card anatomy (image + divider + description, no Know-more), metrics 4.2rem values
  - [x] New `scratch/probe_styles.mjs` computed-style verifier — 16/16 checks pass; test_server 18/18 markers; spotcheck pass

# Future Project Milestones

Below is the updated roadmap from the proof-of-concept to a fully-scaled enterprise document authoring solution.

### 🏁 Milestone 1: Local Proof of Concept (Completed)
- [x] Scaffold local Astro SSR engine and simulated Nginx CDN.
- [x] Support raw HTML layout assets, separate component CSS, and uncompiled JS.
- [x] Implement in-memory Stale-While-Revalidate (SWR) cache (< 5ms rendering RT).
- [x] Parse Google Docs metadata tables, rich formatting, headings, and fallback mocks.

### 🚀 Milestone 2: Live Integration & Telemetry (Completed)
- [x] Connect live Google Service Account and test with a shared Google Drive folder.
- [x] Implement analytics/telemetry scripts (e.g. in `faq.js`) to capture user interactions (scroll, click, accordion expands) and log to console/API.
- [x] Deploy Astro SSR engine locally inside container ecosystem representing production composition.

### 🔒 Milestone 3: Keyless Security & Performance (Completed)
- [x] Set up an automated image optimization layer (a dedicated `image-optimizer` microservice utilizing `sharp` on port `3002`) to convert Google-hosted and external image URLs to compressed `.webp` formats on the fly.
- [x] Update CDN HTML layout templates (`two-column.html`, `studio-cards.html`, etc.) to use responsive `srcset` and `sizes` attributes for dynamic, device-specific resolution mapping.

### 🎨 Milestone 4: Cloud Deployment & Live Webhook Integration (Next Step)
- [ ] Provision a cloud staging environment (e.g., Google Cloud Run) for the web engine.
- [ ] Configure the live GCP Service Account with IAM permissions for the staging environment (Workload Identity).
- [ ] Set up HTTPS and domain verification to register the `/api/revalidate` webhook with Google Drive API.
- [ ] Implement a setup script or documentation to establish the Google Drive Watch API channel for folder updates.

### 📦 Milestone 5: S3 Migration & Visual CMS Dashboard (1-2 Months)
- [ ] Set up Cloudflare R2 / AWS S3 buckets to host the template CDN.
- [ ] Create the `S3Provider` content adapter to read compiled AST JSON payloads directly from S3.
- [ ] Build a lightweight drag-and-drop visual component builder that compiles page layouts and saves them as AST JSON to S3, bypassing Google Docs.

### 🧱 Milestone 6: Micro-Frontends & Island Hydration (2-3 Months)
- [ ] Support complex framework components (React, Vue, Svelte) using Astro Islands.
- [ ] Configure bundler tasks to compile framework components into unified Web Component scripts.
- [ ] Implement client-side dynamic hydration of CDN-hosted framework modules.

# Astro SSR Document Authoring Platform

A multi-project, request-time composing Document Authoring Platform using **Astro SSR**, **Google Docs API**, and a **No-Compile Vanilla JS Component CDN**. 

It enables content creators to author complete landing pages (including headings, rich text styling, and images) directly inside Google Docs tables, which are parsed and composed on-the-fly at the edge with static layout templates in **under 5ms**.

---

## Architectural Overview

```
                      +-----------------------------+
                      |         Google Doc          |
                      |  (Metadata & Component Tables)
                      +--------------+--------------+
                                     |
                                     v
                       +---------------------------+
                       |   Google Docs API Parser  |
                       |  (Paragraphs & TextRuns)  |
                       +--------------+--------------+
                                     |
                                     v
+-------------------+      +---------v---------+
|     Asset CDN     | ---> | Astro SSR Engine  | ---> Fully Stitched HTML
| (HTML, CSS, JS)   |      |   (SWR Caching)   |      (Zero Framework Footprint)
+-------------------+      +-------------------+
```

1. **Content Capture**: Authors write standard tables in a Google Doc representing components (e.g. `Hero`, `ServicesGrid`, `Metrics`, `FAQ`).
2. **AST Parser**: The server parses Google Docs cells, transforming rich formatting styles (weights, sizes, links, inline images) and headings into standard semantic HTML.
3. **Decoupled CDN**: Static layout files are pushed directly from the asset pipeline (`core-assets-pipeline/`) to an Edge CDN. No compilation is required.
4. **Edge Composition (Astro SSR)**: The Astro rendering engine dynamically fetches layouts from the CDN and stitches them with the content AST. Styles are aggregated and inlined into a single `<style>` block in the `<head>` to avoid rendering blockages.

---

## Getting Started

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (ensure the Docker daemon is running).
- Node.js v20+ (optional, for local development outside Docker).

### Configuration & Google API Setup
To fetch live content from the Google Docs and Drive APIs, configure your local environment:
1. **Google Service Account**: Place your Google Cloud Service Account credentials JSON file in `apps/web-engine-project/service-account.json`.
2. **Environment Variables**: Create a `.env` file in the root directory (already configured in `.gitignore`):
   ```env
   GOOGLE_DOC_ID=1VvQ0mb-e2J1qBD24f3geBcnqU28ep8eZDLzOKSVOIw4
   GOOGLE_DRIVE_FOLDER_ID=1SuWQ9MJmfzJzhRD20bnV3A5ejIf8zVfy
   GOOGLE_APPLICATION_CREDENTIALS=/app/service-account.json
   ```

### Run the POC Services
Boot the multi-container stack:
```bash
docker-compose up --build -d
```
This launches three services in the shared Docker network:
* **CDN Nginx Simulator**: Serves raw template assets at `http://localhost:8080`
* **Image Optimizer Microservice**: Resizes and caches WebP assets at `http://localhost:3002`
* **Astro SSR Render Engine**: Dynamically composes page layouts at `http://localhost:3001`

### Accessing the Demos
- **Live Compiled Website**: Navigate to `http://localhost:3001/globant-demo` in your browser.
- **CDN Simulated Snippets**: Navigate to `http://localhost:8080/Hero.html` to see the raw templates served by the CDN container.

---

## Developer Workflow & How to Contribute

### 1. Modifying Frontend Components (CDN Assets)
All visual templates, stylesheets, and vanilla scripts live under [core-assets-pipeline/src/](file:///Users/saurabh.sircar/Globant/astro-demo/core-assets-pipeline/src/).
* **Hot-loading**: Because the Nginx container mounts the directory locally, any changes you make to CSS/HTML/JS inside `core-assets-pipeline/src/` are served instantly by the CDN.
* **SWR Cache Flush**: The Astro rendering engine implements a 10-second fresh Stale-While-Revalidate (SWR) cache. When testing component modifications, wait 10 seconds and refresh the browser twice to see the updated assets, or run local benchmarks to trigger background revalidations.

### 2. Modifying AST Parsing & Server Logic (Astro)
Astro code resides in [apps/web-engine-project/](file:///Users/saurabh.sircar/Globant/astro-demo/apps/web-engine-project/).
* **Rebuilding**: Astro runs in `preview` mode using a compiled server bundle loaded in container memory. If you edit server-side files (like `[...slug].astro` or helper files under `src/utils/`), you must rebuild the bundle:
  ```bash
  docker-compose exec web-engine npm run build
  ```
* **Restarting**: To apply the new build and flush the container's memory cache, restart the service:
  ```bash
  docker-compose restart web-engine
  ```

### 3. Local Development (Without Docker)
If you prefer developing without Docker, you can run the services locally on your host machine:
1. Start the image optimizer:
   ```bash
   cd apps/image-optimizer
   npm install
   npm start
   ```
2. Start the Astro SSR dev server:
   ```bash
   cd apps/web-engine-project
   npm install
   npm run dev
   ```
3. Update `.env` variable references to point to `localhost` rather than container hostnames (e.g. `CDN_URL=http://localhost:8080`).

### 4. Running Performance Benchmarks
Query the server and output response speed metrics:
```bash
node scratch/test_server.mjs
```

---

## Documentation Index
- **Developer Guidelines & Commands**: See [CLAUDE.md](./CLAUDE.md) for style requirements, directories, and code instructions.
- **Benchmarks & Execution Results**: See [walkthrough.md](./walkthrough.md) for full metrics and code outputs.

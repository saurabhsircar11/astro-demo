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

### Run the POC Services
Boot the services (the CDN Nginx simulator on port `8080` and the Astro rendering container on port `3000`):
```bash
docker-compose up --build -d
```

### Accessing the Demos
- **Live Compiled Website**: Navigate to `http://localhost:3000/globant-demo` in your browser.
- **CDN Simulated Snippets**: Navigate to `http://localhost:8080/Hero.html` to see the raw templates served by the CDN container.

### Run Performance Benchmarks
Query the server and output response speed metrics:
```bash
node scratch/test_server.mjs
```

---

## Documentation Index
- **Developer Guidelines & Commands**: See [CLAUDE.md](./CLAUDE.md) for style requirements, directories, and code instructions.
- **Benchmarks & Execution Results**: See [walkthrough.md](./walkthrough.md) for full metrics and code outputs.

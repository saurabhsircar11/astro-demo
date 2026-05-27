# Astro SSR Image Optimization Microservice Plan

This plan details the migration of the image optimization logic from the Astro Web Engine into a **separate, dedicated microservice container** (`image-optimizer`). This isolates CPU-intensive image resizing and WebP compression from the HTML page composition logic, simulating a production-grade decoupled CDN/Image service.

## User Review Required

> [!IMPORTANT]
> - **Microservice Routing (Port 3002)**:
>   The image optimizer will run as a standalone Node.js server inside Docker, exposed on host port `3002`.
>   We will set `process.env.IMAGE_OPTIMIZER_URL` in the Astro container to point to `http://localhost:3002`.
> - **Shared/Dedicated Caching Volume**:
>   We will configure a persistent volume mount for the new microservice: `./apps/image-optimizer/.cache:/app/.cache` so the optimized image cache remains persistent on the host.
> - **Whitelisting & Fetch Security**:
>   The microservice will maintain the same strict whitelist policy to prevent open-proxy abuse.

---

## Proposed Changes

### 1. The Image Optimizer Microservice (New Service)

#### [NEW] [package.json](file:///Users/saurabh.sircar/Globant/astro-demo/apps/image-optimizer/package.json)
Lightweight package configuration using ES modules and installing `sharp`:
```json
{
  "name": "image-optimizer",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "sharp": "^0.33.0"
  }
}
```

#### [NEW] [server.js](file:///Users/saurabh.sircar/Globant/astro-demo/apps/image-optimizer/server.js)
A pure Node.js native HTTP server (no Express overhead) to optimize images:
1. Listens on port `3002`.
2. Parses query parameters: `url`, `w` (width), `q` (quality).
3. Whitelists requests matching Google Docs/Drive, Globant, and local development.
4. Manages a file cache at `.cache/images/[hash].webp`.
5. Performs fetching, `sharp` resizing, WebP conversion, and cache management.
6. Returns `Content-Type: image/webp` and `Cache-Control` headers.

#### [NEW] [Dockerfile](file:///Users/saurabh.sircar/Globant/astro-demo/apps/image-optimizer/Dockerfile)
Alpine-based Node.js Dockerfile:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3002
CMD ["npm", "start"]
```

---

### 2. Multi-Container Orchestration

#### [MODIFY] [docker-compose.yml](file:///Users/saurabh.sircar/Globant/astro-demo/docker-compose.yml)
1. Add the new `image-optimizer` service:
   - Exposes port `3002:3002`.
   - Volumes: `./apps/image-optimizer:/app` and `/app/node_modules`.
   - Persistent cache mount.
2. In the `web-engine` service:
   - Add environment variable: `IMAGE_OPTIMIZER_URL=http://localhost:3002`.
   - Make it depend on `image-optimizer`.

---

### 3. Astro Web Engine Updates

#### [DELETE] [image.ts](file:///Users/saurabh.sircar/Globant/astro-demo/apps/web-engine-project/src/pages/api/image.ts)
Remove the `/api/image` endpoint route from the Web Engine codebase since it is now offloaded.

#### [MODIFY] [[...slug].astro](file:///Users/saurabh.sircar/Globant/astro-demo/apps/web-engine-project/src/pages/[...slug].astro)
Update routing helper to point to the external image optimizer container:
```typescript
const IMAGE_OPTIMIZER_URL = process.env.IMAGE_OPTIMIZER_URL || 'http://localhost:3002';

function optimizeImageUrl(url: string, width: number = 800): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('/') || trimmed.endsWith('.svg') || trimmed.includes(IMAGE_OPTIMIZER_URL)) {
    return trimmed;
  }
  return `${IMAGE_OPTIMIZER_URL}/?url=${encodeURIComponent(trimmed)}&w=${width}&q=80`;
}

function generateSrcset(url: string, widths: number[]): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('/') || trimmed.endsWith('.svg')) {
    return '';
  }
  return widths
    .map((w) => `${IMAGE_OPTIMIZER_URL}/?url=${encodeURIComponent(trimmed)}&w=${w}&q=80 ${w}w`)
    .join(', ');
}
```

---

## Verification Plan

### Automated Verification
1. Boot the containers: `docker-compose up -d --build`.
2. Verify endpoints:
   - `curl -I "http://localhost:3002/?url=https%3A%2F%2Fstatics.globant.com%2Fproduction%2Fpublic%2F2026-02%2Fbg-desktop-fifa.jpg&w=480"` should return `HTTP/1.1 200 OK` and `Content-Type: image/webp` directly from the new microservice.
   - Verify subsequent request returns `X-Cache: HIT`.
3. Check page composition:
   - Request `http://localhost:3001/globant-demo`.
   - Confirm that image references now point to `http://localhost:3002/?url=...`.

### Manual Verification
- Resize the browser window and verify in the Network tab that the browser fetches smaller/larger images dynamically from port `3002`.
- Verify the Web Engine logs are completely free of `sharp` or image fetch entries.

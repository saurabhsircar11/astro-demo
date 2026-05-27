import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';

const PORT = 3002;
const CACHE_DIR = path.join(process.cwd(), '.cache', 'images');

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Whitelisted domains check to prevent proxy abuse
function isAllowedDomain(urlStr) {
  try {
    const parsedUrl = new URL(urlStr);
    const host = parsedUrl.hostname.toLowerCase();

    // Whitelist known domains
    if (
      host === 'statics.globant.com' ||
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === 'cdn-simulator' ||
      host === 'web-engine' ||
      host === 'image-optimizer'
    ) {
      return true;
    }

    // Google Docs and Google Drive inline images
    if (
      host.endsWith('.googleusercontent.com') ||
      host.endsWith('.google.com') ||
      host.endsWith('.googleapis.com')
    ) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

const server = http.createServer(async (req, res) => {
  // Support HEAD requests as well as GET
  const isHead = req.method === 'HEAD';
  if (req.method !== 'GET' && !isHead) {
    res.writeHead(450, { 'Content-Type': 'text/plain' });
    res.end('Method not allowed');
    return;
  }

  // Handle favicon or healthchecks
  if (req.url === '/favicon.ico') {
    res.writeHead(404);
    res.end();
    return;
  }

  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const targetUrl = parsedUrl.searchParams.get('url');

    // Healthcheck endpoints
    if (req.url === '/health' || req.url === '/' || !targetUrl) {
      if (!targetUrl) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Image Optimizer microservice is running.');
        return;
      }
    }

    // Security validation
    if (!isAllowedDomain(targetUrl)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Domain not whitelisted');
      return;
    }

    // Parse formatting parameters
    const widthStr = parsedUrl.searchParams.get('w');
    const qualityStr = parsedUrl.searchParams.get('q');

    const width = widthStr ? parseInt(widthStr, 10) : undefined;
    const quality = qualityStr ? parseInt(qualityStr, 10) : 80;

    if (width !== undefined && (isNaN(width) || width <= 0)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid width parameter');
      return;
    }
    if (isNaN(quality) || quality <= 0 || quality > 100) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid quality parameter');
      return;
    }

    // Compute unique hash for cache identification
    const cacheKey = `${targetUrl}::w=${width || 'orig'}::q=${quality}`;
    const hash = crypto.createHash('sha256').update(cacheKey).digest('hex');
    const cacheFilePath = path.join(CACHE_DIR, `${hash}.webp`);

    // Check cache hit
    if (fs.existsSync(cacheFilePath)) {
      const cachedBuffer = fs.readFileSync(cacheFilePath);
      res.writeHead(200, {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Cache': 'HIT'
      });
      if (isHead) {
        res.end();
      } else {
        res.end(cachedBuffer);
      }
      return;
    }

    // Cache miss - Fetch source image
    const fetchResponse = await fetch(targetUrl);
    if (!fetchResponse.ok) {
      res.writeHead(fetchResponse.status, { 'Content-Type': 'text/plain' });
      res.end(`Failed to fetch source image: ${fetchResponse.statusText}`);
      return;
    }

    const contentType = fetchResponse.headers.get('content-type') || '';
    const sourceBuffer = Buffer.from(await fetchResponse.arrayBuffer());

    // Bypass SVG files to prevent rasterization
    if (targetUrl.toLowerCase().endsWith('.svg') || contentType.includes('svg')) {
      res.writeHead(200, {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Cache': 'BYPASS-SVG'
      });
      if (isHead) {
        res.end();
      } else {
        res.end(sourceBuffer);
      }
      return;
    }

    // Process with sharp
    try {
      let sharpInstance = sharp(sourceBuffer);

      if (width) {
        sharpInstance = sharpInstance.resize({
          width,
          withoutEnlargement: true
        });
      }

      const optimizedBuffer = await sharpInstance
        .webp({ quality })
        .toBuffer();

      // Write cache file asynchronously in the background
      fs.writeFile(cacheFilePath, optimizedBuffer, (err) => {
        if (err) {
          console.error('[ImageOptimizer] Failed to write cache file:', err.message);
        }
      });

      res.writeHead(200, {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Cache': 'MISS'
      });
      if (isHead) {
        res.end();
      } else {
        res.end(optimizedBuffer);
      }
    } catch (sharpErr) {
      console.error(`[ImageOptimizer] Sharp failed to process image: ${sharpErr.message}. Serving original.`);
      res.writeHead(200, {
        'Content-Type': contentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400',
        'X-Cache': 'FALLBACK-ERROR'
      });
      if (isHead) {
        res.end();
      } else {
        res.end(sourceBuffer);
      }
    }
  } catch (err) {
    console.error('[ImageOptimizer] Server error:', err.message);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(`Internal Server Error: ${err.message}`);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[ImageOptimizer] Dedicated microservice listening on port ${PORT}`);
});

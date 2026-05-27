import http from 'http';

interface CacheEntry {
  content: string;
  expiresAt: number;
}

// In-memory SWR cache map
const assetCache = new Map<string, CacheEntry>();

// Cache configuration: 10 seconds fresh, background revalidation afterwards
const FRESH_TTL_MS = 10000; 

/**
 * Performs a fast, basic HTTP GET request using Node's native http module (to avoid fetch overhead).
 */
function fetchHttp(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    http.get(url, { timeout: 1000 }, (res) => {
      if (res.statusCode !== 200) {
        res.resume(); // consume response body to free up memory
        reject(new Error(`Failed to fetch asset from CDN, status code: ${res.statusCode}`));
        return;
      }

      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => { resolve(data); });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Resolves the full URL for an asset, incorporating branch path routing.
 */
export function getAssetUrl(filename: string, branch?: string): string {
  const cdnBase = process.env.CDN_URL || 'http://cdn-simulator:80';
  
  // If a branch is specified, route to that folder. Otherwise, pull from the default root.
  // E.g., http://cdn-simulator/feat-new-hero/Hero.html vs http://cdn-simulator/Hero.html
  if (branch && branch.trim()) {
    return `${cdnBase.replace(/\/$/, '')}/${branch}/${filename}`;
  }
  return `${cdnBase.replace(/\/$/, '')}/${filename}`;
}

/**
 * Fetches an asset (HTML, CSS, or JS) with Stale-While-Revalidate caching.
 * Target: lookup time is < 5ms for cached elements.
 */
export async function fetchAsset(filename: string, branch?: string): Promise<string> {
  const url = getAssetUrl(filename, branch);
  const cacheKey = `${branch || 'main'}::${filename}`;
  const now = Date.now();

  const cached = assetCache.get(cacheKey);

  if (cached) {
    // If the cache is still fresh, return it instantly
    if (now < cached.expiresAt) {
      return cached.content;
    }

    // If the cache is stale (SWR), trigger a background revalidation request
    // and immediately return the stale content.
    console.log(`[SWR Cache] Stale hit for "${cacheKey}". Revalidating in background...`);
    
    // Background fetch (floating Promise)
    fetchHttp(url)
      .then((content) => {
        assetCache.set(cacheKey, {
          content,
          expiresAt: Date.now() + FRESH_TTL_MS
        });
        console.log(`[SWR Cache] Background revalidation completed for "${cacheKey}"`);
      })
      .catch((err) => {
        console.error(`[SWR Cache] Background revalidation failed for "${cacheKey}":`, err.message);
      });

    return cached.content;
  }

  // Cache miss: perform synchronous fetch to populate cache
  console.log(`[SWR Cache] Cache miss for "${cacheKey}". Fetching synchronously...`);
  const content = await fetchHttp(url);
  
  assetCache.set(cacheKey, {
    content,
    expiresAt: Date.now() + FRESH_TTL_MS
  });

  return content;
}

/**
 * Clears the SWR cache. Useful for on-demand revalidation hooks.
 */
export function clearAssetCache() {
  assetCache.clear();
  console.log('[SWR Cache] Cache cleared.');
}

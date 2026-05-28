import { parseGoogleDoc, resolveSlugToDocId } from './docParser.js';

export interface Block {
  type: string;
  data: Record<string, any>;
}

export interface PageContent {
  metadata: Record<string, string>;
  blocks: Block[];
}

/**
 * Fallback mock payload — only used if Google Docs API is unavailable.
 * Real content is authored in the Google Doc and fetched via the APIs.
 */
const GLOBANT_MOCK_PAYLOAD: PageContent = {
  metadata: {
    title: "Globant AI Powerhouse | Meet AI Pods by Globant Enterprise AI",
    description: "We help organizations drive AI business transformation.",
    robots: "index, follow",
    theme: "dark"
  },
  blocks: [
    {
      type: "hero",
      data: {
        tagline: "OFFICIAL FIFA WORLD CUP 2026™ SUPPORTER",
        title: "Engineering for the World's Biggest Stage",
        description: "From connected fan ecosystems to real-time systems, Globant helps FIFA operate flawlessly under global demand.",
        alignment: "left",
        theme: "dark",
        backgroundImage: "https://statics.globant.com/production/public/2026-02/bg-desktop-fifa.jpg",
        ctaText: "Learn how",
        ctaUrl: "https://www.globant.com/news/globant-fifa-renewed-partnership-2026-2027"
      }
    }
  ]
};


interface DocCacheEntry {
  content: PageContent;
  expiresAt: number;
}

// In-memory SWR cache for parsed Google Doc ASTs
const docAstCache = new Map<string, DocCacheEntry>();
const DOC_TTL_MS = 10000; // 10 seconds fresh TTL, background revalidation afterwards

/**
 * Resolves the page AST for a given slug.
 */
export async function getPageAST(slug: string): Promise<PageContent> {
  const hasCredentials = !!process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  const hardcodedDocId = process.env.GOOGLE_DOC_ID;

  // 'globant-demo' slug uses the hardcoded GOOGLE_DOC_ID from environment
  // (falls through to the standard fetch path below — no early mock return)

  if (hasCredentials) {
    const cacheKey = `doc::${slug}`;
    const now = Date.now();
    const cachedDoc = docAstCache.get(cacheKey);

    const isDocId = /^[a-zA-Z0-9-_]{40,60}$/.test(slug);

    // Dynamic fetch function to retrieve and parse content
    const fetchFreshContent = async (): Promise<PageContent> => {
      // 1. If slug is a direct Google Doc ID, fetch it directly
      if (isDocId) {
        console.log(`[ContentProvider] Slug "${slug}" matches Google Doc ID pattern. Fetching directly...`);
        return await parseGoogleDoc(slug);
      }

      // 2. Dynamic Milo-style mount point directory mapping (Google Drive folder)
      if (folderId) {
        console.log(`[ContentProvider] Resolving slug "/${slug}" inside Drive folder: ${folderId}`);
        try {
          const docId = await resolveSlugToDocId(folderId, slug);
          if (docId) {
            return await parseGoogleDoc(docId);
          }
          console.log(`[ContentProvider] Slug "/${slug}" could not be resolved inside the Drive folder.`);
        } catch (driveErr: any) {
          console.error(`[ContentProvider] Google Drive folder resolver error: ${driveErr.message}. Falling back...`);
        }
      } 
      
      // 3. Fallback to direct Document ID querying via env variable
      if (hardcodedDocId && hardcodedDocId !== 'REPLACE_WITH_YOUR_GOOGLE_DOC_ID') {
        console.log(`[ContentProvider] Querying Google Docs API directly for fallback Doc ID: ${hardcodedDocId}`);
        return await parseGoogleDoc(hardcodedDocId);
      }

      throw new Error(`No document mapping found for slug "${slug}"`);
    };

    if (cachedDoc) {
      // If the cache is still fresh, return it instantly
      if (now < cachedDoc.expiresAt) {
        return cachedDoc.content;
      }

      // If the cache is stale, return it immediately and trigger background update (SWR)
      console.log(`[ContentProvider] SWR Stale hit for "${cacheKey}". Revalidating Google Docs API in background...`);
      fetchFreshContent()
        .then((content) => {
          docAstCache.set(cacheKey, {
            content,
            expiresAt: Date.now() + DOC_TTL_MS
          });
          console.log(`[ContentProvider] Background revalidation completed for "${cacheKey}"`);
        })
        .catch((err) => {
          console.error(`[ContentProvider] Background revalidation failed for "${cacheKey}":`, err.message);
        });

      return cachedDoc.content;
    }

    // Cache miss: perform synchronous fetch
    try {
      console.log(`[ContentProvider] Cache miss for "${cacheKey}". Fetching Google Docs API synchronously...`);
      const content = await fetchFreshContent();
      docAstCache.set(cacheKey, {
        content,
        expiresAt: Date.now() + DOC_TTL_MS
      });
      return content;
    } catch (err: any) {
      console.error("[ContentProvider] Error querying Google APIs, falling back to Mock:", err.message);
      return GLOBANT_MOCK_PAYLOAD;
    }
  }

  // If no credentials or document found, default to our Globant landing page demo
  console.log(`[ContentProvider] Fallback: Serving mock landing page for slug: "/${slug}"`);
  return GLOBANT_MOCK_PAYLOAD;
}

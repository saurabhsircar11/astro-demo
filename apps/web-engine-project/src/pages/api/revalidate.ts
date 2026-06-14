import type { APIRoute } from 'astro';
import { clearDocCache } from '../../utils/contentProvider.js';
import { clearAssetCache } from '../../utils/assetFetcher.js';

export const ALL: APIRoute = async ({ request, url }) => {
  // Check optional revalidation secret if configured
  const secret = url.searchParams.get('secret') || request.headers.get('x-revalidate-secret');
  const expectedSecret = process.env.REVALIDATE_SECRET;
  if (expectedSecret && secret !== expectedSecret) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let slug = url.searchParams.get('slug');
  let clearAll = url.searchParams.get('clearAll') === 'true';
  let isGoogleDriveWebhook = false;
  let driveFileId = null;

  // Inspect headers for Google Drive push notifications
  const googChannelId = request.headers.get('x-goog-channel-id');
  const googResourceState = request.headers.get('x-goog-resource-state');
  const googResourceUri = request.headers.get('x-goog-resource-uri');

  if (googChannelId) {
    isGoogleDriveWebhook = true;
    console.log(`[Revalidate Webhook] Received Google Drive push notification. Channel: ${googChannelId}, State: ${googResourceState}`);
    // Attempt to extract File ID from the resource URI
    if (googResourceUri) {
      const match = googResourceUri.match(/\/files\/([a-zA-Z0-9-_]{25,60})/);
      if (match) {
        driveFileId = match[1];
        console.log(`[Revalidate Webhook] Identified modified Google Drive File ID: ${driveFileId}`);
      }
    }
  }

  // Parse body for JSON payloads (useful for POST webhooks)
  if (request.method === 'POST') {
    try {
      const contentType = request.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const body = await request.clone().json();
        if (body.slug) slug = body.slug;
        if (body.clearAll !== undefined) clearAll = !!body.clearAll;
        if (body.fileId) driveFileId = body.fileId;
      }
    } catch (e: any) {
      console.warn('[Revalidate Webhook] Failed to parse JSON body:', e.message);
    }
  }

  // Perform invalidation
  if (clearAll || isGoogleDriveWebhook) {
    clearDocCache();
    clearAssetCache();
    return new Response(JSON.stringify({
      revalidated: true,
      message: 'Successfully cleared all document and template caches.',
      timestamp: Date.now(),
      googleDriveTrigger: isGoogleDriveWebhook,
      driveFileId
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (slug) {
    clearDocCache(slug);
    return new Response(JSON.stringify({
      revalidated: true,
      message: `Successfully cleared cache for slug: ${slug}`,
      slug,
      timestamp: Date.now()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Default behavior if no parameters: clear everything to ensure system is fresh
  clearDocCache();
  clearAssetCache();
  return new Response(JSON.stringify({
    revalidated: true,
    message: 'No specific slug or clearAll option provided. Defaulted to clearing all caches.',
    timestamp: Date.now()
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

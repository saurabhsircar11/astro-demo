import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const DOC_ID = '1VvQ0mb-e2J1qBD24f3geBcnqU28ep8eZDLzOKSVOIw4';
const KEY_FILE = path.resolve('service-account.json');

/**
 * Page structure matching globant.com homepage (May 2026):
 * 1. METADATA
 * 2. COMPONENT: Hero       — FIFA World Cup 2026 dark hero
 * 3. COMPONENT: TwoColumn  — "Meet Globant AI Pods" (white bg)
 * 4. COMPONENT: StudioCards — "AI Studios" industry cards (white bg)
 * 5. COMPONENT: LogoScroll — client logos marquee (light grey bg)
 */
const tablesData = [
  // ── 1. Metadata ──────────────────────────────────────────────────────
  {
    rows: 5,
    cols: 2,
    content: [
      ['METADATA', ''],
      ['title', 'Globant AI Powerhouse | Meet AI Pods by Globant Enterprise AI'],
      ['description', 'We help organizations drive AI business transformation. Our AI enterprise solutions blend AI-powered engineering, innovation, and cutting-edge design.'],
      ['robots', 'index, follow'],
      ['theme', 'dark'],
    ]
  },

  // ── 2. Hero — FIFA World Cup 2026 ────────────────────────────────────
  {
    rows: 8,
    cols: 2,
    content: [
      ['COMPONENT: Hero', ''],
      ['tagline', 'OFFICIAL FIFA WORLD CUP 2026™ SUPPORTER'],
      ['title', "Engineering for the World's Biggest Stage"],
      ['description', 'From connected fan ecosystems to real-time systems, Globant helps FIFA operate flawlessly under global demand.'],
      ['alignment', 'left'],
      ['backgroundImage', 'https://statics.globant.com/production/public/2026-02/bg-desktop-fifa.jpg'],
      ['ctaText', 'Learn how'],
      ['ctaUrl', 'https://www.globant.com/news/globant-fifa-renewed-partnership-2026-2027'],
    ]
  },

  // ── 3. TwoColumn — Meet Globant AI Pods ──────────────────────────────
  {
    rows: 8,
    cols: 2,
    content: [
      ['COMPONENT: TwoColumn', ''],
      ['theme', 'light'],
      ['eyebrow', 'AI-NATIVE DELIVERY'],
      ['title', 'Meet Globant AI Pods'],
      ['description', 'Forget technology services as you know them. AI-native delivery, built for output, not hours. Think: autonomous agents executing end-to-end, domain experts validating every result, and a system that learns with every interaction, turning AI into consistent, enterprise grade delivery.'],
      ['ctaText', 'Subscribe to the future'],
      ['ctaUrl', '/ai-pods'],
      ['image', 'https://statics.globant.com/production/public/2025-10/ai_pods_test_automation.png'],
    ]
  },

  // ── 4. StudioCards — AI Studios ──────────────────────────────────────
  {
    rows: 12,
    cols: 4,
    content: [
      ['COMPONENT: StudioCards', '', '', ''],
      ['sectionTitle', 'AI Studios', '', ''],
      ['sectionSubtitle', 'Every industry re-imagined with the power of AI.', '', ''],
      ['sectionBody', 'End to end process re-build with AI at the core, bringing efficiency and quality outcomes faster than ever.', '', ''],
      ['ctaText', 'Find your industry', 'ctaUrl', '/ai-studios'],
      // Items: Title | Description | Image | Link
      ['Financial Services', 'We reimagine how financial services operate in the age of intelligent agents.', 'https://statics.globant.com/production/public/2026-03/financial_services.jpg', '/studio/financial-services'],
      ['Sports', 'We leverage AI, data, and technology to increase fan engagement, reach, and monetization opportunities.', 'https://statics.globant.com/production/public/2026-02/Sports_0.jpg', '/studio/sports'],
      ['Healthcare & Life Science', 'We improve the connection between technology and life sciences, combining bio-science talent with AI-driven solutions.', 'https://statics.globant.com/production/public/2026-02/healthcare_0.jpg', '/studio/healthcare-life-sciences'],
      ['Retail', 'We innovate through digital retail solutions with AI-driven supply chain visibility and automation.', 'https://statics.globant.com/production/public/2026-02/retail_0.jpg', '/studio/retail'],
      ['Airlines', 'We drive digital transformation in the airline industry by focusing on passenger experience and leveraging AI.', 'https://statics.globant.com/production/public/2026-02/airline.jpg', '/studio/airlines'],
      ['Games', 'We design and develop world-class games and digital platforms across multiple channels, integrating AI for enhanced gameplay.', 'https://statics.globant.com/production/public/2026-02/games.jpg', '/studio/gaming'],
      ['Energy', 'Energy, Mining and Multiutilities transformational services to solve hurdles, revolutionize efficiencies and power up value chains through tech & AI.', 'https://statics.globant.com/production/public/2026-02/energy.jpg', '/studio/energy'],
    ]
  },

  // ── 5. LogoScroll — Client logos ─────────────────────────────────────
  {
    rows: 17,
    cols: 2,
    content: [
      ['COMPONENT: LogoScroll', ''],
      ['sectionTitle', "Over two decades powering the world's leading businesses"],
      ["L'Oreal",        'https://statics.globant.com/production/public/2024-09/Loreal.svg'],
      ['EA',             'https://statics.globant.com/production/public/2024-09/EA.svg'],
      ['Santander',      'https://statics.globant.com/production/public/2024-09/Santander.svg'],
      ['Nissan',         'https://statics.globant.com/production/public/2024-09/Nissan.svg'],
      ['Danone',         'https://statics.globant.com/production/public/2024-09/Danone.svg'],
      ['Coca-Cola',      'https://statics.globant.com/production/public/2024-09/Coca%20Cola.svg'],
      ['HSBC',           'https://statics.globant.com/production/public/2024-09/HSBC.svg'],
      ['J&J',            'https://statics.globant.com/production/public/2024-09/J%26J.svg'],
      ['FIFA',           'https://statics.globant.com/production/public/2024-09/FIFA.svg'],
      ['F1',             'https://statics.globant.com/production/public/2024-09/F1.svg'],
      ['Adidas',         'https://statics.globant.com/production/public/2024-09/Adidas.svg'],
      ['Warner Bros',    'https://statics.globant.com/production/public/2024-09/WB.svg'],
      ['Google',         'https://statics.globant.com/production/public/2024-09/Google.svg'],
      ['Embraer',        'https://statics.globant.com/production/public/2024-09/Embraer.svg'],
      ['British Airways','https://statics.globant.com/production/public/2024-09/British%20Airways.svg'],
    ]
  },
];

async function main() {
  if (!fs.existsSync(KEY_FILE)) {
    console.error(`Key file not found at ${KEY_FILE}`);
    process.exit(1);
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE,
    scopes: [
      'https://www.googleapis.com/auth/documents',
      'https://www.googleapis.com/auth/drive'
    ],
  });

  const docs = google.docs({ version: 'v1', auth });

  console.log(`[GoogleDocs] Fetching document to clear...`);
  
  // 1. Clear Document body
  let doc = await docs.documents.get({ documentId: DOC_ID });
  const docLength = doc.data.body?.content?.[doc.data.body.content.length - 1]?.endIndex || 2;
  
  if (docLength > 2) {
    console.log(`[GoogleDocs] Clearing ${docLength - 2} characters...`);
    await docs.documents.batchUpdate({
      documentId: DOC_ID,
      requestBody: {
        requests: [{
          deleteContentRange: {
            range: { startIndex: 1, endIndex: docLength - 1 }
          }
        }]
      }
    });
  }

  // 2. Insert tables in reverse order so they stack correctly
  for (let i = tablesData.length - 1; i >= 0; i--) {
    const tableDef = tablesData[i];
    console.log(`[GoogleDocs] Inserting Table ${i + 1}: ${tableDef.content[0][0]}`);

    // Insert the table structure at index 1
    await docs.documents.batchUpdate({
      documentId: DOC_ID,
      requestBody: {
        requests: [
          {
            insertTable: {
              rows: tableDef.rows,
              columns: tableDef.cols,
              location: { index: 1 }
            }
          },
          {
            insertText: {
              location: { index: 1 },
              text: "\n\n"
            }
          }
        ]
      }
    });

    // Fetch the updated document structure to find cell indices
    doc = await docs.documents.get({ documentId: DOC_ID });
    
    const firstTableBlock = doc.data.body?.content?.find(el => el.table);
    if (!firstTableBlock || !firstTableBlock.table) {
      console.error(`Error: inserted table not found.`);
      continue;
    }

    const table = firstTableBlock.table;
    const writeRequests = [];

    // Build write requests in reverse order to protect indices
    for (let r = tableDef.rows - 1; r >= 0; r--) {
      const row = table.tableRows?.[r];
      if (!row) continue;
      
      for (let c = tableDef.cols - 1; c >= 0; c--) {
        const cell = row.tableCells?.[c];
        if (!cell) continue;

        const cellText = tableDef.content[r]?.[c] || '';
        if (cellText) {
          writeRequests.push({
            insertText: {
              location: { index: cell.content[0].startIndex },
              text: cellText
            }
          });
        }
      }
    }

    if (writeRequests.length > 0) {
      await docs.documents.batchUpdate({
        documentId: DOC_ID,
        requestBody: { requests: writeRequests }
      });
    }
  }

  console.log('[GoogleDocs] ✅ Success! Globant.com matching content written to Google Doc.');
  console.log('Open Google Doc: https://docs.google.com/document/d/' + DOC_ID + '/edit');
}

main().catch(err => {
  console.error('[GoogleDocs] Error writing to document:', err.message);
});

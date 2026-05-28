import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const DOC_ID = '1VvQ0mb-e2J1qBD24f3geBcnqU28ep8eZDLzOKSVOIw4';
const KEY_FILE = path.resolve('apps/web-engine-project/service-account.json');

const tablesData = [
  // 1. Metadata
  {
    rows: 6,
    cols: 2,
    content: [
      ['METADATA', ''],
      ['title', 'Globant: Dare to Invent the Future'],
      ['description', 'We are a digitally native company where innovation, design, and engineering meet scale. We help organizations reinvent themselves.'],
      ['robots', 'index, follow'],
      ['geo.position', '40.7128;-74.0060'],
      ['theme', 'dark']
    ]
  },
  // 2. Hero
  {
    rows: 8,
    cols: 2,
    content: [
      ['COMPONENT: hero', ''],
      ['tagline', 'Dare to Invent the Future'],
      ['title', 'We Dare to Reinvent the World'],
      ['description', 'We are a digitally native company where innovation, design, and engineering meet scale to help organizations transform and thrive.'],
      ['alignment', 'left'],
      ['backgroundImage', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1920'],
      ['ctaText', 'Explore Our Studios'],
      ['ctaUrl', '#studios']
    ]
  },
  // 3. ServicesGrid
  {
    rows: 6,
    cols: 3,
    content: [
      ['COMPONENT: services-grid', '', ''],
      ['Title', 'Description', 'Link'],
      ['AI Studio', 'Generative AI pipelines and neural solutions to transform your operations and products.', '#ai-studio'],
      ['Digital Experience', 'Creating stunning, high-performance customer portals and mobile platforms.', '#digital-studio'],
      ['Cloud & DevOps', 'Continuous integration, elastic scalability, and serverless architectures running at sub-millisecond edge limits.', '#cloud-studio'],
      ['Enterprise Software', 'Modernizing legacy code and orchestrating large enterprise software systems.', '#enterprise-studio']
    ]
  },
  // 4. Metrics
  {
    rows: 5,
    cols: 2,
    content: [
      ['COMPONENT: metrics', ''],
      ['Value', 'Label'],
      ['30,000+', 'Globanteers driving digital transformation globally'],
      ['30+', 'Global delivery centers and studios'],
      ['NYSE: GLOB', 'Publicly listed company growing exponentially']
    ]
  },
  // 5. FAQ
  {
    rows: 5,
    cols: 2,
    content: [
      ['COMPONENT: faq', ''],
      ['Question', 'Answer'],
      ['What is a Globant Studio?', 'Our Studios are deep business verticals combining target domain knowledge (like Healthcare, Finance, or Media) with cutting-edge tech capabilities.'],
      ['How does Globant leverage AI?', 'We integrate AI across all Studios, developing custom LLMs, model pipelines, and AI-assisted coding frameworks to optimize engineering outputs.'],
      ['Where does Globant operate?', 'We operate globally with major offices in the US, Europe, Latin America, and India, delivering next-generation digital products.']
    ]
  }
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

  // 2. Insert tables in reverse order so they stack correctly (Table 1 first, then 2, etc.)
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
          // Insert a trailing newline spacer
          {
            insertText: {
              location: { index: 1 },
              text: "\n\n"
            }
          }
        ]
      }
    });

    // Fetch the updated document structure to find the table cell start indices
    doc = await docs.documents.get({ documentId: DOC_ID });
    
    // Find the first table in the body
    const firstTableBlock = doc.data.body?.content?.find(el => el.table);
    if (!firstTableBlock || !firstTableBlock.table) {
      console.error(`Error: inserted table not found in document content list.`);
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

    // Execute writing text into cells
    if (writeRequests.length > 0) {
      await docs.documents.batchUpdate({
        documentId: DOC_ID,
        requestBody: { requests: writeRequests }
      });
    }
  }

  console.log('[GoogleDocs] Success! Content tables created and populated.');
  console.log('Open Google Doc to view: https://docs.google.com/document/d/' + DOC_ID + '/edit');
}

main().catch(err => {
  console.error('[GoogleDocs] Error writing to document:', err.message);
});

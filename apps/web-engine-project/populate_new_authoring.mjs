import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// Get folder ID from env
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '1SuWQ9MJmfzJzhRD20bnV3A5ejIf8zVfy';
const KEY_FILE = path.resolve('apps/web-engine-project/service-account.json');

const tablesData = [
  // 1. Metadata (Remains key-value as per docParser)
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
  
  // 2. Hero (Positional)
  {
    rows: 2,
    cols: 2,
    content: [
      ['hero (left, dark)', ''],
      [
        "OFFICIAL FIFA WORLD CUP 2026™ SUPPORTER\nEngineering for the World's Biggest Stage\nFrom connected fan ecosystems to real-time systems, Globant helps FIFA operate flawlessly under global demand.\nLearn how",
        "" // Col 1 will contain the inline image
      ]
    ],
    styles: [
      { text: "Learn how", bold: true, link: "https://www.globant.com/news/globant-fifa-renewed-partnership-2026-2027", rowIdx: 1, colIdx: 0 }
    ],
    paragraphStyles: [
      { text: "Engineering for the World's Biggest Stage", heading: "HEADING_1", rowIdx: 1, colIdx: 0 }
    ],
    images: [
      { uri: "https://statics.globant.com/production/public/2026-02/bg-desktop-fifa.jpg", rowIdx: 1, colIdx: 1 }
    ]
  },

  // 3. TwoColumn (Positional)
  {
    rows: 2,
    cols: 2,
    content: [
      ['two-column (light)', ''],
      [
        "AI-NATIVE DELIVERY\nMeet Globant AI Pods\nForget technology services as you know them. AI-native delivery, built for output, not hours. Think: autonomous agents executing end-to-end, domain experts validating every result, and a system that learns with every interaction, turning AI into consistent, enterprise grade delivery.\nSubscribe to the future",
        "" // Col 1 will contain the inline image
      ]
    ],
    styles: [
      { text: "Subscribe to the future", bold: true, link: "/ai-pods", rowIdx: 1, colIdx: 0 }
    ],
    paragraphStyles: [
      { text: "Meet Globant AI Pods", heading: "HEADING_2", rowIdx: 1, colIdx: 0 }
    ],
    images: [
      { uri: "https://statics.globant.com/production/public/2025-10/ai_pods_test_automation.png", rowIdx: 1, colIdx: 1 }
    ]
  },

  // 4. StudioCards (Positional)
  {
    rows: 5,
    cols: 3,
    content: [
      ['studio-cards', '', ''],
      [
        "AI Studios\nEvery industry re-imagined with the power of AI.\nEnd to end process re-build with AI at the core, bringing efficiency and quality outcomes faster than ever.\nFind your industry",
        "",
        ""
      ],
      [
        "Financial Services\nWe reimagine how financial services operate in the age of intelligent agents.\nFind out more",
        "Sports\nWe leverage AI, data, and technology to increase fan engagement, reach, and monetization opportunities.\nFind out more",
        "Healthcare & Life Science\nWe improve the connection between technology and life sciences, combining bio-science talent with AI-driven solutions.\nFind out more"
      ],
      [
        "Retail\nWe innovate through digital retail solutions with AI-driven supply chain visibility and automation.\nFind out more",
        "Airlines\nWe drive digital transformation in the airline industry by focusing on passenger experience and leveraging AI.\nFind out more",
        "Games\nWe design and develop world-class games and digital platforms across multiple channels, integrating AI for enhanced gameplay.\nFind out more"
      ],
      [
        "Energy\nEnergy, Mining and Multiutilities transformational services to solve hurdles, revolutionize efficiencies and power up value chains through tech & AI.\nFind out more",
        "",
        ""
      ]
    ],
    styles: [
      // Main header button
      { text: "Find your industry", bold: true, link: "/ai-studios", rowIdx: 1, colIdx: 0 },
      // Card titles (Bolding them makes them visually stand out and helps parsing)
      { text: "Financial Services", bold: true, rowIdx: 2, colIdx: 0 },
      { text: "Sports", bold: true, rowIdx: 2, colIdx: 1 },
      { text: "Healthcare & Life Science", bold: true, rowIdx: 2, colIdx: 2 },
      { text: "Retail", bold: true, rowIdx: 3, colIdx: 0 },
      { text: "Airlines", bold: true, rowIdx: 3, colIdx: 1 },
      { text: "Games", bold: true, rowIdx: 3, colIdx: 2 },
      { text: "Energy", bold: true, rowIdx: 4, colIdx: 0 },
      // Card links
      { text: "Find out more", bold: true, link: "/studio/financial-services", rowIdx: 2, colIdx: 0 },
      { text: "Find out more", bold: true, link: "/studio/sports", rowIdx: 2, colIdx: 1 },
      { text: "Find out more", bold: true, link: "/studio/healthcare-life-sciences", rowIdx: 2, colIdx: 2 },
      { text: "Find out more", bold: true, link: "/studio/retail", rowIdx: 3, colIdx: 0 },
      { text: "Find out more", bold: true, link: "/studio/airlines", rowIdx: 3, colIdx: 1 },
      { text: "Find out more", bold: true, link: "/studio/gaming", rowIdx: 3, colIdx: 2 },
      { text: "Find out more", bold: true, link: "/studio/energy", rowIdx: 4, colIdx: 0 }
    ],
    paragraphStyles: [
      { text: "Every industry re-imagined with the power of AI.", heading: "HEADING_2", rowIdx: 1, colIdx: 0 }
    ],
    images: [
      { uri: "https://statics.globant.com/production/public/2026-03/financial_services.jpg", rowIdx: 2, colIdx: 0 },
      { uri: "https://statics.globant.com/production/public/2026-02/Sports_0.jpg", rowIdx: 2, colIdx: 1 },
      { uri: "https://statics.globant.com/production/public/2026-02/healthcare_0.jpg", rowIdx: 2, colIdx: 2 },
      { uri: "https://statics.globant.com/production/public/2026-02/retail_0.jpg", rowIdx: 3, colIdx: 0 },
      { uri: "https://statics.globant.com/production/public/2026-02/airline.jpg", rowIdx: 3, colIdx: 1 },
      { uri: "https://statics.globant.com/production/public/2026-02/games.jpg", rowIdx: 3, colIdx: 2 },
      { uri: "https://statics.globant.com/production/public/2026-02/energy.jpg", rowIdx: 4, colIdx: 0 }
    ]
  },

  // 5. LogoScroll (Positional)
  {
    rows: 7,
    cols: 3,
    content: [
      ['logo-scroll', '', ''],
      [
        "Over two decades powering the world's leading businesses",
        "",
        ""
      ],
      [
        "L'Oreal",
        "EA",
        "Santander"
      ],
      [
        "Nissan",
        "Danone",
        "Coca-Cola"
      ],
      [
        "HSBC",
        "J&J",
        "FIFA"
      ],
      [
        "F1",
        "Adidas",
        "Warner Bros"
      ],
      [
        "Google",
        "Embraer",
        "British Airways"
      ]
    ],
    paragraphStyles: [
      { text: "Over two decades powering the world's leading businesses", heading: "HEADING_2", rowIdx: 1, colIdx: 0 }
    ],
    images: [
      { uri: 'https://statics.globant.com/production/public/2024-09/Loreal.svg', rowIdx: 2, colIdx: 0 },
      { uri: 'https://statics.globant.com/production/public/2024-09/EA.svg', rowIdx: 2, colIdx: 1 },
      { uri: 'https://statics.globant.com/production/public/2024-09/Santander.svg', rowIdx: 2, colIdx: 2 },
      { uri: 'https://statics.globant.com/production/public/2024-09/Nissan.svg', rowIdx: 3, colIdx: 0 },
      { uri: 'https://statics.globant.com/production/public/2024-09/Danone.svg', rowIdx: 3, colIdx: 1 },
      { uri: 'https://statics.globant.com/production/public/2024-09/Coca%20Cola.svg', rowIdx: 3, colIdx: 2 },
      { uri: 'https://statics.globant.com/production/public/2024-09/HSBC.svg', rowIdx: 4, colIdx: 0 },
      { uri: 'https://statics.globant.com/production/public/2024-09/J%26J.svg', rowIdx: 4, colIdx: 1 },
      { uri: 'https://statics.globant.com/production/public/2024-09/FIFA.svg', rowIdx: 4, colIdx: 2 },
      { uri: 'https://statics.globant.com/production/public/2024-09/F1.svg', rowIdx: 5, colIdx: 0 },
      { uri: 'https://statics.globant.com/production/public/2024-09/Adidas.svg', rowIdx: 5, colIdx: 1 },
      { uri: 'https://statics.globant.com/production/public/2024-09/WB.svg', rowIdx: 5, colIdx: 2 },
      { uri: 'https://statics.globant.com/production/public/2024-09/Google.svg', rowIdx: 6, colIdx: 0 },
      { uri: 'https://statics.globant.com/production/public/2024-09/Embraer.svg', rowIdx: 6, colIdx: 1 },
      { uri: 'https://statics.globant.com/production/public/2024-09/British%20Airways.svg', rowIdx: 6, colIdx: 2 }
    ]
  },
  
  // 6. FAQ (Positional)
  {
    rows: 3,
    cols: 3,
    content: [
      ['faq', '', ''],
      [
        "Frequently Asked Questions\nGot questions? We have answers.",
        "",
        ""
      ],
      [
        "What is a Globant Studio?\nOur Studios are deep business verticals combining target domain knowledge (like Healthcare, Finance, or Media) with cutting-edge tech capabilities.",
        "How does Globant leverage AI?\nWe integrate AI across all Studios, developing custom LLMs, model pipelines, and AI-assisted coding frameworks to optimize engineering outputs.",
        "Where does Globant operate?\nWe operate globally with major offices in the US, Europe, Latin America, and India, delivering next-generation digital products."
      ]
    ],
    styles: [
      { text: "What is a Globant Studio?", bold: true, rowIdx: 2, colIdx: 0 },
      { text: "How does Globant leverage AI?", bold: true, rowIdx: 2, colIdx: 1 },
      { text: "Where does Globant operate?", bold: true, rowIdx: 2, colIdx: 2 }
    ],
    paragraphStyles: [
      { text: "Frequently Asked Questions", heading: "HEADING_2", rowIdx: 1, colIdx: 0 }
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
    scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/documents']
  });
  
  const drive = google.drive({ version: 'v3', auth });
  
  console.log("Resolving 'globant-demo-new-authoring' in folder:", FOLDER_ID);
  const response = await drive.files.list({
    q: `'${FOLDER_ID}' in parents and name = 'globant-demo-new-authoring' and trashed = false`,
    fields: 'files(id, name)'
  });
  
  const files = response.data.files || [];
  if (files.length === 0) {
    console.error("Document 'globant-demo-new-authoring' not found in Drive!");
    process.exit(1);
  }
  
  const DOC_ID = files[0].id;
  console.log("Resolved Document ID:", DOC_ID);
  
  const docs = google.docs({ version: 'v1', auth });

  // 1. Clear Document body
  let doc = await docs.documents.get({ documentId: DOC_ID });
  const docLength = doc.data.body?.content?.[doc.data.body.content.length - 1]?.endIndex || 2;
  
  if (docLength > 2) {
    console.log(`Clearing ${docLength - 2} characters...`);
    await docs.documents.batchUpdate({
      documentId: DOC_ID,
      requestBody: {
        requests: [{
          deleteContentRange: { range: { startIndex: 1, endIndex: docLength - 1 } }
        }]
      }
    });
  }

  // 2. Insert tables in reverse order (stacking them correctly)
  for (let i = tablesData.length - 1; i >= 0; i--) {
    const tableDef = tablesData[i];
    console.log(`Inserting Table ${i + 1}: ${tableDef.content[0][0]}`);

    await docs.documents.batchUpdate({
      documentId: DOC_ID,
      requestBody: {
        requests: [
          { insertTable: { rows: tableDef.rows, columns: tableDef.cols, location: { index: 1 } } },
          { insertText: { location: { index: 1 }, text: "\n\n" } }
        ]
      }
    });

    // Refresh doc to find indices
    doc = await docs.documents.get({ documentId: DOC_ID });
    const firstTableBlock = doc.data.body?.content?.find(el => el.table);
    const table = firstTableBlock.table;
    const writeRequests = [];
    const imageJobs = [];
    const stylingJobs = [];
    const paragraphStylingJobs = [];

    for (let r = tableDef.rows - 1; r >= 0; r--) {
      const row = table.tableRows?.[r];
      if (!row) continue;
      
      for (let c = tableDef.cols - 1; c >= 0; c--) {
        const cell = row.tableCells?.[c];
        if (!cell) continue;

        let cellText = tableDef.content[r]?.[c] || '';
        const imgDef = tableDef.images && tableDef.images.find(img => img.rowIdx === r && img.colIdx === c);
        
        if (imgDef) {
          const isSvg = imgDef.uri.toLowerCase().endsWith('.svg');
          if (isSvg) {
            // Write SVG URL as raw text in the cell (Google Docs API doesn't support SVGs as inline images)
            cellText = (cellText ? cellText + "\n" : "") + imgDef.uri;
          } else {
            // Prepend a newline to leave space for the image at the start of the cell
            cellText = "\n" + cellText;
            imageJobs.push({
              uri: imgDef.uri,
              rowIdx: r,
              colIdx: c
            });
          }
        }

        if (cellText) {
          const startIndex = cell.content[0].startIndex;
          writeRequests.push({
            insertText: { location: { index: startIndex }, text: cellText }
          });
          
          // Check if we need to style anything in this cell text
          if (tableDef.styles) {
            tableDef.styles.forEach(styleDef => {
              const matchesCoord = (styleDef.rowIdx === undefined || (styleDef.rowIdx === r && styleDef.colIdx === c));
              if (matchesCoord) {
                // Look for original text (without prepended newline)
                const textIndex = tableDef.content[r][c].indexOf(styleDef.text);
                if (textIndex !== -1) {
                  stylingJobs.push({
                    text: styleDef.text,
                    bold: styleDef.bold,
                    link: styleDef.link,
                    rowIdx: r,
                    colIdx: c
                  });
                }
              }
            });
          }

          // Check if we need to apply paragraph styles
          if (tableDef.paragraphStyles) {
            tableDef.paragraphStyles.forEach(styleDef => {
              const matchesCoord = (styleDef.rowIdx === undefined || (styleDef.rowIdx === r && styleDef.colIdx === c));
              if (matchesCoord) {
                const textIndex = tableDef.content[r][c].indexOf(styleDef.text);
                if (textIndex !== -1) {
                  paragraphStylingJobs.push({
                    text: styleDef.text,
                    heading: styleDef.heading,
                    rowIdx: r,
                    colIdx: c
                  });
                }
              }
            });
          }
        }
      }
    }

    // Write text to cells
    if (writeRequests.length > 0) {
      await docs.documents.batchUpdate({ documentId: DOC_ID, requestBody: { requests: writeRequests } });
    }
    
    // Write images to cells
    if (imageJobs.length > 0) {
      doc = await docs.documents.get({ documentId: DOC_ID });
      const currentTableBlock = doc.data.body?.content?.find(el => el.table);
      const currentTable = currentTableBlock.table;
      
      const imageRequests = [];
      imageJobs.forEach(job => {
        const cell = currentTable.tableRows[job.rowIdx].tableCells[job.colIdx];
        imageRequests.push({
          insertInlineImage: {
            uri: job.uri,
            location: { index: cell.content[0].startIndex }
          }
        });
      });
      
      if (imageRequests.length > 0) {
        await docs.documents.batchUpdate({ documentId: DOC_ID, requestBody: { requests: imageRequests } });
      }
    }
    
    // Pass 3: Apply styling
    if (stylingJobs.length > 0) {
      doc = await docs.documents.get({ documentId: DOC_ID });
      const currentTableBlock = doc.data.body?.content?.find(el => el.table);
      const currentTable = currentTableBlock.table;
      
      const styleRequests = [];
      stylingJobs.forEach(job => {
        const cell = currentTable.tableRows[job.rowIdx].tableCells[job.colIdx];
        let foundOffset = -1;
        // Search elements in the cell to find the exact offset of the string
        for (const el of cell.content) {
          if (el.paragraph) {
            for (const run of el.paragraph.elements) {
              if (run.textRun && run.textRun.content) {
                const idx = run.textRun.content.indexOf(job.text);
                if (idx !== -1) {
                  foundOffset = run.startIndex + idx;
                  break;
                }
              }
            }
          }
          if (foundOffset !== -1) break;
        }
        
        if (foundOffset !== -1) {
          styleRequests.push({
            updateTextStyle: {
              range: { startIndex: foundOffset, endIndex: foundOffset + job.text.length },
              textStyle: { bold: job.bold, link: job.link ? { url: job.link } : null },
              fields: "bold,link"
            }
          });
        }
      });
      
      if (styleRequests.length > 0) {
        await docs.documents.batchUpdate({ documentId: DOC_ID, requestBody: { requests: styleRequests } });
      }
    }

    // Pass 4: Apply paragraph styles (HEADING_1, HEADING_2, etc.)
    if (paragraphStylingJobs.length > 0) {
      doc = await docs.documents.get({ documentId: DOC_ID });
      const currentTableBlock = doc.data.body?.content?.find(el => el.table);
      const currentTable = currentTableBlock.table;
      
      const paragraphRequests = [];
      paragraphStylingJobs.forEach(job => {
        const cell = currentTable.tableRows[job.rowIdx].tableCells[job.colIdx];
        let foundOffset = -1;
        for (const el of cell.content) {
          if (el.paragraph) {
            for (const run of el.paragraph.elements) {
              if (run.textRun && run.textRun.content) {
                const idx = run.textRun.content.indexOf(job.text);
                if (idx !== -1) {
                  foundOffset = run.startIndex + idx;
                  break;
                }
              }
            }
          }
          if (foundOffset !== -1) break;
        }
        
        if (foundOffset !== -1) {
          paragraphRequests.push({
            updateParagraphStyle: {
              range: { startIndex: foundOffset, endIndex: foundOffset + 1 },
              paragraphStyle: { namedStyleType: job.heading },
              fields: "namedStyleType"
            }
          });
        }
      });
      
      if (paragraphRequests.length > 0) {
        await docs.documents.batchUpdate({ documentId: DOC_ID, requestBody: { requests: paragraphRequests } });
      }
    }
  }

  console.log('✅ Success! Upgraded positional authoring with real inline images written to Google Doc.');
}

main().catch(err => console.error(err));

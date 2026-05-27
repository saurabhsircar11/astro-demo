import { google } from 'googleapis';

// Helper to escape HTML characters except existing tags
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Extracts and translates a text run into an HTML fragment.
 */
function parseTextRun(run: any): string {
  let text = run.content || '';
  if (!text) return '';

  // Clean trailing Google Doc paragraph markers
  text = escapeHtml(text);

  const style = run.textStyle;
  if (!style) return text;

  let styles: string[] = [];

  // Font Size
  if (style.fontSize?.magnitude) {
    styles.push(`font-size: ${style.fontSize.magnitude}pt`);
  }

  // Font Weight
  if (style.weightedFontFamily?.weight) {
    styles.push(`font-weight: ${style.weightedFontFamily.weight}`);
  }

  // Text Color
  if (style.foregroundColor?.color?.rgbColor) {
    const rgb = style.foregroundColor.color.rgbColor;
    const r = Math.round((rgb.red || 0) * 255);
    const g = Math.round((rgb.green || 0) * 255);
    const b = Math.round((rgb.blue || 0) * 255);
    styles.push(`color: rgb(${r}, ${g}, ${b})`);
  }

  let html = text;

  // Apply bold/italic/underline wrappers
  if (style.bold && !style.weightedFontFamily?.weight) {
    html = `<strong>${html}</strong>`;
  }
  if (style.italic) {
    html = `<em>${html}</em>`;
  }
  if (style.underline) {
    html = `<u>${html}</u>`;
  }

  // Apply span with styles if any
  if (styles.length > 0) {
    html = `<span style="${styles.join('; ')}">${html}</span>`;
  }

  // Apply hyperlink wrapper
  if (style.link?.url) {
    html = `<a href="${style.link.url}">${html}</a>`;
  }

  return html;
}

/**
 * Parses a paragraph into HTML, selecting h1-h3 tags or p tags.
 */
function parseParagraph(paragraph: any, inlineObjects: any): string {
  const namedStyle = paragraph.paragraphStyle?.namedStyleType;
  let tag = 'p';

  if (namedStyle === 'HEADING_1') tag = 'h1';
  else if (namedStyle === 'HEADING_2') tag = 'h2';
  else if (namedStyle === 'HEADING_3') tag = 'h3';
  else if (namedStyle === 'HEADING_4') tag = 'h4';

  let content = '';

  for (const element of paragraph.elements || []) {
    if (element.textRun) {
      content += parseTextRun(element.textRun);
    } else if (element.inlineObjectElement) {
      // Check for inline images copy-pasted directly into the cell
      const objId = element.inlineObjectElement.inlineObjectId;
      const embeddedObj = inlineObjects?.[objId]?.inlineObjectProperties?.embeddedObject;
      if (embeddedObj?.imageProperties?.contentUri) {
        const imgUrl = embeddedObj.imageProperties.contentUri;
        content += `<img src="${imgUrl}" alt="Inline Object" />`;
      }
    }
  }

  // Skip rendering empty paragraphs
  if (!content.replace(/&nbsp;/g, '').trim()) {
    return '';
  }

  return `<${tag}>${content}</${tag}>`;
}

/**
 * Extracts all paragraph content inside a cell.
 */
function parseCellContent(cell: any, inlineObjects: any): string {
  let cellHtml = '';
  for (const element of cell.content || []) {
    if (element.paragraph) {
      cellHtml += parseParagraph(element.paragraph, inlineObjects);
    }
  }
  
  // Clean empty paragraphs wrapper if it's just raw text to fit in a single block field,
  // or return the paragraphs directly if they represent multiple items.
  const trimmed = cellHtml.trim();
  if (trimmed.startsWith('<p>') && trimmed.endsWith('</p>') && (trimmed.match(/<p>/g) || []).length === 1) {
    // Return inner text runs without paragraph tag wrapper for cleaner templates
    return trimmed.slice(3, -4);
  }
  return trimmed;
}

/**
 * Parses Google Docs table elements into blocks.
 */
function parseTableBlock(table: any, inlineObjects: any) {
  const rows = table.tableRows || [];
  if (rows.length === 0) return null;

  // Header Cell identifies the block type (e.g. COMPONENT: Hero)
  const firstRowCells = rows[0].tableCells || [];
  if (firstRowCells.length === 0) return null;

  const headerText = parseCellContent(firstRowCells[0], inlineObjects).trim();
  
  // 1. Detect METADATA block
  if (headerText.toUpperCase() === 'METADATA') {
    const data: Record<string, string> = {};
    for (let r = 1; r < rows.length; r++) {
      const cells = rows[r].tableCells || [];
      if (cells.length >= 2) {
        const key = parseCellContent(cells[0], inlineObjects).trim().replace(/<\/?[^>]+(>|$)/g, ''); // strip tag wrappers
        const val = parseCellContent(cells[1], inlineObjects).trim().replace(/<\/?[^>]+(>|$)/g, '');
        if (key) data[key] = val;
      }
    }
    return { type: 'METADATA', data };
  }

  // 2. Detect Components (format: "COMPONENT: ComponentName" or similar)
  const componentMatch = headerText.match(/COMPONENT:\s*(\w+)/i);
  if (!componentMatch) return null;

  const componentType = componentMatch[1];
  const data: Record<string, any> = {};

  // Check if component represents a list/grid structure (e.g., FAQ, ServicesGrid, Metrics)
  const isListBlock = ['FAQ', 'SERVICESGRID', 'METRICS'].includes(componentType.toUpperCase());

  // StudioCards: mixed — first rows are key-value config, then item rows (Title|Desc|Image|Link)
  if (componentType.toUpperCase() === 'STUDIOCARDS') {
    const items: any[] = [];
    // Rows 1-4: config keys (sectionTitle, sectionSubtitle, sectionBody, ctaText+ctaUrl)
    for (let r = 1; r <= 4 && r < rows.length; r++) {
      const cells = rows[r].tableCells || [];
      if (cells.length >= 2) {
        const k1 = parseCellContent(cells[0], inlineObjects).trim().replace(/<\/?[^>]+(>|$)/g, '');
        const v1 = parseCellContent(cells[1], inlineObjects).trim().replace(/<\/?[^>]+(>|$)/g, '');
        if (k1) data[k1] = v1;
        // Row 4 has ctaText + ctaUrl in cols 0-1 and 2-3
        if (cells.length >= 4) {
          const k2 = parseCellContent(cells[2], inlineObjects).trim().replace(/<\/?[^>]+(>|$)/g, '');
          const v2 = parseCellContent(cells[3], inlineObjects).trim().replace(/<\/?[^>]+(>|$)/g, '');
          if (k2) data[k2] = v2;
        }
      }
    }
    // Rows 5+: item rows (Title | Description | Image URL | Link)
    for (let r = 5; r < rows.length; r++) {
      const cells = rows[r].tableCells || [];
      if (cells.length >= 2) {
        const title = parseCellContent(cells[0], inlineObjects).trim().replace(/<\/?[^>]+(>|$)/g, '');
        const description = parseCellContent(cells[1], inlineObjects).trim().replace(/<\/?[^>]+(>|$)/g, '');
        const image = cells[2] ? parseCellContent(cells[2], inlineObjects).trim().replace(/<\/?[^>]+(>|$)/g, '') : '';
        const link = cells[3] ? parseCellContent(cells[3], inlineObjects).trim().replace(/<\/?[^>]+(>|$)/g, '') : '#';
        if (title) items.push({ title, description, image, link });
      }
    }
    data.items = items;
    return { type: componentType, data };
  }

  // LogoScroll: row 1 = sectionTitle key-val, rows 2+ = name|logo pairs
  if (componentType.toUpperCase() === 'LOGOSCROLL') {
    const items: any[] = [];
    // Row 1: sectionTitle
    if (rows[1]) {
      const cells = rows[1].tableCells || [];
      if (cells.length >= 2) {
        const key = parseCellContent(cells[0], inlineObjects).trim().replace(/<\/?[^>]+(>|$)/g, '');
        const val = parseCellContent(cells[1], inlineObjects).trim().replace(/<\/?[^>]+(>|$)/g, '');
        if (key) data[key] = val;
      }
    }
    // Rows 2+: name | logo SVG URL
    for (let r = 2; r < rows.length; r++) {
      const cells = rows[r].tableCells || [];
      if (cells.length >= 2) {
        const name = parseCellContent(cells[0], inlineObjects).trim().replace(/<\/?[^>]+(>|$)/g, '');
        const logo = parseCellContent(cells[1], inlineObjects).trim().replace(/<\/?[^>]+(>|$)/g, '');
        if (name && logo) items.push({ name, logo });
      }
    }
    data.items = items;
    return { type: componentType, data };
  }

  if (isListBlock) {
    const items: any[] = [];
    // Row 1 lists column headers. Row 2+ are the actual items
    const headerRowCells = rows[1]?.tableCells || [];
    const keys = headerRowCells.map(c => parseCellContent(c, inlineObjects).trim().replace(/<\/?[^>]+(>|$)/g, '').toLowerCase());

    for (let r = 2; r < rows.length; r++) {
      const cells = rows[r].tableCells || [];
      const item: Record<string, any> = {};
      
      for (let c = 0; c < cells.length; c++) {
        const key = keys[c] || `field${c}`;
        const val = parseCellContent(cells[c], inlineObjects).trim();
        item[key] = val;
      }
      
      // Only push if the first item field contains content
      if (Object.values(item).some(v => v)) {
        items.push(item);
      }
    }
    
    data.items = items;
  } else {
    // For standard Key-Value blocks (like Hero, TwoColumn)
    for (let r = 1; r < rows.length; r++) {
      const cells = rows[r].tableCells || [];
      if (cells.length >= 2) {
        const key = parseCellContent(cells[0], inlineObjects).trim().replace(/<\/?[^>]+(>|$)/g, '');
        const val = parseCellContent(cells[1], inlineObjects).trim();
        
        // Handle background images inserted as inline image elements
        if (key === 'backgroundImage' || key === 'image') {
          // If the cell contains an image element, parseCellContent returns `<img src="..."/>`
          const imgMatch = val.match(/src="([^"]+)"/);
          if (imgMatch) {
            data[key] = imgMatch[1];
            continue;
          }
        }
        
        if (key) data[key] = val;
      }
    }
  }

  return { type: componentType, data };
}

/**
 * Authenticates with Google and parses the Google Doc body into our AST structure.
 */
export async function parseGoogleDoc(documentId: string) {
  const auth = new google.auth.GoogleAuth({
    scopes: [
      'https://www.googleapis.com/auth/documents.readonly',
      'https://www.googleapis.com/auth/drive.readonly'
    ],
  });

  const docs = google.docs({ version: 'v1', auth });
  const response = await docs.documents.get({ documentId });
  const doc = response.data;

  const blocks: any[] = [];
  let metadata: Record<string, string> = {};

  for (const element of doc.body?.content || []) {
    if (element.table) {
      const block = parseTableBlock(element.table, doc.inlineObjects);
      if (block) {
        if (block.type === 'METADATA') {
          metadata = block.data;
        } else {
          blocks.push(block);
        }
      }
    }
  }

  return { metadata, blocks };
}

/**
 * Connects to Google Drive API and searches for a document by name (slug) inside a mounted folder.
 * This matches Adobe Milo's dynamic routing concept.
 */
export async function resolveSlugToDocId(folderId: string, slug: string): Promise<string | null> {
  const auth = new google.auth.GoogleAuth({
    scopes: [
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/documents.readonly'
    ],
  });

  const drive = google.drive({ version: 'v3', auth });
  
  // Default to "index" if the slug is empty (the homepage)
  const fileName = slug === '' ? 'index' : slug;
  console.log(`[DriveResolver] Resolving file name: "${fileName}" in folder: ${folderId}`);

  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and name = '${fileName}' and mimeType = 'application/vnd.google-apps.document' and trashed = false`,
      fields: 'files(id, name)',
      pageSize: 1
    });

    const files = response.data.files || [];
    if (files.length > 0 && files[0].id) {
      console.log(`[DriveResolver] Resolved "${fileName}" to Document ID: ${files[0].id}`);
      return files[0].id;
    }
    console.log(`[DriveResolver] Document name "${fileName}" not found in shared folder.`);
    return null;
  } catch (err: any) {
    console.error('[DriveResolver] Error resolving slug via Google Drive API:', err.message);
    throw err;
  }
}

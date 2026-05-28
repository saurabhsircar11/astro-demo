# Zero-Config Extensible Page Composition

We will refactor the Document Authoring platform to be fully extensible, zero-config, and schema-free. The system will use lowercase kebab-case naming for all components and dynamically map table columns to template variables using column headers defined during content authoring in the Google Doc.

This removes the need for separate JSON schemas, HTML comment configurations, or editing the web engine core.

## User Review Required

> [!IMPORTANT]
> - **Kebab-Case Naming Standard**:
>   All component tables in the Google Doc will follow lowercase kebab-case (e.g., `COMPONENT: studio-cards` instead of `COMPONENT: studioCards`).
> - **Authoring List Headers**:
>   All list-based component tables in the Google Doc will include a column header row (e.g. `Title | Description | Image | Link` or `Name | Logo`). The parser will extract the keys directly from these header values.
> - **Zero Engine or Schema Changes for New Components**:
>   To add a custom component, a developer only needs to create the HTML (e.g., `testimonials.html`) and CSS on the CDN. No other files are modified.

---

## Proposed Changes

### 1. Unified Table Parser

#### [MODIFY] [docParser.ts](file:///Users/saurabh.sircar/Globant/astro-demo/apps/web-engine-project/src/utils/docParser.ts)
* Simplify `parseTableBlock` to parse tables dynamically into a structured object containing list items and properties:
  ```typescript
  export interface Block {
    type: string; // e.g. "studio-cards"
    data: Record<string, any>;
  }
  ```
* **Parsing Algorithm**:
  1. Determine `componentType` from Row 0 (convert to lowercase kebab-case, e.g., `COMPONENT: StudioCards` becomes `studio-cards`).
  2. Initialize `data = {}` and `items = []`.
  3. For each subsequent row:
     - If the row has 2 columns, and column 0 matches a lowercase camelCase key name (regex `^[a-z][a-zA-Z0-9]*$`):
       - Save to `data[key] = value`.
     - If the row has 4 columns, and column 0 and column 2 both match `^[a-z][a-zA-Z0-9]*$`:
       - Save to `data[key1] = val1`, `data[key2] = val2`.
     - Otherwise (a list row):
       - Parse all cell contents and push to a raw list `items` array.
  4. If a list is present:
     - Treat the first list row as column headers. Clean and lowercase each header to define the keys (e.g. `['title', 'description', 'image', 'link']`).
     - Map all subsequent list rows into objects using these keys and push them to `data.items`.

---

### 2. Astro Page Renderer Updates

#### [MODIFY] [[...slug].astro](file:///Users/saurabh.sircar/Globant/astro-demo/apps/web-engine-project/src/pages/[...slug].astro)
* Remove all hardcoded component checks (`Hero`, `TwoColumn`, `StudioCards` checks).
* Update rendering loop to:
  1. Fetch `htmlTemplate` and `cssContent` using the lowercase kebab-case component name (e.g. `studio-cards.html`).
  2. Scan `data` properties and `data.items` objects. Any string matching an image URL (ends with `.jpg`/`.png`/`.webp`/`.svg` or key containing `image`/`logo`/`background`) is automatically optimized:
     - Apply `optimizeImageUrl(url, defaultWidth)`.
     - Append a corresponding `[key]Srcset` variable.
  3. Pass the final data payload to `renderTemplate`.

---

### 3. Frontend Components Naming Update

We will rename the component files inside `core-assets-pipeline/src/` to lowercase kebab-case:
* `Hero.html` / `Hero.css` -> `hero.html` / `hero.css`
* `TwoColumn.html` / `TwoColumn.css` -> `two-column.html` / `two-column.css`
* `StudioCards.html` / `StudioCards.css` -> `studio-cards.html` / `studio-cards.css`
* `LogoScroll.html` / `LogoScroll.css` -> `logo-scroll.html` / `logo-scroll.css`
* `FAQ.html` / `FAQ.css` / `FAQ.js` -> `faq.html` / `faq.css` / `faq.js`
* `ServicesGrid.html` / `ServicesGrid.css` -> `services-grid.html` / `services-grid.css`
* `Metrics.html` / `Metrics.css` -> `metrics.html` / `metrics.css`

---

### 4. Google Doc Templates Update

#### [MODIFY] [populate_doc.mjs](file:///Users/saurabh.sircar/Globant/astro-demo/apps/web-engine-project/populate_doc.mjs)
* Update table names to lowercase kebab-case (e.g. `COMPONENT: studio-cards`).
* Add a column header row to `studio-cards` (`Title` | `Description` | `Image` | `Link`) and `logo-scroll` (`Name` | `Logo`) so that the parser can dynamically extract keys from the document content.

---

## Verification Plan

### Automated Tests
1. **Rebuild & Start Services**:
   ```bash
   docker-compose exec web-engine npm run build
   docker-compose restart web-engine
   ```
2. **Verify AST Layout**:
   Query `/globant-demo` and ensure AST parsing has zero hardcoded checks and maps components correctly.

### Manual Verification
- Load `http://localhost:3001/globant-demo` and verify that the page renders perfectly.
- Inspect the generated HTML to ensure `srcset` and `webp` images are fully intact.
- Verify that adding a custom component does not touch the engine files.

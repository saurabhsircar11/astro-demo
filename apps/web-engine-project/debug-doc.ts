import { getPageAST } from './src/utils/contentProvider.js';
import path from 'path';
import fs from 'fs';

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.log("Error: Please provide a slug or Google Doc ID.");
    console.log("Usage: npm run debug-doc <slug-or-doc-id>");
    console.log("Example: npm run debug-doc globant-demo-new-authoring");
    process.exit(1);
  }

  // Set default env values if not explicitly provided, checking both root and local folder
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    if (fs.existsSync('service-account.json')) {
      process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve('service-account.json');
    } else if (fs.existsSync('apps/web-engine-project/service-account.json')) {
      process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve('apps/web-engine-project/service-account.json');
    } else if (fs.existsSync('../apps/web-engine-project/service-account.json')) {
      process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve('../apps/web-engine-project/service-account.json');
    } else {
      process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve('service-account.json');
    }
  }
  
  if (!process.env.GOOGLE_DRIVE_FOLDER_ID) {
    process.env.GOOGLE_DRIVE_FOLDER_ID = '1SuWQ9MJmfzJzhRD20bnV3A5ejIf8zVfy';
  }

  console.log(`[Debugger] Using credentials at: "${process.env.GOOGLE_APPLICATION_CREDENTIALS}"`);
  console.log(`[Debugger] Fetching and parsing document for: "${slug}"...`);
  try {
    const ast = await getPageAST(slug);
    console.log("\n================ PARSED AST JSON ================");
    console.log(JSON.stringify(ast, null, 2));
    console.log("=================================================\n");
  } catch (err: any) {
    console.error("[Debugger] Error parsing document:", err.message);
    process.exit(1);
  }
}

main();

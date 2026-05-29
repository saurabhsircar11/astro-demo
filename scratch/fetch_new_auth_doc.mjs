
import { resolveSlugToDocId, parseGoogleDoc } from '../apps/web-engine-project/src/utils/docParser.ts';
import fs from 'fs';
import path from 'path';

async function run() {
  try {
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || '1SuWQ9MJmfzJzhRD20bnV3A5ejIf8zVfy';
    console.log("Folder ID:", folderId);
    
    // Resolve slug 'globant-demo-new-authoring'
    const docId = await resolveSlugToDocId(folderId, 'globant-demo-new-authoring');
    if (!docId) {
      console.log("Could not find globant-demo-new-authoring");
      return;
    }
    console.log("Doc ID:", docId);
    
    // Set credentials path relative to Cwd
    process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve('apps/web-engine-project/service-account.json');
    
    const doc = await parseGoogleDoc(docId);
    fs.writeFileSync('scratch/new-authoring-ast.json', JSON.stringify(doc, null, 2));
    console.log("Wrote to scratch/new-authoring-ast.json");
  } catch (e) {
    console.error(e);
  }
}
run();

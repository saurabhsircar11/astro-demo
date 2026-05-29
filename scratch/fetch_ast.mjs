
import { resolveSlugToDocId, parseGoogleDoc } from '../apps/web-engine-project/src/utils/docParser.ts';
import fs from 'fs';

async function run() {
  try {
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    console.log("Folder ID:", folderId);
    const docId = await resolveSlugToDocId(folderId, 'globant-demo');
    if (!docId) {
      console.log("Could not find globant-demo");
      return;
    }
    console.log("Doc ID:", docId);
    const doc = await parseGoogleDoc(docId);
    fs.writeFileSync('scratch/globant-demo-ast.json', JSON.stringify(doc, null, 2));
    console.log("Wrote to scratch/globant-demo-ast.json");
  } catch (e) {
    console.error(e);
  }
}
run();

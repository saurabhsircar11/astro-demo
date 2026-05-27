import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const KEY_FILE = path.resolve('apps/web-engine-project/service-account.json');
const FOLDER_ID = '1SuWQ9MJmfzJzhRD20bnV3A5ejIf8zVfy';

async function main() {
  if (!fs.existsSync(KEY_FILE)) {
    console.error(`Key file not found at ${KEY_FILE}`);
    process.exit(1);
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE,
    scopes: [
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/documents.readonly'
    ],
  });

  const drive = google.drive({ version: 'v3', auth });

  console.log(`Querying Drive folder "${FOLDER_ID}"...`);
  try {
    const response = await drive.files.list({
      q: `'${FOLDER_ID}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType)',
    });
    const files = response.data.files || [];
    console.log(`Found ${files.length} files inside folder:`);
    for (const file of files) {
      console.log(`- Name: "${file.name}" | ID: ${file.id} | MimeType: ${file.mimeType}`);
    }
  } catch (err) {
    console.error('Error querying Google Drive folder:', err.message);
  }
}

main();

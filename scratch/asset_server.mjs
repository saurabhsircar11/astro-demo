import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 8080;
const SRC_DIR = path.resolve('core-assets-pipeline/src');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript'
};

const server = http.createServer((req, res) => {
  // Clean request URL to match filename and prevent directory traversal
  const filename = req.url.split('?')[0]; // strip query parameters (?branch= etc)
  const basename = path.basename(filename);
  const filePath = path.join(SRC_DIR, basename);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end(`File Not Found: ${basename}`);
      return;
    }
    const ext = path.extname(filePath);
    res.statusCode = 200;
    res.setHeader('Content-Type', MIME_TYPES[ext] || 'text/plain');
    
    // Add CORS headers so Astro can query it locally if needed
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`[CDN Simulator] Serving local templates on http://localhost:${PORT}`);
});

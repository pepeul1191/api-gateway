
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3004;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  const start = Date.now();

  // Registrar petición
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  // Registrar respuesta al finalizar
  res.on('finish', () => {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} - ${Date.now() - start}ms`
    );
  });

  // Headers
  res.setHeader('X-Powered-By', 'Node.js');

  // Normalizar ruta
  const safePath = path.normalize(decodeURIComponent(req.url.split('?')[0]))
    .replace(/^(\.\.[/\\])+/, '');

  const filePath = path.join(
    PUBLIC_DIR,
    safePath === '/' ? 'index.html' : safePath.replace(/^[/\\]+/, '')
  );

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, {
        'Content-Type': 'text/plain; charset=UTF-8'
      });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400'
    });

    fs.createReadStream(filePath)
      .on('error', (error) => {
        console.error('File stream error:', error.message);
        if (!res.headersSent) {
          res.writeHead(500);
        }
        res.end();
      })
      .pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Static server running on port ${PORT}`);
  console.log(`Public directory: ${PUBLIC_DIR}`);
});

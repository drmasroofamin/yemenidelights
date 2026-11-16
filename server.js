const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const port = Number(process.env.PORT || 3000);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = new URL(req.url, 'http://localhost').pathname;
  } catch {
    res.writeHead(400);
    return res.end('Bad request');
  }
  let decoded;
  try {
    decoded = decodeURIComponent(pathname === '/' ? '/index.html' : pathname);
  } catch {
    res.writeHead(400);
    return res.end('Bad request');
  }
  const file = path.resolve(root, '.' + decoded);
  if (file !== root && !file.startsWith(root + path.sep)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end('Not found');
    }
    res.setHeader('Content-Type', types[path.extname(file).toLowerCase()] || 'application/octet-stream');
    res.end(data);
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Yemeni Delights listening on ${port}`);
});

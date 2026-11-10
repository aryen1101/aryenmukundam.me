import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const port = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, 'dist');
const mimeTypes = { '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.pdf': 'application/pdf', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2' };

const sendJson = (res, status, payload) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
};

const serveFile = (res, filePath) => fs.readFile(filePath, (error, file) => {
  if (error) return sendJson(res, 404, { error: 'Not found' });
  res.writeHead(200, { 'Content-Type': mimeTypes[path.extname(filePath)] || 'application/octet-stream' });
  res.end(file);
});

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (requestUrl.pathname === '/api/health') return sendJson(res, 200, { status: 'ok', service: 'aryen-portfolio' });

  if (requestUrl.pathname === '/api/github/repos') {
    try {
      const response = await fetch('https://api.github.com/users/aryen1101/repos?sort=updated&per_page=100', { headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'aryen-portfolio' } });
      if (!response.ok) return sendJson(res, response.status, { error: 'GitHub repositories are temporarily unavailable.' });
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' });
      return res.end(JSON.stringify(await response.json()));
    } catch {
      return sendJson(res, 502, { error: 'Unable to reach GitHub right now.' });
    }
  }

  const requestedPath = requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname;
  const safePath = path.normalize(requestedPath).replace(/^([.][.][\\/])+/, '');
  const filePath = path.join(distPath, safePath);
  if (!filePath.startsWith(distPath + path.sep)) return sendJson(res, 400, { error: 'Bad path' });
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) return serveFile(res, filePath);
  return serveFile(res, path.join(distPath, 'index.html'));
});

server.listen(port, () => console.log(`Portfolio server running at http://localhost:${port}`));

// Simple static server + runner for Playwright-driven browser tests
// Serves current repository at http://localhost:8000, runs test script, then shuts down.

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8000;

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.csv': 'text/csv; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };
  return map[ext] || 'application/octet-stream';
}

function createServer(rootDir) {
  return http.createServer((req, res) => {
    try {
      const urlPath = decodeURI(req.url.split('?')[0]);
      let fsPath = path.join(rootDir, urlPath);

      // Prevent path traversal
      if (!fsPath.startsWith(path.resolve(rootDir))) {
        res.statusCode = 403; res.end('Forbidden'); return;
      }

      // If directory, serve index.html
      if (fs.existsSync(fsPath) && fs.statSync(fsPath).isDirectory()) {
        fsPath = path.join(fsPath, 'index.html');
      }

      // Fallback to index.html when requesting root
      if (urlPath === '/' && !fs.existsSync(fsPath)) {
        fsPath = path.join(rootDir, 'index.html');
      }

      fs.readFile(fsPath, (err, data) => {
        if (err) {
          res.statusCode = 404; res.end('Not found'); return;
        }
        res.setHeader('Content-Type', getContentType(fsPath));
        res.end(data);
      });
    } catch (e) {
      res.statusCode = 500; res.end('Server error');
    }
  });
}

// Pre-check for Playwright availability (user should have run `npm i` and `npx playwright install`)
function checkPlaywright() {
  try {
    require.resolve('playwright');
    return true;
  } catch {
    console.error('\nMissing dependency: playwright');
    console.error('Run: npm i -D playwright && npx playwright install');
    return false;
  }
}

async function main() {
  if (!checkPlaywright()) process.exit(1);

  const server = createServer(process.cwd());
  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`Static server running at http://localhost:${PORT}/`);

  const child = spawn(process.execPath, ['test_vocab_app.js'], { stdio: 'inherit' });

  child.on('exit', code => {
    server.close(() => {
      console.log('Server closed.');
      process.exit(code || 0);
    });
  });
}

main();


// Start a static server, run browser E2E + validators, report combined status

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8000;
const ROOT = process.cwd();

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
      const urlPath = decodeURI((req.url || '/').split('?')[0]);
      let fsPath = path.join(rootDir, urlPath);
      // prevent traversal
      if (!path.resolve(fsPath).startsWith(path.resolve(rootDir))) {
        res.statusCode = 403; res.end('Forbidden'); return;
      }
      if (fs.existsSync(fsPath) && fs.statSync(fsPath).isDirectory()) {
        fsPath = path.join(fsPath, 'index.html');
      }
      if (urlPath === '/' && !fs.existsSync(fsPath)) {
        fsPath = path.join(rootDir, 'index.html');
      }
      fs.readFile(fsPath, (err, data) => {
        if (err) { res.statusCode = 404; res.end('Not found'); return; }
        res.setHeader('Content-Type', getContentType(fsPath));
        res.end(data);
      });
    } catch (e) {
      res.statusCode = 500; res.end('Server error');
    }
  });
}

function checkPlaywright() {
  try { require.resolve('playwright'); return true; }
  catch { console.error('\nMissing dependency: playwright'); console.error('Run: npm i -D playwright && npx playwright install'); return false; }
}

function runNode(script) {
  return new Promise(resolve => {
    const child = spawn(process.execPath, [script], { stdio: 'inherit' });
    child.on('exit', code => resolve(code || 0));
  });
}

(async function main(){
  if (!checkPlaywright()) process.exit(1);

  const server = createServer(ROOT);
  await new Promise(r => server.listen(PORT, r));
  console.log(`Static server running at http://localhost:${PORT}/`);

  const results = {};
  results.e2e = await runNode('test_vocab_app.js');
  results.validate = await runNode('validate_functionality.js');
  if (fs.existsSync(path.join(ROOT, 'final_test_validation.js'))) {
    results.final = await runNode('final_test_validation.js');
  }

  const summary = Object.entries(results).map(([k,v]) => `${k}:${v===0?'ok':'fail'}`).join('  ');
  console.log(`\nSummary → ${summary}`);

  const exitCode = Object.values(results).some(code => code !== 0) ? 1 : 0;
  server.close(() => process.exit(exitCode));
})();


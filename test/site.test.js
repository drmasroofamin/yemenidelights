const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { spawn } = require('node:child_process');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

test('demo credit is bilingual and reaches SunriseAI', () => {
  assert.match(html, /Demo prepared by SunriseAI/);
  assert.match(html, /نموذج تجريبي من إعداد SunriseAI/);
  assert.match(html, /mailto:masroof@sunriseaisolution\.org/);
});

test('known public contact is present and copy is not placeholder text', () => {
  assert.match(html, /mailto:ydsaudi@yahoo\.com/);
  assert.doesNotMatch(html, /lorem ipsum/i);
  assert.doesNotMatch(html, /coming soon|todo|fixme|your text here/i);
});

test('title, description, and icons are set', () => {
  assert.match(html, /<title>Yemeni Delights • A taste of Yemen in Jeddah<\/title>/);
  assert.match(html, /name="description"/);
  assert.match(html, /rel="icon" href="favicon\.svg"/);
  assert.ok(fs.existsSync(path.join(root, 'favicon.svg')));
  assert.ok(fs.existsSync(path.join(root, 'favicon.ico')));
  assert.ok(fs.existsSync(path.join(root, 'apple-touch-icon.png')));
});

test('dish photos are local, split, and light enough for a phone', () => {
  for (const name of ['mandi.jpg', 'bread.jpg', 'tea.jpg']) {
    const file = path.join(root, 'assets', name);
    assert.ok(fs.existsSync(file), name);
    const size = fs.statSync(file).size;
    assert.ok(size < 500_000, `${name} is ${size} bytes`);
  }
  assert.doesNotMatch(html, /mandi\.png|pair\.png/);
  assert.equal(fs.existsSync(path.join(root, 'assets', 'mandi.png')), false);
  assert.equal(fs.existsSync(path.join(root, 'assets', 'pair.png')), false);
});

test('vercel serves the site as static files', () => {
  const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
  assert.equal(config.framework, null);
  assert.equal(config.buildCommand, null);
  assert.equal(config.outputDirectory, '.');
});

function get(port, pathname) {
  return new Promise((resolve, reject) => {
    const req = http.get({ hostname: '127.0.0.1', port, path: pathname }, (res) => {
      res.resume();
      res.on('end', () => resolve({ status: res.statusCode, type: res.headers['content-type'] || '' }));
    });
    req.on('error', reject);
  });
}

test('local server serves the page and icons, and rejects bad paths', async () => {
  const port = 8765;
  const child = spawn(process.execPath, ['server.js'], {
    cwd: root,
    env: { ...process.env, PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let stderr = '';
  child.stderr.on('data', (chunk) => { stderr += chunk; });
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`server did not start\n${stderr}`)), 5000);
      child.stdout.on('data', () => { clearTimeout(timer); resolve(); });
      child.on('exit', (code) => { clearTimeout(timer); reject(new Error(`server exited ${code}\n${stderr}`)); });
    });
    const page = await get(port, '/');
    assert.equal(page.status, 200);
    assert.match(page.type, /text\/html/);
    const icon = await get(port, '/favicon.svg');
    assert.equal(icon.status, 200);
    assert.match(icon.type, /image\/svg\+xml/);
    const photo = await get(port, '/assets/mandi.jpg');
    assert.equal(photo.status, 200);
    assert.match(photo.type, /image\/jpeg/);
    assert.equal((await get(port, '/missing-page')).status, 404);
    assert.equal((await get(port, '/%')).status, 400);
    assert.equal((await get(port, '/%2e%2e%2fpackage.json')).status, 403);
    assert.equal(child.exitCode, null);
  } finally {
    child.kill();
  }
});

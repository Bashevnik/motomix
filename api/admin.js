const crypto = require('crypto');

const DEFAULT_USER = 'admin.motomix';
const DEFAULT_HASH = 'ffbb40173f1eac8cc3579d7f9c8945357f1fe978aa9335e71ed6f7814de58ca9e4d56699152468bb93bac6c1040245203e2c81861f8645a02c31bda17ef52d09';
const SALT = 'motomix-admin-v1';
const REPO = () => process.env.MOTOMIX_GITHUB_REPO || 'Bashevnik/motomix';
const BRANCH = () => process.env.MOTOMIX_GITHUB_BRANCH || 'main';

function clean(v, max = 500) { return String(v == null ? '' : v).trim().slice(0, max); }
function json(res, status, body) { return res.status(status).json(body); }

function credentials(req) {
  const raw = String(req.headers.authorization || '');
  if (!raw.startsWith('Basic ')) return null;
  try {
    const value = Buffer.from(raw.slice(6), 'base64').toString('utf8');
    const at = value.indexOf(':');
    return at < 0 ? null : { user: clean(value.slice(0, at), 80), password: value.slice(at + 1) };
  } catch { return null; }
}

function isAdmin(req) {
  const auth = credentials(req);
  if (!auth) return false;
  const user = process.env.MOTOMIX_ADMIN_USER || DEFAULT_USER;
  const hash = process.env.MOTOMIX_ADMIN_PASSWORD_SCRYPT || DEFAULT_HASH;
  const candidate = crypto.scryptSync(auth.password, SALT, 64).toString('hex');
  try { return auth.user === user && crypto.timingSafeEqual(Buffer.from(candidate, 'hex'), Buffer.from(hash, 'hex')); }
  catch { return false; }
}

function githubToken(req) { return clean(req.headers['x-motomix-github-token'], 300); }
async function github(req, method, pathname, body) {
  const token = githubToken(req);
  if (!token) throw new Error('Додайте GitHub token у налаштуваннях панелі.');
  const response = await fetch(`https://api.github.com${pathname}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'User-Agent': 'motomix-admin', 'X-GitHub-Api-Version': '2022-11-28' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${response.status}: ${data.message || 'GitHub error'}`);
  return data;
}

async function saveFile(req, body) {
  const path = clean(body.path, 180).replace(/^\/+/, '');
  if (!/^(catalog-overrides\.js|assets\/admin\/[a-z0-9-]+\.(jpg|jpeg|png|webp))$/i.test(path)) throw new Error('Неприпустимий шлях файлу.');
  const content = clean(body.content, 5_600_000);
  if (!content) throw new Error('Немає даних для збереження.');
  const base = `/repos/${REPO()}/contents/${encodeURIComponent(path).replace(/%2F/g, '/')}`;
  let sha;
  try { sha = (await github(req, 'GET', `${base}?ref=${encodeURIComponent(BRANCH())}`)).sha; }
  catch (e) { if (!/404/.test(String(e.message))) throw e; }
  return github(req, 'PUT', base, { message: clean(body.message, 120) || `Admin update: ${path}`, content, branch: BRANCH(), ...(sha ? { sha } : {}) });
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();
  const action = clean(req.query && req.query.action || req.body && req.body.action, 30);
  if (!isAdmin(req)) return json(res, 401, { error: 'Невірний логін або пароль.' });
  if (req.method === 'GET' && action === 'session') return json(res, 200, { ok: true, user: process.env.MOTOMIX_ADMIN_USER || DEFAULT_USER });
  if (req.method === 'POST' && action === 'login') return json(res, 200, { ok: true, user: process.env.MOTOMIX_ADMIN_USER || DEFAULT_USER });
  if (req.method === 'GET' && action === 'orders') {
    try { const { loadCfg } = require('./_store.js'); const cfg = await loadCfg(); return json(res, 200, { ok: true, orders: cfg.orders || [] }); }
    catch { return json(res, 200, { ok: true, orders: [] }); }
  }
  if (req.method === 'POST' && (action === 'save' || action === 'upload')) {
    try { const saved = await saveFile(req, req.body || {}); return json(res, 200, { ok: true, path: clean(req.body.path, 180), commit: saved.commit && saved.commit.sha }); }
    catch (e) { return json(res, 400, { error: clean(e.message, 250) }); }
  }
  return json(res, 405, { error: 'Method not allowed.' });
};

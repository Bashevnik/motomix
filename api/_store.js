// MOTOMIX — общее хранилище настроек бота.
//
// Vercel-функции не хранят состояние между вызовами, а заводить базу ради
// списка получателей — перебор. Поэтому конфиг живёт в закреплённом сообщении
// бота в чате администратора: бот его читает через getChat и правит через
// editMessageText. Ничего внешнего, переживает перезапуски и деплои.

const TAG = 'MOTOMIX CONFIG';

const token = () => process.env.TELEGRAM_ORDER_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;

async function tg(method, body) {
  const t = token();
  if (!t) return { ok: false, description: 'no token' };
  try {
    const r = await fetch(`https://api.telegram.org/bot${t}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {}),
    });
    return await r.json();
  } catch (e) {
    return { ok: false, description: String(e) };
  }
}

const envList = (v) => String(v || '').split(',').map((s) => s.trim()).filter(Boolean);

const adminChat = () => envList(process.env.TELEGRAM_ORDER_CHAT_ID || process.env.TELEGRAM_CHAT_ID)[0];

const norm = (s) => String(s || '').trim().replace(/^@/, '').toLowerCase();

function defaults() {
  return {
    recipients: envList(process.env.TELEGRAM_ORDER_CHAT_ID || process.env.TELEGRAM_CHAT_ID),
    allowed: envList(process.env.TELEGRAM_ALLOWED).map(norm),
    await: null,
    pinId: null,
  };
}

function parse(text) {
  if (!text || !text.includes(TAG)) return null;
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try { return JSON.parse(m[0]); } catch { return null; }
}

// Читаем конфиг; если закреплённого ещё нет — отдаём значения из переменных окружения.
async function loadCfg() {
  const chat = adminChat();
  const base = defaults();
  if (!chat) return base;
  const r = await tg('getChat', { chat_id: chat });
  const pinned = r && r.ok && r.result && r.result.pinned_message;
  const cfg = pinned ? parse(pinned.text) : null;
  if (!cfg) return base;
  return {
    recipients: Array.isArray(cfg.recipients) && cfg.recipients.length ? cfg.recipients.map(String) : base.recipients,
    allowed: Array.isArray(cfg.allowed) ? cfg.allowed.map(norm) : base.allowed,
    await: cfg.await || null,
    pinId: pinned.message_id,
  };
}

const render = (cfg) =>
  `${TAG}\n` +
  `Не видаляйте це повідомлення — у ньому зберігаються налаштування бота.\n\n` +
  `Отримувачі замовлень: ${cfg.recipients.length}\n` +
  `Доступ за юзернеймом: ${cfg.allowed.length ? cfg.allowed.map((u) => '@' + u).join(', ') : '—'}\n\n` +
  JSON.stringify({ recipients: cfg.recipients, allowed: cfg.allowed, await: cfg.await || null });

async function saveCfg(cfg) {
  const chat = adminChat();
  if (!chat) return cfg;
  const text = render(cfg);
  if (cfg.pinId) {
    const r = await tg('editMessageText', { chat_id: chat, message_id: cfg.pinId, text });
    if (r && r.ok) return cfg;
  }
  const sent = await tg('sendMessage', { chat_id: chat, text, disable_notification: true });
  if (sent && sent.ok) {
    cfg.pinId = sent.result.message_id;
    await tg('pinChatMessage', { chat_id: chat, message_id: cfg.pinId, disable_notification: true });
  }
  return cfg;
}

module.exports = { tg, loadCfg, saveCfg, norm, adminChat, envList };

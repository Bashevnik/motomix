// MOTOMIX — Vercel serverless function.
// Принимает заявку или заказ из корзины и пересылает в Telegram.
//
// ENV (приоритет — у отдельного бота заявок, с откатом на общий):
//   TELEGRAM_ORDER_BOT_TOKEN / TELEGRAM_ORDER_CHAT_ID  — выделенный бот магазина
//   TELEGRAM_BOT_TOKEN       / TELEGRAM_CHAT_ID        — запасной
// В CHAT_ID можно перечислить несколько получателей через запятую.

module.exports = async (req, res) => {
  // CORS — чтобы статический сайт (GitHub Pages) мог звать этот эндпоинт.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body || {};
  const clean = (v, max = 400) => String(v == null ? '' : v).replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, max);

  // Honeypot: боты заполняют скрытое поле, люди — нет.
  if (clean(body.company)) return res.status(200).json({ success: true });

  const name = clean(body.name, 80);
  const phone = clean(body.phone, 40);
  const comment = clean(body.comment, 600);
  const subject = clean(body.subject, 120) || 'Заявка з сайту';
  const page = clean(body.page, 200);

  // Имя необязательно: меньше полей — больше заявок. Телефон остаётся.
  if (!phone) return res.status(400).json({ error: 'Phone is required' });
  if (!/[0-9]{6,}/.test(phone.replace(/\D/g, ''))) return res.status(400).json({ error: 'Invalid phone' });

  // ---- состав заказа (приходит только из корзины) ----
  const money = (n) => Number(n || 0).toLocaleString('uk-UA').replace(/,/g, ' ') + ' грн';
  const rawItems = Array.isArray(body.items) ? body.items.slice(0, 40) : [];
  const items = rawItems.map((it) => ({
    name: clean(it && it.name, 120),
    qty: Math.max(1, Math.min(99, parseInt(it && it.qty, 10) || 1)),
    price: clean(it && it.price, 40),
    sum: Number(it && it.sum) || 0,
    id: clean(it && it.id, 120),
  })).filter((it) => it.name);

  const isOrder = items.length > 0;
  // Сумму пересчитываем на сервере — клиентскому total не доверяем.
  const total = items.reduce((s, it) => s + it.sum, 0);
  const totalQty = items.reduce((s, it) => s + it.qty, 0);

  const when = new Intl.DateTimeFormat('uk-UA', {
    timeZone: 'Europe/Kyiv', dateStyle: 'short', timeStyle: 'short',
  }).format(new Date());

  const site = 'https://motomix.vercel.app';
  let text;

  if (isOrder) {
    const lines = items.map((it, i) =>
      `${i + 1}. ${it.name}\n` +
      `   ${it.qty} шт × ${it.price || '—'}` + (it.sum ? `  =  ${money(it.sum)}` : '') +
      (it.id ? `\n   ${site}/product.html?id=${it.id}` : '')
    ).join('\n');

    text =
      `🛒 НОВЕ ЗАМОВЛЕННЯ — MOTOMIX\n` +
      `────────────────────\n` +
      (name ? `Ім'я: ${name}\n` : '') +
      `Телефон: ${phone}\n` +
      `────────────────────\n` +
      `ТОВАРИ (${items.length} поз., ${totalQty} шт):\n${lines}\n` +
      `────────────────────\n` +
      `РАЗОМ: ${money(total)}\n` +
      (comment ? `Коментар: ${comment}\n` : '') +
      (page ? `Сторінка: ${page}\n` : '') +
      `Час: ${when} (Київ)`;
  } else {
    text =
      `🏍 НОВА ЗАЯВКА — MOTOMIX\n` +
      `────────────────────\n` +
      (name ? `Ім'я: ${name}\n` : '') +
      `Телефон: ${phone}\n` +
      (comment ? `Коментар: ${comment}\n` : '') +
      (page ? `Сторінка: ${page}\n` : '') +
      `Час: ${when} (Київ)`;
  }

  const token = process.env.TELEGRAM_ORDER_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
  // Список получателей ведётся в панели бота, а не только в переменных окружения:
  // добавили человека через /start — заказы сразу идут и ему.
  let chatIds;
  try {
    const { loadCfg } = require('./_store.js');
    const cfg = await loadCfg();
    chatIds = (cfg.recipients || []).map(String).filter(Boolean);
  } catch (e) {
    console.error('config read failed, falling back to env:', e);
    chatIds = [];
  }
  if (!chatIds.length) {
    chatIds = String(process.env.TELEGRAM_ORDER_CHAT_ID || process.env.TELEGRAM_CHAT_ID || '')
      .split(',').map((s) => s.trim()).filter(Boolean);
  }

  if (!token || !chatIds.length) {
    console.error('Telegram credentials are not configured');
    return res.status(500).json({ error: 'Telegram credentials not configured' });
  }

  try {
    // Без parse_mode: в именах моделей встречаются & и < — HTML-парсер Telegram на них падает.
    const results = await Promise.all(chatIds.map((id) =>
      fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: id, text, disable_web_page_preview: true }),
      }).then((r) => r.json()).catch((e) => ({ ok: false, error: String(e) }))
    ));

    if (results.some((d) => d && d.ok)) return res.status(200).json({ success: true, kind: isOrder ? 'order' : 'lead' });

    console.error('Telegram API error:', JSON.stringify(results));
    return res.status(502).json({ error: 'Failed to send to Telegram' });
  } catch (e) {
    console.error('Server error:', e);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

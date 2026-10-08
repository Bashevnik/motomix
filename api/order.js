// MOTOMIX — Vercel serverless function.
// Принимает заявку с сайта и пересылает её в Telegram.
// ENV: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID (можно несколько через запятую).

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

  if (!name || !phone) return res.status(400).json({ error: 'Name and phone are required' });
  if (!/[0-9]{6,}/.test(phone.replace(/\D/g, ''))) return res.status(400).json({ error: 'Invalid phone' });

  const when = new Intl.DateTimeFormat('uk-UA', {
    timeZone: 'Europe/Kyiv', dateStyle: 'short', timeStyle: 'short',
  }).format(new Date());

  const text =
    `🏍 НОВА ЗАЯВКА — MOTOMIX\n` +
    `────────────────────\n` +
    `Тема: ${subject}\n` +
    `Ім'я: ${name}\n` +
    `Телефон: ${phone}\n` +
    (comment ? `Коментар: ${comment}\n` : '') +
    (page ? `Сторінка: ${page}\n` : '') +
    `Час: ${when} (Київ)`;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = String(process.env.TELEGRAM_CHAT_ID || '')
    .split(',').map((s) => s.trim()).filter(Boolean);

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

    if (results.some((d) => d && d.ok)) return res.status(200).json({ success: true });

    console.error('Telegram API error:', JSON.stringify(results));
    return res.status(502).json({ error: 'Failed to send to Telegram' });
  } catch (e) {
    console.error('Server error:', e);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

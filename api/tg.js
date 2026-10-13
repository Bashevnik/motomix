// MOTOMIX — вебхук Telegram-бота заявок (t.me/Motomixbc_bot).
//
// Что умеет:
//   • принимает заказы с сайта (их шлёт /api/order) и рассылает получателям;
//   • панель администратора на кнопках: список получателей, выдача доступа,
//     статус, тестовое сообщение;
//   • доступ выдаётся ПО ЮЗЕРНЕЙМУ — админ добавляет @username, человек
//     жмёт Start, и бот сам прописывает его chat_id в рассылку.
//
// ENV: TELEGRAM_ORDER_BOT_TOKEN, TELEGRAM_ORDER_CHAT_ID (первый = админ),
//      TELEGRAM_ALLOWED (стартовый список), TELEGRAM_WEBHOOK_SECRET.

const { tg, loadCfg, saveCfg, norm, adminChat } = require('./_store.js');

const SITE = 'https://motomix.vercel.app';

const isAdmin = (id) => String(id) === String(adminChat());

/* ---------- журнал замовлень у панелі ---------- */
const PER_PAGE = 8;
const money = (n) => Number(n || 0).toLocaleString('uk-UA').replace(/,/g, ' ') + ' грн';

function ordersKb(cfg, page) {
  const list = cfg.orders || [];
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const pg = Math.min(Math.max(0, page), pages - 1);
  const slice = list.slice(pg * PER_PAGE, pg * PER_PAGE + PER_PAGE);
  const rows = slice.map((o, k) => {
    const i = pg * PER_PAGE + k;
    const mark = o.done ? '✅' : '🟡';
    return [{ text: `${mark} ${o.n || 'Без імені'} · ${money(o.s)}`, callback_data: 'ord:' + i }];
  });
  if (pages > 1) rows.push([
    { text: '◀', callback_data: 'opg:' + (pg - 1 + pages) % pages },
    { text: `${pg + 1}/${pages}`, callback_data: 'noop' },
    { text: '▶', callback_data: 'opg:' + (pg + 1) % pages },
  ]);
  rows.push([{ text: '🏠 Меню', callback_data: 'home' }]);
  return { inline_keyboard: rows };
}

function orderCard(o, i) {
  return '🧾 <b>Замовлення</b>\n' +
    '────────────────────\n' +
    `📅 ${o.d || '—'}\n` +
    `👤 ${o.n || 'імʼя не вказали'}\n` +
    `📞 <code>${o.p || '—'}</code>\n` +
    (o.np ? `🚚 ${o.np}\n` : '') +
    '────────────────────\n' +
    `🏍 ${o.it || '—'}\n` +
    `💰 <b>${money(o.s)}</b>\n` +
    (o.c ? `💬 ${o.c}\n` : '') +
    (o.done ? '\n✅ Опрацьовано' : '\n🟡 В роботі');
}

const orderKb = (o, i) => ({
  inline_keyboard: [
    [{ text: o.done ? '↩️ Повернути в роботу' : '✅ Опрацьовано', callback_data: 'odone:' + i }],
    [{ text: '📞 Подзвонити', url: 'tel:' + String(o.p || '').replace(/[^\d+]/g, '') }],
    [{ text: '‹ До списку', callback_data: 'opg:0' }, { text: '🏠 Меню', callback_data: 'home' }],
  ],
});

const panelText = (cfg) =>
  '🏍 <b>MOTOMIX</b> — панель замовлень\n' +
  '────────────────────\n' +
  `📦 Замовлень збережено: <b>${(cfg.orders || []).length}</b>\n` +
  `👥 Отримувачів: <b>${cfg.recipients.length}</b>\n` +
  `🔑 Доступ за юзернеймом: <b>${cfg.allowed.length ? cfg.allowed.map((u) => '@' + u).join(', ') : 'нікого'}</b>\n\n` +
  'Сюди падають замовлення з кошика і заявки з сайту.';

const panelKb = () => ({
  inline_keyboard: [
    [{ text: '📦 Замовлення', callback_data: 'opg:0' }],
    [{ text: '👥 Отримувачі', callback_data: 'list' }, { text: '➕ Додати доступ', callback_data: 'add' }],
    [{ text: '📊 Статус', callback_data: 'stat' }, { text: '🧾 Приклад замовлення', callback_data: 'demo' }],
    [{ text: '🌐 Відкрити сайт', url: SITE }],
  ],
});

const backKb = () => ({ inline_keyboard: [[{ text: '‹ Назад', callback_data: 'home' }]] });

const send = (chat_id, text, reply_markup) =>
  tg('sendMessage', { chat_id, text, parse_mode: 'HTML', disable_web_page_preview: true, reply_markup });

const edit = (chat_id, message_id, text, reply_markup) =>
  tg('editMessageText', { chat_id, message_id, text, parse_mode: 'HTML', disable_web_page_preview: true, reply_markup });

async function listKb(cfg) {
  const rows = [];
  for (const id of cfg.recipients) {
    let name = String(id);
    const r = await tg('getChat', { chat_id: id });
    if (r && r.ok && r.result) {
      const c = r.result;
      name = [c.first_name, c.last_name].filter(Boolean).join(' ') || c.title || String(id);
      if (c.username) name += ' · @' + c.username;
    }
    rows.push([{ text: '❌ ' + name.slice(0, 40), callback_data: 'del:' + id }]);
  }
  rows.push([{ text: '‹ Назад', callback_data: 'home' }]);
  return { inline_keyboard: rows };
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret && req.headers['x-telegram-bot-api-secret-token'] !== secret) {
    return res.status(401).json({ error: 'Bad secret' });
  }

  const upd = req.body || {};
  // Всегда 200: на ошибку Telegram начнёт долбить ретраями.
  const done = () => res.status(200).json({ ok: true });

  try {
    const cfg = await loadCfg();

    /* ---------- нажатия кнопок ---------- */
    if (upd.callback_query) {
      const q = upd.callback_query;
      const chat = q.message.chat.id, mid = q.message.message_id;
      const data = String(q.data || '');
      await tg('answerCallbackQuery', { callback_query_id: q.id });

      if (!isAdmin(q.from.id)) {
        await edit(chat, mid, '⛔ Панель доступна лише адміністратору.');
        return done();
      }

      if (data === 'home') { cfg.await = null; await saveCfg(cfg); await edit(chat, mid, panelText(cfg), panelKb()); return done(); }

      if (data === 'list') {
        if (!cfg.recipients.length) { await edit(chat, mid, '👥 Отримувачів поки нема.', backKb()); return done(); }
        await edit(chat, mid, '👥 <b>Хто отримує замовлення</b>\n\nНатисніть, щоб прибрати:', await listKb(cfg));
        return done();
      }

      if (data.startsWith('del:')) {
        const id = data.slice(4);
        cfg.recipients = cfg.recipients.filter((x) => String(x) !== id);
        await saveCfg(cfg);
        await edit(chat, mid, '👥 <b>Хто отримує замовлення</b>\n\nНатисніть, щоб прибрати:', await listKb(cfg));
        return done();
      }

      if (data === 'add') {
        cfg.await = 'user';
        await saveCfg(cfg);
        await edit(chat, mid,
          '➕ <b>Видати доступ</b>\n\nНадішліть юзернейм у форматі <code>@username</code>.\n\n' +
          'Далі людина відкриває @Motomixbc_bot і тисне <b>Старт</b> — після цього замовлення почнуть приходити і їй.\n\n' +
          '<i>Telegram не дозволяє боту написати першим, тому крок зі «Старт» обовʼязковий.</i>', backKb());
        return done();
      }

      if (data === 'noop') return done();

      if (data.startsWith('opg:')) {
        const pg = parseInt(data.slice(4), 10) || 0;
        const list = cfg.orders || [];
        if (!list.length) { await edit(chat, mid, '📦 Замовлень поки нема.\n\nЯк тільки хтось оформить на сайті — воно зʼявиться тут.', backKb()); return done(); }
        await edit(chat, mid, '📦 <b>Замовлення</b>\n\nОберіть, щоб побачити деталі:', ordersKb(cfg, pg));
        return done();
      }

      if (data.startsWith('ord:')) {
        const i = parseInt(data.slice(4), 10);
        const ord = (cfg.orders || [])[i];
        if (!ord) { await edit(chat, mid, '📦 Замовлення не знайдено.', backKb()); return done(); }
        await edit(chat, mid, orderCard(ord, i), orderKb(ord, i));
        return done();
      }

      if (data.startsWith('odone:')) {
        const i = parseInt(data.slice(6), 10);
        const ord = (cfg.orders || [])[i];
        if (ord) { ord.done = !ord.done; await saveCfg(cfg); await edit(chat, mid, orderCard(ord, i), orderKb(ord, i)); }
        return done();
      }

      if (data === 'stat') {
        const me = await tg('getMe', {});
        const wh = await tg('getWebhookInfo', {});
        await edit(chat, mid,
          '📊 <b>Статус</b>\n────────────────────\n' +
          `Бот: ${me.ok ? '@' + me.result.username + ' ✅' : '❌'}\n` +
          `Вебхук: ${wh.ok && wh.result.url ? '✅ підключено' : '❌ немає'}\n` +
          `У черзі: ${wh.ok ? wh.result.pending_update_count : '?'}\n` +
          `Отримувачів: ${cfg.recipients.length}\n` +
          `Доступ мають: ${cfg.allowed.length ? cfg.allowed.map((u) => '@' + u).join(', ') : '—'}`, backKb());
        return done();
      }

      if (data === 'demo') {
        await send(chat,
          '🛒 НОВЕ ЗАМОВЛЕННЯ — MOTOMIX\n────────────────────\n' +
          "Ім'я: Тестовий Покупець\nТелефон: +38 093 000 00 00\n────────────────────\n" +
          'ТОВАРИ (1 поз., 1 шт):\n1. KOVI 300 PRO Motard\n   1 шт × 3 300 $  =  138 600 грн\n' +
          `   ${SITE}/product.html?id=kovi-300-pro-motard-2026-novyy\n` +
          '────────────────────\nРАЗОМ: 138 600 грн\nЧас: приклад');
        await edit(chat, mid, panelText(cfg) + '\n\n🧾 Приклад надіслано вище.', panelKb());
        return done();
      }

      return done();
    }

    /* ---------- обычные сообщения ---------- */
    const msg = upd.message || upd.edited_message;
    if (!msg) return done();

    const chat = msg.chat.id;
    const isGroup = msg.chat.type === 'group' || msg.chat.type === 'supergroup';
    const from = msg.from || {};
    const text = String(msg.text || '').trim();
    const cmd = text.split(/[\s@]/)[0].toLowerCase();

    // В группе: сам чат становится получателем — дальше доступ раздаётся
    // добавлением людей в этот чат.
    if (isGroup) {
      if (cmd === '/start' || cmd === '/id' || cmd === '/help') {
        const already = cfg.recipients.map(String).includes(String(chat));
        if (!already && isAdmin(from.id)) {
          cfg.recipients.push(String(chat));
          await saveCfg(cfg);
        }
        await send(chat,
          `Чат: ${msg.chat.title || '—'}\nID: <code>${chat}</code>\n\n` +
          (already ? 'Цей чат уже отримує замовлення.'
            : isAdmin(from.id) ? '✅ Готово — замовлення тепер приходять у цей чат.\nКого додасте в чат, той і бачитиме заявки.'
              : 'Щоб підключити цей чат, команду має надіслати адміністратор.'));
      }
      return done();
    }

    // Админ ввёл юзернейм после кнопки «Добавить доступ»
    if (isAdmin(from.id) && cfg.await === 'user' && /^@?[A-Za-z0-9_]{4,32}$/.test(text)) {
      const u = norm(text);
      if (!cfg.allowed.includes(u)) cfg.allowed.push(u);
      cfg.await = null;
      await saveCfg(cfg);
      await send(chat,
        `✅ Доступ видано: <b>@${u}</b>\n\n` +
        'Залишилось: людина відкриває @Motomixbc_bot і тисне <b>Старт</b>. ' +
        'Після цього замовлення приходитимуть і їй.', panelKb());
      return done();
    }

    if (isAdmin(from.id)) {
      if (cmd === '/start' || cmd === '/help' || cmd === '/menu') { await send(chat, panelText(cfg), panelKb()); return done(); }
      if (cmd === '/id') { await send(chat, `chat_id: <code>${chat}</code>`); return done(); }
      await send(chat, panelText(cfg), panelKb());
      return done();
    }

    // Не админ: пускаем, если юзернейм в списке — и сразу подписываем на заказы
    const uname = norm(from.username);
    const allowed = uname && cfg.allowed.includes(uname);
    if (allowed) {
      const already = cfg.recipients.map(String).includes(String(chat));
      if (!already) { cfg.recipients.push(String(chat)); await saveCfg(cfg); }
      await send(chat,
        '🏍 <b>MOTOMIX</b>\n────────────────────\n' +
        (already ? 'Ви вже отримуєте замовлення з сайту.' : '✅ Готово! Тепер замовлення з сайту приходитимуть сюди.') +
        '\n\nУ повідомленні буде: що замовили, скільки, на яку суму і номер покупця.');
      return done();
    }

    await send(chat,
      '⛔ Доступу немає.\n\n' +
      `Ваш ID: <code>${from.id}</code>\n` +
      (from.username ? `Юзернейм: @${from.username}` : 'Юзернейма нема — задайте його в налаштуваннях Telegram.') +
      '\n\nПопросіть адміністратора видати доступ — достатньо юзернейма.');
    return done();
  } catch (e) {
    console.error('tg webhook error:', e);
    return res.status(200).json({ ok: true });
  }
};

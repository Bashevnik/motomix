// MOTOMIX — вебхук Telegram-бота заявок (t.me/Motomixbc_bot).
//
// Зачем он нужен: Telegram не умеет писать человеку по @username — боту нужен
// числовой chat_id, и получить его можно только после того, как человек сам
// напишет боту. Этот вебхук закрывает оба конца:
//   1) допуск проверяется ПО ЮЗЕРНЕЙМУ из TELEGRAM_ALLOWED;
//   2) допущенному бот сразу отдаёт его chat_id, чтобы добавить в рассылку.
//
// ENV:
//   TELEGRAM_ORDER_BOT_TOKEN  — токен бота
//   TELEGRAM_ALLOWED          — кому можно: @username и/или id, через запятую
//   TELEGRAM_ORDER_CHAT_ID    — кто уже получает заказы, через запятую
//   TELEGRAM_WEBHOOK_SECRET   — произвольная строка, Telegram шлёт её в заголовке

const norm = (s) => String(s || '').trim().replace(/^@/, '').toLowerCase();

const parseList = (v) => String(v || '').split(',').map((s) => s.trim()).filter(Boolean);

function isAllowed(from) {
  const allowed = parseList(process.env.TELEGRAM_ALLOWED).map(norm);
  const recipients = parseList(process.env.TELEGRAM_ORDER_CHAT_ID).map(norm);
  if (!allowed.length && !recipients.length) return true;      // ещё не настроено — не запираемся
  const uname = norm(from && from.username);
  const id = norm(from && from.id);
  return allowed.includes(uname) || allowed.includes(id) || recipients.includes(id);
}

async function reply(token, chatId, text) {
  return fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
  }).then((r) => r.json()).catch((e) => ({ ok: false, error: String(e) }));
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const token = process.env.TELEGRAM_ORDER_BOT_TOKEN;
  if (!token) return res.status(500).json({ error: 'Bot token not configured' });

  // Telegram возвращает секрет в заголовке — отсекаем посторонние POST-ы.
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret && req.headers['x-telegram-bot-api-secret-token'] !== secret) {
    return res.status(401).json({ error: 'Bad secret' });
  }

  const upd = req.body || {};
  const msg = upd.message || upd.edited_message || upd.channel_post;
  // Всегда отвечаем 200: на любую ошибку Telegram начнёт долбить ретраями.
  if (!msg) return res.status(200).json({ ok: true });

  const chatId = msg.chat && msg.chat.id;
  const isGroup = msg.chat && (msg.chat.type === 'group' || msg.chat.type === 'supergroup');
  const from = msg.from || {};
  const text = String(msg.text || '').trim();
  const cmd = text.split(/[\s@]/)[0].toLowerCase();

  const recipients = parseList(process.env.TELEGRAM_ORDER_CHAT_ID);
  const already = recipients.includes(String(chatId));

  try {
    // В группе важен id самой группы: добавил бота в чат — чат и получает заказы,
    // а раздача доступа дальше идёт через участников группы, то есть по юзернейму.
    if (isGroup && (cmd === '/start' || cmd === '/id' || cmd === '/help')) {
      await reply(token, chatId,
        `Чат: ${msg.chat.title || '—'}\n` +
        `ID цього чату: ${chatId}\n\n` +
        (already
          ? 'Цей чат уже отримує замовлення з сайту.'
          : 'Щоб замовлення падали сюди — додай цей ID у змінну TELEGRAM_ORDER_CHAT_ID.\n' +
            'Далі доступ роздається просто: кого додав у цей чат, той і бачить замовлення.'));
      return res.status(200).json({ ok: true });
    }

    if (!isAllowed(from)) {
      await reply(token, chatId,
        '⛔ Доступу немає.\n\n' +
        `Твій ID: ${from.id}\n` +
        (from.username ? `Юзернейм: @${from.username}\n` : 'Юзернейма нема — постав його в налаштуваннях Telegram.\n') +
        '\nПопроси адміністратора додати тебе — достатньо юзернейма.');
      return res.status(200).json({ ok: true });
    }

    if (cmd === '/start' || cmd === '/help') {
      await reply(token, chatId,
        '🏍 MOTOMIX — бот заявок\n' +
        '────────────────────\n' +
        'Сюди падають замовлення з кошика і заявки з сайту:\n' +
        'що замовили, скільки, на яку суму і куди передзвонити.\n\n' +
        `Твій chat_id: ${chatId}\n` +
        (already ? '✅ Ти вже в розсилці.' : '⚠️ Тебе ще нема в розсилці — передай цей ID адміну.') +
        '\n\nКоманди:\n/id — показати свій ID\n/help — ця довідка');
      return res.status(200).json({ ok: true });
    }

    if (cmd === '/id') {
      await reply(token, chatId,
        `chat_id: ${chatId}\n` +
        `user_id: ${from.id}\n` +
        (from.username ? `username: @${from.username}` : 'username: не заданий'));
      return res.status(200).json({ ok: true });
    }

    await reply(token, chatId, 'Я приймаю замовлення з сайту. /help — що вмію.');
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('tg webhook error:', e);
    return res.status(200).json({ ok: true });
  }
};

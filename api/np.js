// MOTOMIX — прокси к API Новой Почты для подсказок города и отделения.
//
// Ключ нельзя держать в браузере, поэтому запросы идут через эту функцию.
// ENV: NOVA_POSHTA_KEY — получить в кабинете НП (Налаштування → Безпека → API).
// Без ключа отвечаем 503, и форма на сайте переключается на ручной ввод.

const NP = 'https://api.novaposhta.ua/v2.0/json/';

async function np(body) {
  const r = await fetch(NP, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return r.json();
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const apiKey = process.env.NOVA_POSHTA_KEY;
  if (!apiKey) return res.status(503).json({ error: 'no_key', manual: true });

  const q = String((req.query && req.query.q) || '').trim().slice(0, 60);
  const city = String((req.query && req.query.city) || '').trim().slice(0, 60);

  try {
    // Отделения выбранного города
    if (city) {
      const d = await np({
        apiKey, modelName: 'AddressGeneral', calledMethod: 'getWarehouses',
        methodProperties: { SettlementRef: city, FindByString: q, Limit: '50', Page: '1' },
      });
      if (!d.success) return res.status(502).json({ error: 'np_error', manual: true });
      const items = (d.data || []).map((w) => ({
        ref: w.Ref,
        name: w.Description,
        n: w.Number,
      })).slice(0, 50);
      // «№12» людям зрозуміліше за повну назву відділення
      items.sort((a, b) => (parseInt(a.n, 10) || 999) - (parseInt(b.n, 10) || 999));
      return res.status(200).json({ items });
    }

    // Поиск населённого пункта
    if (q.length < 2) return res.status(200).json({ items: [] });
    const d = await np({
      apiKey, modelName: 'AddressGeneral', calledMethod: 'searchSettlements',
      methodProperties: { CityName: q, Limit: '12', Page: '1' },
    });
    if (!d.success) return res.status(502).json({ error: 'np_error', manual: true });
    const addrs = ((d.data && d.data[0] && d.data[0].Addresses) || []).map((a) => ({
      ref: a.DeliveryCity || a.Ref,
      name: a.MainDescription,
      area: [a.Area, a.Region].filter(Boolean).join(', '),
    }));
    return res.status(200).json({ items: addrs });
  } catch (e) {
    console.error('np error:', e);
    return res.status(502).json({ error: 'fetch_failed', manual: true });
  }
};

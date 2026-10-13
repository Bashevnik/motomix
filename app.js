/* ============ MOTOMIX — app (multi-page) ============ */
const ORDER_ENDPOINT = 'https://motomix.vercel.app/api/order'; // прод-ендпоінт (працює і з дзеркала на GitHub Pages)

/* ---------------- DATA (з data.js, згенеровано з OLX) ---------------- */
const CATEGORIES = window.MM_CATEGORIES || [];
const PRODUCTS   = window.MM_PRODUCTS   || [];
const BRANDS     = window.MM_BRANDS     || [];

/* ЗАГЛУШКА: демонстраційні відгуки — замінити на реальні від клієнта.
   Імена, міста й тексти вигадані, фото згенеровані нейромережею.
   Ім'я під кожним фото підібране так, щоб не було розбіжності з портретом. */
const REVIEWS = [
  { n:'Андрій', c:'Біла Церква', av:'assets/reviews/r1.jpg', t:'Брав ендуро — підібрали під мій зріст, не нав\'язували дорожче. Підготували, пояснили по обслуговуванню. Катаю другий сезон, питань нема.' },
  { n:'Олег', c:'Київ', av:'assets/reviews/r2.jpg', t:'Привезли в Київ без передоплати, як і домовлялись. Документи всі на місці, поставив на облік без проблем.' },
  { n:'Віталій', c:'Фастів', av:'assets/reviews/r3.jpg', t:'Здав старий мопед по Trade-in, доплатив різницю. Оцінили нормально, без заниження. Рекомендую.' },
  { n:'Оксана', c:'Васильків', av:'assets/reviews/r4.jpg', t:'Купували чоловікові на день народження. Допомогли вибрати так, щоб сюрприз не зіпсувати, і притримали модель до дати.' },
  { n:'Ірина', c:'Біла Церква', av:'assets/reviews/r5.jpg', t:'Брала електроскутер для міста. Чесно сказали, що взимку запас ходу менший, ніж у паспорті. Приємно, коли не прикрашають.' },
  { n:'Дмитро', c:'Обухів', av:'assets/reviews/r6.jpg', t:'Купував квадроцикл для дачі. Привезли, зібрали на місці, показали як обслуговувати. Дрібниця, а приємно.' },
  { n:'Наталія', c:'Сквира', av:'assets/reviews/r7.jpg', t:'Син просив пітбайк. Боялася, що буде зависоко. Підібрали за зростом, пояснили хлопцю техніку безпеки, допомогли з шоломом.' },
  { n:'Світлана', c:'Київ', av:'assets/reviews/r8.jpg', t:'Відповіли в Instagram уночі за десять хвилин і скинули відео моделі зі складу. Не чекала такої швидкості.' },
  { n:'Марія', c:'Миронівка', av:'assets/reviews/r9.jpg', t:'Довго вагалась між скутером і мопедом. Дали посидіти на обох, нічого не підганяли. Поїхала на скутері й задоволена.' },
  { n:'Юлія', c:'Кагарлик', av:'assets/reviews/r10.jpg', t:'Ціна виявилась такою, як на сайті. Без «ой, це вже продано, є дорожче». Для мене це головне.' },
  { n:'Катерина', c:'Переяслав', av:'assets/reviews/r11.jpg', t:'Замовляла доставку в село, глухий кут без адреси. Домовились по орієнтирах, водій знайшов. Усе приїхало в заводській плівці.' },
  { n:'Олена', c:'Біла Церква', av:'assets/reviews/r12.jpg', t:'Зверталась по сервіс не там, де купувала. Все одно взяли, зробили за день і не накрутили ціну.' },
  { n:'Тетяна', c:'Тараща', av:'assets/reviews/r13.jpg', t:'Брали мотоцикл чоловікові, я платила. Пояснили різницю між моделями мені, а не «через чоловіка». Дрібниця, але запам\'яталось.' },
  { n:'Анна', c:'Узин', av:'assets/reviews/r14.jpg', t:'Купували сину на повноліття. Порадили не найпотужніше, а те, на чому він безпечно навчиться. Могли продати дорожче — не стали.' },
  { n:'Тарас', c:'Київ', av:'assets/reviews/r15.jpg', t:'Взяв KOVI JNR 250 Pro. Перед видачею все перебрали, виставили підвіску під мою вагу. Видно, що роблять для себе, а не аби продати.' },
  { n:'Вікторія', c:'Ржищів', av:'assets/reviews/r16.jpg', t:'Здала стару Альфу по Trade-in, яку ніхто не хотів брати. Зарахували в рахунок нового. Швидко, без зайвих оглядів.' },
  { n:'Микола', c:'Біла Церква', av:'assets/reviews/r17.jpg', t:'Обслуговуюсь тут третій сезон. Запчастини є або привозять за тиждень. Ціни адекватні.' },
  { n:'Віктор', c:'Фастів', av:'assets/reviews/r18.jpg', t:'Приїхав просто подивитись, без наміру купувати сьогодні. Ніхто не висів над душею. Повернувся через тиждень і купив.' },
  { n:'Людмила', c:'Володарка', av:'assets/reviews/r20.jpg', t:'Замовляла шолом і екіпіровку. Підібрали розмір, дали поміряти кілька варіантів. Не «беріть цей, він останній».' },
  { n:'Софія', c:'Київ', av:'assets/reviews/r21.jpg', t:'Купувала в подарунок, хвилювалась щодо розміру. Сказали: не підійде — обміняємо. Підійшло, але сам факт підкупив.' },
  { n:'Анатолій', c:'Біла Церква', av:'assets/reviews/r22.jpg', t:'Взяв квадроцикл 4x4 на господарство. Возить причіп, тягне по багнюці. За рік тільки масло міняв.' },
  { n:'Роман', c:'Богуслав', av:'assets/reviews/r23.jpg', t:'Взяв KAYO T2 250 під ліс. За сезон жодної поломки, тільки планове ТО. Масло і фільтри брав тут же.' },
  { n:'Євген', c:'Київ', av:'assets/reviews/r24.jpg', t:'Замовляв LIFAN KPT 400. Чекав два тижні, попереджали чесно про строк. Привезли день у день.' },
  { n:'Назар', c:'Сквира', av:'assets/reviews/r25.jpg', t:'Пояснили різницю між карбюратором і інжектором людською мовою, без понтів. Взяв інжектор, узимку заводиться з пів оберта.' },
  { n:'Галина', c:'Миронівка', av:'assets/reviews/r26.jpg', t:'Після купівлі дзвонили через місяць, питали як техніка. Не щоб щось продати, просто дізнатись. Таке рідко буває.' },
  { n:'Владислав', c:'Обухів', av:'assets/reviews/r27.jpg', t:'Shineray NitroX 300 брав під місто і трасу. По асфальту тримає впевнено, 110 їде спокійно. За свої гроші — топ.' },
  { n:'Дарина', c:'Київ', av:'assets/reviews/r28.jpg', t:'Нормальні хлопці, самі катають. Це видно по питаннях, які ставлять при підборі. Не продавці, а мотоциклісти.' },
];

/* усі стрічки на сайті гортаються самі: одна комірка раз на 3 секунди */
const SWIPE_MS = 3000;

/* ---------------- helpers ---------------- */
const el = (h) => { const t = document.createElement('template'); t.innerHTML = h.trim(); return t.content.firstChild; };
/* webp легший за jpeg приблизно на чверть; <picture> сам обирає формат,
   а старий браузер отримає звичайний jpg із src */
const webpOf = (s) => String(s || '').replace(/.(jpe?g|png)$/i, '.webp');
/* для карточок і плиток браузер сам обирає менший файл: на телефоні
   картинка показується ~470px, тягнути 900 немає сенсу */
const picCard = (src, attrs, sizes) => {
  const w = webpOf(src);
  const sm = w.replace('/olx/', '/olx/sm/');
  return `<picture><source type="image/webp" srcset="${sm} 600w, ${w} 900w" sizes="${sizes || '(max-width:620px) 50vw, (max-width:1180px) 33vw, 20vw'}"><img src="${src}" ${attrs || ''}></picture>`;
};

const pic = (src, attrs) =>
  `<picture><source srcset="${webpOf(src)}" type="image/webp"><img src="${src}" ${attrs || ''}></picture>`;

const ico = (id) => `<svg class="icon"><use href="#${id}"></use></svg>`;
const priceText = (p) => p.priceRaw || "Ціна за запитом";
const stockOf = () => "В наявності";
const qs = (k) => new URLSearchParams(location.search).get(k);

/* ---------------- нормалізація назв з OLX ----------------
   Сирий заголовок оголошення → «БРЕНД МОДЕЛЬ» + окремий рядок уточнень.
   Працює автоматично і після повторного парсингу OLX. */
const NM_TAIL = /^(нов(ий|а|і|е|ые|ый)|new|інжектор|инжектор|карбюратор|р|року|рік|випуску|шт|за|грн|стан|продам|терміново|наявності|продажу|в|у|\d{2,4}(cc|см3|куб))$/i;
const NM_LEAD = /^(в|у|є|нов[а-яіїєґ]*|new|наявності|продажу|продам|мотоцик[а-яіїєґ]*|квадроцик[а-яіїєґ]*|квадрик|скутер|електро[а-яіїєґ]*|питбайк|підбайк[а-яіїєґ]*|пітбайк|бюджетний|топовий|дитяч[а-яіїєґ]*|детск[а-яіїєґ]*)$/i;
const NM_TR = {а:'a',б:'b',в:'v',г:'g',ґ:'g',д:'d',е:'e',є:'ie',ж:'zh',з:'z',и:'y',і:'i',ї:'i',й:'i',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'kh',ц:'ts',ч:'ch',ш:'sh',щ:'sch',ь:'',ю:'iu',я:'ia',ы:'y',э:'e',ё:'e',ъ:''};
const nmTr = (x) => x.toLowerCase().split("").map(c => NM_TR[c] !== undefined ? NM_TR[c] : c).join("");
function nmLev(a, b) { const m = []; for (let i = 0; i <= b.length; i++) m[i] = [i];
  for (let j = 0; j <= a.length; j++) m[0][j] = j;
  for (let i = 1; i <= b.length; i++) for (let j = 1; j <= a.length; j++)
    m[i][j] = b[i-1] === a[j-1] ? m[i-1][j-1] : Math.min(m[i-1][j-1], m[i][j-1], m[i-1][j]) + 1;
  return m[b.length][a.length]; }
const nmNear = (a, b) => { if (!a || !b) return false; a = a.toLowerCase(); b = b.toLowerCase();
  return a === b || nmLev(a, b) <= (Math.max(a.length, b.length) >= 6 ? 2 : 1); };
const nmCap = (t) => t.includes("-")
  ? t.split("-").map(x => x.length <= 2 ? x.toUpperCase() : x[0].toUpperCase() + x.slice(1).toLowerCase()).join("-")
  : (t.length <= 4 || /\d/.test(t)) ? t.toUpperCase() : t[0].toUpperCase() + t.slice(1).toLowerCase();

const _nmCache = new Map();
function nameOf(p) {
  if (_nmCache.has(p.id)) return _nmCache.get(p.id);
  let s = (p.name || "")
    .replace(/[‍⁠️]/g, "")
    .replace(/[‼❗❕⁉❣\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, " ")
    .replace(/\s*[,.]\s*$/, "").replace(/\s+/g, " ").trim();

  const year = (s.match(/\b(20\d{2})\b/) || [])[1] || "";
  const hp   = (s.match(/(\d{2,3})\s*(?:ps|к\.?\s?с\.?|лс|hp)\b/i) || [])[1] || "";
  const kw   = (s.match(/(\d{3,4})\s*w\b/i) || [])[1] || "";
  const inj  = /інжектор|инжектор/i.test(s);
  const kids = /дитяч|детск/i.test(s);

  let toks = s.split(" ");
  const yt = toks.findIndex(t => /^20\d{2}/.test(t));
  if (yt >= 1) toks = toks.slice(0, yt);
  const ci = toks.findIndex(t => t.endsWith(","));
  if (ci >= 1 && ci < toks.length - 1) toks = toks.slice(0, ci + 1);
  toks = toks.map(t => t.replace(/,/g, "").replace(/\.$/, "")).filter(Boolean);
  while (toks.length > 1 && NM_TAIL.test(toks[toks.length - 1])) toks.pop();
  while (toks.length > 1 && NM_LEAD.test(toks[0])) toks.shift();

  const B = p.brand || "", bw = B.split(/\s+/).filter(Boolean);
  toks = toks.filter(t => !bw.some(w => nmNear(t, w) || nmNear(nmTr(t), w.toLowerCase())));
  while (toks.join(" ").length > 26 && toks.length > 2) toks.pop();

  let out = toks.map((t, i) => /^\d/.test(t) ? t
    : /[a-z]/i.test(t) ? nmCap(t)
    : i === 0 ? t[0].toUpperCase() + t.slice(1).toLowerCase() : t.toLowerCase());
  if (B && B !== "MOTOMIX") out.unshift(B);
  out = out.filter((t, i) => i === 0 || t.toLowerCase() !== out[i - 1].toLowerCase());

  const title = out.join(" ").replace(/\s*[-–—/]\s*$/, "").replace(/\b(\d+)\s+в\b/g, "$1 В").trim() || p.name;
  const meta = [];
  if (year) meta.push(year + " р.");
  if (p.cc) meta.push(p.cc + " см³");
  if (hp) meta.push(hp + " к.с.");
  if (kw) meta.push(kw + " Вт");
  if (inj) meta.push("інжектор");
  if (kids) meta.push("дитячий");
  const r = { title, meta: meta.join(" · ") };
  _nmCache.set(p.id, r);
  return r;
}

const factsOf = (p) => {
  const f = [{ k: "Бренд", v: p.brand, href: "catalog.html?brand=" + encodeURIComponent(p.brand) }];
  if (p.cc) f.push({ k: "Обʼєм двигуна", v: p.cc + " см³", href: "catalog.html?cc=" + p.cc });
  f.push({ k: "Тип", v: p.type || p.cat, href: "catalog.html?type=" + encodeURIComponent(p.type || p.cat) });
  f.push({ k: "Стан", v: "Новий", href: null });
  return f;
};

/* карточка: фото → назва → уточнення → ціна → наявність */
const pcardHtml = (p) => { const n = nameOf(p); return `
  <article class="pcard rv" data-href="product.html?id=${p.id}" tabindex="0">
    <div class="pcard__media">
      ${p.badge ? `<span class="pcard__badge">${p.badge}</span>` : ""}
      ${picCard(p.img, `alt="${n.title}" loading="lazy" decoding="async" width="450" height="600"`)}
    </div>
    <div class="pcard__body">
      <h3 class="pcard__name">${n.title}</h3>
      <p class="pcard__sub">${n.meta || p.type || ""}</p>
      <div class="pcard__foot">
        <div class="pcard__price">${priceText(p)}</div>
        <span class="pcard__stock">${stockOf(p)}</span>
        <button class="pcard__add" type="button" data-cart-add="${p.id}">${ico("ic-cart")} В кошик</button>
      </div>
    </div>
  </article>`; };

/* ---------------- опис товару: стіна тексту → читабельні блоки ----------------
   OLX віддає опис одним суцільним рядком без переносів:
   «Масо-габаритні характеристики Довжина, мм 2120 Ширина, мм 820 …».
   Розбираємо на секції, таблицю характеристик, списки та абзаци.
   Правило просте: у таблицю йде тільки те, що впевнено схоже на пару
   «назва, одиниця → коротке значення». Все інше лишається текстом — краще
   абзац, ніж покалічений рядок таблиці. */

const DS_HEAD = /(Масо[-\s]?габаритні характеристики|Основні характеристики|Загальні характеристики|Технічні характеристики|Параметри двигуна|Характеристики|Переваги|Комплектація|Обладнання|Документи для реєстрації)/g;

// одиниці, після яких іде саме значення, а не проза
const DS_UNIT = /^(мм|см|м|кг|г|л|см3|см³|куб\.см|градусів|град|шт|тип|вид|В|Вт|кВт|А|А·год|год|км|км\/год|об\/хв|к\.с\.|мм\.|%)$/i;

const dsEsc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const dsTrim = (s) => String(s).replace(/\s+/g, ' ').trim().replace(/^[·•*\-–—:;,\s]+|[·•*\-–—:;,\s]+$/g, '');

/* довгий текст → абзаци по 2–3 речення, щоб очі не губили рядок */
function dsParas(text) {
  const t = dsTrim(text);
  if (!t) return '';
  const sentences = t.match(/[^.!?]+[.!?]+|\S[^.!?]*$/g) || [t];
  const out = [];
  let buf = '';
  for (const s of sentences) {
    buf += (buf ? ' ' : '') + s.trim();
    if (buf.length > 240) { out.push(buf); buf = ''; }
  }
  if (buf) out.push(buf);
  return out.map((p) => `<p>${dsEsc(p)}</p>`).join('');
}

function dsRows(chunk) {
  const RE = /([А-ЯҐЄІЇA-Z][А-Яа-яҐґЄєІіЇїA-Za-z'’\s\-\(\)\.\/]{2,46}?),\s*([^\s,]{1,10})\s+/g;
  const marks = [];
  let m;
  while ((m = RE.exec(chunk))) {
    if (!DS_UNIT.test(dsTrim(m[2]))) continue;             // не одиниця — не характеристика
    marks.push({ at: m.index, end: RE.lastIndex, label: dsTrim(m[1]), unit: dsTrim(m[2]) });
  }
  if (!marks.length) return { rows: [], rest: chunk };

  const rows = [];
  const tail = [];
  const head = dsTrim(chunk.slice(0, marks[0].at));

  marks.forEach((mk, i) => {
    const stop = i + 1 < marks.length ? marks[i + 1].at : chunk.length;
    let val = dsTrim(chunk.slice(mk.end, stop));
    const isWordUnit = /^(тип|вид)$/i.test(mk.unit);

    // значення має бути коротким; довге — це проза, її в таблицю не тягнемо
    if (val.length > 64) {
      const cut = val.search(/(?<=[.;])\s/);
      if (cut > 0 && cut <= 64) { tail.push(val.slice(cut).trim()); val = val.slice(0, cut).trim(); }
      else { tail.push(val); return; }
    }
    if (!isWordUnit && !/\d/.test(val)) { tail.push(val); return; }   // без числа — теж не характеристика
    if (!val) val = mk.unit;
    // одиниця вже є у значенні («119 кг») — не дублюємо
    else if (!isWordUnit && val.toLowerCase().indexOf(mk.unit.toLowerCase()) === -1) val = val + ' ' + mk.unit;
    if (mk.label.length > 44) return;
    rows.push([mk.label, val]);
  });

  return { rows, rest: dsTrim([head, ...tail].join(' ')) };
}

function dsBullets(text) {
  const parts = text.split(/\s*[*•]\s*/).map(dsTrim).filter((x) => x.length > 1);
  return parts.length > 2 ? parts : null;
}

function formatDesc(raw) {
  const src = String(raw || '').replace(/\s+/g, ' ').trim();
  if (!src) return '<p>Опис уточнюйте у менеджера.</p>';

  const cuts = [];
  let m;
  DS_HEAD.lastIndex = 0;
  while ((m = DS_HEAD.exec(src))) cuts.push({ at: m.index, title: m[1], end: DS_HEAD.lastIndex });

  const blocks = [];
  if (!cuts.length || cuts[0].at > 0) blocks.push({ title: '', body: src.slice(0, cuts.length ? cuts[0].at : src.length) });
  cuts.forEach((c, i) => blocks.push({ title: c.title, body: src.slice(c.end, i + 1 < cuts.length ? cuts[i + 1].at : src.length) }));

  let html = '';
  for (const b of blocks) {
    const body = dsTrim(b.body);
    if (!body) continue;
    const title = b.title ? `<h4 class="pdesc__h">${dsEsc(b.title)}</h4>` : '';

    const bul = dsBullets(body);
    if (bul) { html += title + `<ul class="pdesc__ul">${bul.map((x) => `<li>${dsEsc(x)}</li>`).join('')}</ul>`; continue; }

    const { rows, rest } = dsRows(body);
    if (rows.length >= 3) {
      html += title;
      html += `<dl class="spec">${rows.map(([k, v]) =>
        `<div class="spec__r"><dt>${dsEsc(k)}</dt><dd>${dsEsc(v)}</dd></div>`).join('')}</dl>`;
      if (rest && rest.length > 40) html += dsParas(rest);
    } else {
      html += title + dsParas(body);
    }
  }
  return html || dsParas(src);
}

/* ---------------- фільтр ціни: двосторонній повзунок ----------------
   Замість чотирьох фіксованих діапазонів — живий діапазон від найдешевшої
   до найдорожчої позиції. Тягнеш — список оновлюється одразу. */
function initPriceSlider(box, state, onChange) {
  if (!box) return null;
  const panel = box.querySelector('.fdd__p');
  const btn = box.querySelector('.fdd__b');
  if (!panel || !btn) return null;

  const prices = PRODUCTS.map(p => p.priceUah).filter(v => typeof v === 'number' && v > 0);
  if (!prices.length) return null;
  const LO = Math.floor(Math.min(...prices) / 1000) * 1000;
  const HI = Math.ceil(Math.max(...prices) / 1000) * 1000;
  const STEP = 1000;

  state.priceMin = LO; state.priceMax = HI;

  panel.classList.add('fdd__p--price');
  panel.innerHTML = `
    <div class="prng">
      <div class="prng__vals">
        <label class="prng__f">від<input type="text" inputmode="numeric" id="prFrom" value="${fmtUah(LO)}"></label>
        <span class="prng__dash"></span>
        <label class="prng__f">до<input type="text" inputmode="numeric" id="prTo" value="${fmtUah(HI)}"></label>
      </div>
      <div class="prng__rail">
        <div class="prng__fill" id="prFill"></div>
        <input type="range" id="prA" min="${LO}" max="${HI}" step="${STEP}" value="${LO}" aria-label="Мінімальна ціна">
        <input type="range" id="prB" min="${LO}" max="${HI}" step="${STEP}" value="${HI}" aria-label="Максимальна ціна">
      </div>
      <div class="prng__ends"><span>${fmtUah(LO)} ₴</span><span>${fmtUah(HI)} ₴</span></div>
      <button type="button" class="prng__reset" id="prReset">Будь-яка ціна</button>
    </div>`;

  const A = panel.querySelector('#prA'), B = panel.querySelector('#prB');
  const fill = panel.querySelector('#prFill');
  const fIn = panel.querySelector('#prFrom'), tIn = panel.querySelector('#prTo');

  const paint = () => {
    const a = Math.min(+A.value, +B.value), b = Math.max(+A.value, +B.value);
    fill.style.left = ((a - LO) / (HI - LO) * 100) + '%';
    fill.style.right = (100 - (b - LO) / (HI - LO) * 100) + '%';
    fIn.value = fmtUah(a); tIn.value = fmtUah(b);
    state.priceMin = a; state.priceMax = b;
    const full = a <= LO && b >= HI;
    btn.innerHTML = (full ? 'Ціна, ₴' : `${fmtUah(a)} – ${fmtUah(b)} ₴`) + ico('ic-chev');
    btn.classList.toggle('on', !full);
  };

  // перемальовуємо одразу, а перелік товарів — з невеликою паузою, щоб не смикалось
  let t = null;
  const live = () => { paint(); clearTimeout(t); t = setTimeout(onChange, 140); };
  A.addEventListener('input', live);
  B.addEventListener('input', live);

  const fromText = (inp, which) => {
    const v = parseInt(String(inp.value).replace(/\D/g, ''), 10);
    if (!Number.isFinite(v)) { paint(); return; }
    const clamped = Math.max(LO, Math.min(HI, Math.round(v / STEP) * STEP));
    if (which === 'a') A.value = Math.min(clamped, +B.value);
    else B.value = Math.max(clamped, +A.value);
    paint(); onChange();
  };
  fIn.addEventListener('change', () => fromText(fIn, 'a'));
  tIn.addEventListener('change', () => fromText(tIn, 'b'));
  panel.querySelector('#prReset').addEventListener('click', () => {
    A.value = LO; B.value = HI; paint(); onChange();
  });
  panel.addEventListener('click', (e) => e.stopPropagation());

  paint();
  return { reset: () => { A.value = LO; B.value = HI; paint(); }, LO, HI };
}

const fmtUah = (n) => Math.round(n).toLocaleString('uk-UA').replace(/,/g, ' ');

/* ---------------- нескінченна стрічка ----------------
   Один механізм для всіх каруселей сайту. Правило:
   автосвайп на одну комірку раз на 3 секунди, а коли блоки закінчуються —
   далі йдуть ті самі спочатку, ланцюжком без кінця і без відмотування назад.

   Як це працює: дублюємо вміст доріжки. Коли доїхали до початку копії,
   миттєво (без анімації) повертаємо доріжку на ту саму картинку в оригіналі.
   Око цього не бачить — зсув однаковий, кадр ідентичний. */
function initLoopRail(track, opts) {
  opts = opts || {};
  const view = track.parentElement;
  if (!track || !view || !track.children.length) return null;

  const originals = [...track.children];
  const count = originals.length;

  // копія потрібна, тільки якщо оригіналу не вистачає на всю ширину
  originals.forEach((n) => {
    const c = n.cloneNode(true);
    c.setAttribute('aria-hidden', 'true');
    c.dataset.clone = '1';
    track.appendChild(c);
  });

  let idx = 0, timer = null, animating = false;

  const step = () => {
    const card = track.children[0];
    if (!card) return 1;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return card.getBoundingClientRect().width + gap;
  };
  const perView = () => Math.max(1, Math.floor((view.clientWidth + 1) / step()));

  const place = (animate) => {
    track.style.transition = animate ? 'transform .62s var(--ease)' : 'none';
    track.style.transform = `translateX(${-idx * step()}px)`;
    if (opts.bar) {
      const b = document.querySelector(opts.bar);
      if (b) b.style.width = `${((idx % count) + 1) / count * 100}%`;
    }
  };

  const go = (n) => {
    if (animating) return;
    idx = n;
    animating = true;
    place(true);
    const after = () => {
      animating = false;
      // пройшли повний круг — безшовно вертаємось на початок оригіналу
      if (idx >= count) { idx -= count; place(false); }
      if (idx < 0) { idx += count; place(false); }
    };
    const t = setTimeout(after, 640);
    track.addEventListener('transitionend', function once() {
      clearTimeout(t); track.removeEventListener('transitionend', once); after();
    }, { once: true });
  };

  const tick = () => go(idx + 1);
  const restart = () => { clearInterval(timer); timer = setInterval(tick, SWIPE_MS); };
  const stop = () => clearInterval(timer);

  if (opts.prev) document.querySelector(opts.prev)?.addEventListener('click', () => { go(idx - 1); restart(); });
  if (opts.next) document.querySelector(opts.next)?.addEventListener('click', () => { go(idx + 1); restart(); });
  view.addEventListener('mouseenter', stop);
  view.addEventListener('mouseleave', restart);
  // на телефоні пауза, поки палець на стрічці
  view.addEventListener('touchstart', stop, { passive: true });
  view.addEventListener('touchend', restart, { passive: true });
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : restart()));
  window.addEventListener('resize', () => place(false));

  place(false);
  if (count > perView()) restart();
  return { go, stop, restart };
}

/* ---------------- renders ---------------- */
function renderCats() {
  const box = document.getElementById('cats'); if (!box) return;
  CATEGORIES.forEach((c, i) => box.appendChild(el(`
    <a class="cat rv" href="catalog.html?type=${encodeURIComponent(c.name)}">
      ${picCard(c.img, `alt="${c.name}" loading="lazy" decoding="async"`, "(max-width:640px) 50vw, 25vw")}
      <span class="cat__n num-out">0${i + 1}</span>
      <div class="cat__body">
        <div class="cat__bar"></div>
        <svg class="cat__ico"><use href="#${c.icon || 'ic-bike'}"></use></svg>
        <div class="cat__name">${c.name}</div>
        <div class="cat__meta">${c.short || ""}</div>
      </div>
    </a>`)));
}

function renderBrands() {
  const box = document.getElementById('brands-track'); if (!box) return;
  const track = el(`<div class="marquee__track"></div>`);
  // клік по марці веде в каталог, уже відфільтрований цим брендом
  [...BRANDS, ...BRANDS].forEach(b => track.appendChild(el(
    `<a class="bchip" href="catalog.html?brand=${encodeURIComponent(b)}">${b}</a>`)));
  box.appendChild(track);
}

function renderStrip() {
  const box = document.getElementById('strip'); if (!box) return;
  const items = [
    ['ic-truck','Доставка по Україні'], ['ic-shield','Офіційні бренди'], ['ic-swap','Trade-in'],
    ['ic-wrench','Сервіс і запчастини'], ['ic-support','Жива консультація'], ['ic-doc','Повний пакет документів'],
  ];
  const track = el(`<div class="strip__track"></div>`);
  [...items, ...items].forEach(([i, t]) => track.appendChild(el(`<div class="strip__item">${ico(i)}${t}</div>`)));
  box.appendChild(track);
}

/* --- стрічка товарів на головній --- */
function renderRail() {
  const track = document.getElementById('rail-track'); if (!track) return;
  PRODUCTS.slice(0, 10).forEach(p => track.appendChild(el(pcardHtml(p))));
  initLoopRail(track, { prev: '#rail-prev', next: '#rail-next', bar: '#rail-bar i' });
}

/* --- стрічка відгуків --- */
function renderReviews() {
  const track = document.getElementById('reviews'); if (!track) return;
  REVIEWS.forEach(r => track.appendChild(el(`
    <article class="rev">
      <div class="rev__top">
        <div class="rev__av">${r.av ? `${pic(r.av, `alt="" loading="lazy" decoding="async" width="200" height="200"`)}` : r.n[0]}</div>
        <div class="rev__who"><b>${r.n}</b><span>${r.c}</span></div>
      </div>
      <div class="rev__stars">${Array(5).fill(ico('ic-star')).join('')}</div>
      <p>${r.t}</p>
    </article>`)));
  initLoopRail(track, { prev: '#rev-prev', next: '#rev-next', bar: '#rev-bar i' });
}

/* --- catalog: sticky sidebar filters + grid --- */
function renderCatalog() {
  const grid = document.getElementById("catalog-grid"); if (!grid) return;
  const countEl = document.getElementById("f-count"), sortSel = document.getElementById("f-sort");
  const chipsBox = document.getElementById("f-chips");
  const ALL = "Усі";
  const groups = {
    type:  { label: "Тип",        values: [ALL, ...CATEGORIES.map(c => c.name)] },
    brand: { label: "Бренд",      values: [ALL, ...[...new Set(PRODUCTS.map(p => p.brand))]] },
    cc:    { label: "Об’єм, см³", values: [ALL, ...[...new Set(PRODUCTS.map(p => p.cc).filter(Boolean))].sort((a,b)=>a-b)] },
  };
  const state = { type: ALL, brand: ALL, cc: ALL, priceMin: 0, priceMax: Infinity };
  const q = (qs("q") || "").toLowerCase();
  if (groups.type.values.includes(qs("type"))) state.type = qs("type");
  // ?cat= (група верхнього рівня) теж працює — лишаємо старі посилання робочими
  const grp = qs("cat");
  if (qs("cc") && groups.cc.values.map(String).includes(qs("cc"))) state.cc = Number(qs("cc"));
  if (groups.brand.values.includes(qs("brand"))) state.brand = qs("brand");

  const inPrice = (p, st) => {
    if (!(st.priceMin > 0) && !isFinite(st.priceMax)) return true;
    if (typeof p.priceUah !== "number") return true;      // «ціна за запитом» не ховаємо
    return p.priceUah >= st.priceMin && p.priceUah <= st.priceMax;
  };
  const fits = (p, st) => (st.type === ALL || p.type === st.type) && (st.brand === ALL || p.brand === st.brand)
    && (st.cc === ALL || p.cc === st.cc) && inPrice(p, st)
    && (!grp || p.cat === grp);
  const match = (p) => fits(p, state)
    && (!q || (p.name + " " + p.brand + " " + p.type + " " + p.cat).toLowerCase().includes(q));
  const countFor = (g, v) => PRODUCTS.filter(p => fits(p, { ...state, [g]: v })).length;

  const paintHead = () => {
    const h1 = document.getElementById("cat-h1"), desc = document.getElementById("cat-desc");
    const tail = document.getElementById("cat-crumb-tail"), img = document.getElementById("cat-img");
    const link = document.getElementById("cat-crumb-link");
    const c = state.type !== ALL ? state.type : (grp || ALL);
    const meta = CATEGORIES.find(x => x.name === c);
    if (c === ALL) {
      if (h1) h1.textContent = "Каталог мототехніки";
      if (desc) desc.textContent = "Ендуро, мотарди, дорожні, спортбайки, пітбайки, квадроцикли та електроскутери — обери тип або скористайся фільтром.";
      if (tail) tail.innerHTML = "";
      if (link) link.removeAttribute("href");
      document.title = "Каталог мототехніки — MOTOMIX";
    } else {
      if (h1) h1.innerHTML = (meta && meta.icon ? `<svg class="h1ico"><use href="#${meta.icon}"></use></svg>` : "") + c;
      if (desc) desc.textContent = meta ? meta.d : "";
      if (tail) tail.innerHTML = `<em>›</em><span>${c}</span>`;
      if (link) link.setAttribute("href", "catalog.html");
      if (img && meta && meta.img) img.src = meta.img;
      document.title = `${c} — купити у Білій Церкві | MOTOMIX`;
    }
  };

  const draw = () => {
    let list = PRODUCTS.filter(match);
    const sort = sortSel ? sortSel.value : "default";
    if (sort === "az") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "za") list = [...list].sort((a, b) => b.name.localeCompare(a.name));
    if (sort === "cheap") list = [...list].sort((a, b) => (a.priceUah || 1e9) - (b.priceUah || 1e9));
    if (sort === "exp") list = [...list].sort((a, b) => (b.priceUah || 0) - (a.priceUah || 0));
    grid.innerHTML = "";
    if (!list.length) grid.appendChild(el(`<div class="empty"><b>Нічого не знайшли</b><p>Спробуй змінити фільтри або залиш заявку — підберемо під запит.</p></div>`));
    else list.forEach(p => grid.appendChild(el(pcardHtml(p))));
    if (countEl) countEl.textContent = `Знайдено: ${list.length}`;
    paintHead(); paintBars(); paintChips(); revealInit();
  };

  const paintBars = () => {
    Object.entries(groups).forEach(([g, cfg]) => {
      if (g === "price") return;
      const box = document.querySelector(`.fdd[data-g="${g}"]`); if (!box) return;
      const btn = box.querySelector(".fdd__b"), panel = box.querySelector(".fdd__p");
      const sel = state[g];
      btn.innerHTML = `${sel === ALL ? cfg.label : sel}` + ico("ic-chev");
      btn.classList.toggle("on", sel !== ALL);
      panel.innerHTML = "";
      cfg.values.forEach(v => {
        const n = countFor(g, v);
        const ic = g === "type" ? (CATEGORIES.find(c => c.name === v) || {}).icon : null;
        const o = el(`<button type="button" class="${state[g] === v ? "sel" : ""}" ${!n && v !== ALL ? "disabled" : ""}>` +
          `<span class="fopt">${ic ? `<svg class="fopt__ico"><use href="#${ic}"></use></svg>` : ""}${v}</span><i>${n}</i></button>`);
        o.addEventListener("click", () => { state[g] = v; box.classList.remove("open"); draw(); });
        panel.appendChild(o);
      });
    });
  };

  const paintChips = () => {
    if (!chipsBox) return;
    chipsBox.innerHTML = "";
    if (priceUI && (state.priceMin > priceUI.LO || state.priceMax < priceUI.HI)) {
      const c = el(`<button type="button" class="fchip">Ціна: <b>${fmtUah(state.priceMin)} – ${fmtUah(state.priceMax)} ₴</b> ×</button>`);
      c.addEventListener("click", () => { priceUI.reset(); draw(); });
      chipsBox.appendChild(c);
    }
    Object.entries(groups).forEach(([g, cfg]) => {
      if (g === "price" || state[g] === ALL) return;
      const c = el(`<button type="button" class="fchip">${cfg.label}: <b>${state[g]}</b> ×</button>`);
      c.addEventListener("click", () => { state[g] = ALL; draw(); });
      chipsBox.appendChild(c);
    });
  };

  // відкриття/закриття випадайок
  document.querySelectorAll(".fdd .fdd__b").forEach(b => b.addEventListener("click", (e) => {
    e.stopPropagation();
    const box = b.closest(".fdd"), was = box.classList.contains("open");
    document.querySelectorAll(".fdd.open").forEach(x => x.classList.remove("open"));
    if (was) return;
    box.classList.add("open");

    // Довгий список брендів відкривався на «Усі» — потрібного не видно без скролу.
    // Докручуємо до вибраного, а якщо вибору нема — до першого, що є в наявності.
    const panel = box.querySelector(".fdd__p");
    if (!panel || panel.classList.contains("fdd__p--price")) return;
    requestAnimationFrame(() => {
      const target = panel.querySelector("button.sel:not([disabled])")
        || [...panel.querySelectorAll("button:not([disabled])")].find(x => !/^Усі/.test(x.textContent));
      if (!target) return;
      const top = target.offsetTop - panel.clientHeight / 2 + target.offsetHeight / 2;
      panel.scrollTop = Math.max(0, top);
    });
  }));
  document.addEventListener("click", () => document.querySelectorAll(".fdd.open").forEach(x => x.classList.remove("open")));
  document.getElementById("f-reset")?.addEventListener("click", () => {
    state.type = ALL; state.brand = ALL; state.cc = ALL;
    if (priceUI) priceUI.reset();
    draw();
  });
  sortSel?.addEventListener("change", draw);
  const priceUI = initPriceSlider(document.querySelector('.fdd[data-g="price"]'), state, draw);
  draw();

  // прийшли в розділ — одразу листаємо до товарів, банер лишається вище
  if (!cameBack() && (qs("type") || qs("cat") || qs("q") || qs("brand"))) {
    const jump = () => {
      const bar = document.getElementById("fbar") || grid;
      if (!bar) return;
      const hh = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--hh"), 10) || 110;
      const y = window.scrollY + bar.getBoundingClientRect().top - hh - 18;
      if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1 });
      else window.scrollTo({ top: y, behavior: "smooth" });
    };
    setTimeout(jump, 420);
  }
}

/* --- product page: swipe gallery + accordions + reviews --- */
function renderProduct() {
  const root = document.getElementById('pdp'); if (!root) return;
  const p = PRODUCTS.find(x => x.id === qs('id')) || PRODUCTS[0];
  const n = nameOf(p);
  document.title = n.title + ' — купити у Білій Церкві | MOTOMIX';
  const gal = (p.gallery && p.gallery.length) ? p.gallery : [p.img];
  const needMore = (p.desc || "").length > 320;

  root.innerHTML = `
    <div class="gallery-col">
      <div class="gallery">
        <div class="gallery__main" id="galMain" style="--galr:${p.ar || 1.333}">
          <div class="gallery__strip" id="galStrip">${gal.map((g, gi) => `<div class="gallery__slide">${pic(g, `alt="${n.title}" draggable="false" decoding="async" ` + (gi ? 'loading="lazy"' : 'fetchpriority="high"'))}</div>`).join("")}</div>
          ${gal.length > 1 ? `<button class="gallery__nav gallery__nav--p" id="galPrev" type="button" aria-label="Попереднє фото">${ico("ic-arrow-l")}</button>
          <button class="gallery__nav gallery__nav--n" id="galNext" type="button" aria-label="Наступне фото">${ico("ic-arrow")}</button>
          <span class="gallery__count" id="galCount">1 / ${gal.length}</span>` : ""}
        </div>
        ${gal.length > 1 ? `<div class="gallery__thumbs" id="galThumbs">${gal.map((g, i) => `<button type="button" class="${i ? "" : "active"}" data-i="${i}" aria-label="Фото ${i + 1}">${picCard(g, `alt="" loading="lazy" decoding="async"`, "100px")}</button>`).join("")}</div>` : ""}
      </div>
      <section class="pdesc" id="pdesc">
        <h2 class="pdesc__t">Опис</h2>
        <div class="pdesc__body" id="pdescBody">${formatDesc(p.desc)}</div>
        ${needMore ? `<button class="pdesc__more" id="pdescMore" type="button">Переглянути більше ${ico("ic-chev")}</button>` : ""}
      </section>
    </div>

    <div class="pdp__info">
      <div class="crumbs crumbs--pdp">
        <a href="index.html">Головна</a><em>›</em>
        <a href="catalog.html">Каталог</a><em>›</em>
        <a href="catalog.html?type=${encodeURIComponent(p.type || p.cat)}">${p.type || p.cat}</a><em>›</em>
        <span>${n.title}</span>
      </div>
      <h1 class="pdp__title">${n.title}</h1>
      ${n.meta ? `<p class="pdp__sub">${n.meta}</p>` : ""}
      <div class="pdp__status">
        <span class="pdp__stock">${stockOf(p)}</span>
        <span class="pdp__stars">${Array(5).fill(ico('ic-star')).join('')}</span>
        <span class="pdp__revn">${REVIEWS.length} відгуки</span>
      </div>
      <div class="pdp__price"><b>${priceText(p)}</b></div>
      <div class="pdp__actions">
        <button class="btn btn--red btn--lg" type="button" data-cart-add="${p.id}" data-cart-open>${ico("ic-cart")} Додати в кошик</button>
        <button class="btn btn--line btn--lg" type="button" data-order="Швидке замовлення — ${n.title}">Купити в 1 клік</button>
      </div>
      <a class="pdp__call" href="tel:+380938701107">${ico("ic-phone")} +38 093 870 11 07 — відповімо за 30 секунд</a>

      <dl class="facts facts--pdp">${factsOf(p).map(f => `<div class="facts__r"><dt>${f.k}</dt><dd>${f.href ? `<a href="${f.href}">${f.v}</a>` : f.v}</dd></div>`).join("")}</dl>

      <div class="acc">
        <div class="acc__i"><button class="acc__q">Доставка та оплата ${ico("ic-plus")}</button>
          <div class="acc__a"><div><ul>
            <li>Доставка по всій Україні, без передоплати</li>
            <li>Самовивіз: вул. Сухоярська, Біла Церква</li>
            <li>Готівка, картка, безготівковий розрахунок</li>
            <li>Повний пакет документів для реєстрації</li></ul></div></div></div>
        <div class="acc__i"><button class="acc__q">Гарантія та сервіс ${ico("ic-plus")}</button>
          <div class="acc__a"><div><ul>
            <li>Передпродажна підготовка кожної одиниці</li>
            <li>Гарантія виробника</li>
            <li>Сервіс і запчастини після покупки</li></ul></div></div></div>
      </div>
      <div class="trust">
        <div>${ico("ic-shield")}<b>Гарантія</b><span>офіційний бренд</span></div>
        <div>${ico("ic-truck")}<b>Доставка</b><span>по всій Україні</span></div>
        <div>${ico("ic-wrench")}<b>Сервіс</b><span>після покупки</span></div>
      </div>
    </div>`;

  const moreBtn = document.getElementById("pdescMore");
  moreBtn?.addEventListener("click", () => {
    const d = document.getElementById("pdesc");
    const open = d.classList.toggle("open");
    moreBtn.innerHTML = (open ? "Згорнути " : "Переглянути більше ") + ico("ic-chev");
  });

  window.__gal = gal;
  initGallery(gal.length);
  initAcc();
  const rel = document.getElementById('related');
  if (rel) PRODUCTS.filter(x => (x.type || x.cat) === (p.type || p.cat) && x.id !== p.id).slice(0, 5)
    .forEach(x => rel.appendChild(el(pcardHtml(x))));
}

/* --- swipeable gallery (drag + arrows + thumbs) --- */
function initGallery(total) {
  const main = document.getElementById('galMain'), strip = document.getElementById('galStrip');
  if (!main || !strip || total < 1) return;
  const counter = document.getElementById('galCount');
  const thumbs = [...document.querySelectorAll('#galThumbs button')];
  let i = 0, startX = 0, dx = 0, dragging = false, fromBtn = false;
  const w = () => main.clientWidth;

  const go = (nv, animate = true) => {
    i = (nv + total) % total;                       // зациклюємо: з останнього — на перше
    strip.style.transition = animate ? '.55s cubic-bezier(.19,1,.22,1)' : 'none';
    strip.style.transform = 'translateX(' + (-i * w()) + 'px)';
    thumbs.forEach((b, k) => b.classList.toggle('active', k === i));
    if (counter) counter.textContent = (i + 1) + ' / ' + total;
    const act = thumbs[i];
    if (act && act.parentElement) {                 // підтягуємо активну мініатюру у видиму зону
      const box = act.parentElement, l = act.offsetLeft, r = l + act.offsetWidth;
      if (l < box.scrollLeft) box.scrollTo({ left: l - 12, behavior: 'smooth' });
      else if (r > box.scrollLeft + box.clientWidth) box.scrollTo({ left: r - box.clientWidth + 12, behavior: 'smooth' });
    }
  };

  // стрілки: гасимо pointer-події, щоб клік не з'їдався драгом
  const arm = (id, delta) => {
    const b = document.getElementById(id); if (!b) return;
    ['pointerdown', 'pointermove', 'pointerup'].forEach(ev =>
      b.addEventListener(ev, e => { e.stopPropagation(); fromBtn = true; }));
    b.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); go(i + delta); });
  };
  arm('galPrev', -1); arm('galNext', 1);

  thumbs.forEach(b => {
    b.addEventListener('pointerdown', e => { e.stopPropagation(); fromBtn = true; });
    b.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); go(+b.dataset.i); });
  });

  const down = (x) => { if (fromBtn) { fromBtn = false; return; }
    dragging = true; startX = x; dx = 0; main.classList.add('drag'); strip.style.transition = 'none'; };
  const move = (x) => { if (!dragging) return; dx = x - startX;
    strip.style.transform = 'translateX(' + (-i * w() + dx) + 'px)'; };
  const up = () => { if (!dragging) return; dragging = false; main.classList.remove('drag');
    if (Math.abs(dx) > w() * 0.15) go(dx < 0 ? i + 1 : i - 1); else go(i); };

  main.addEventListener('pointerdown', e => down(e.clientX));
  main.addEventListener('pointermove', e => move(e.clientX));
  main.addEventListener('pointerup', up);
  main.addEventListener('pointerleave', up);
  main.addEventListener('dragstart', e => e.preventDefault());
  // клік без перетягування = відкрити фото на весь екран
  main.addEventListener('click', (e) => {
    if (e.target.closest('.gallery__nav')) return;
    if (Math.abs(dx) > 4) return;
    initLightbox(window.__gal || [], i);
  });

  // клавіатура — стрілками вліво/вправо
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') go(i - 1);
    if (e.key === 'ArrowRight') go(i + 1);
  });
  window.addEventListener('resize', () => go(i, false));
  go(0, false);
}

/* ---------------- перегляд фото на весь екран ----------------
   Клік по знімку відкриває його великим: колесо або клік — масштаб,
   перетягування — рух по фото, стрілки й Esc — як у звичайних галереях. */
function initLightbox(gal, startIndex) {
  if (!gal || !gal.length) return;
  let box = document.getElementById('lbox');
  if (!box) {
    box = el(`
      <div class="lbox" id="lbox" aria-hidden="true">
        <div class="lbox__bd" data-lb-close></div>
        <button class="lbox__x" data-lb-close type="button" aria-label="Закрити">${ico('ic-x')}</button>
        <button class="lbox__nav lbox__nav--p" id="lbPrev" type="button" aria-label="Попереднє">${ico('ic-arrow-l')}</button>
        <button class="lbox__nav lbox__nav--n" id="lbNext" type="button" aria-label="Наступне">${ico('ic-arrow')}</button>
        <div class="lbox__stage" id="lbStage"><img id="lbImg" alt="" draggable="false"></div>
        <div class="lbox__bar"><span id="lbCount"></span><span class="lbox__hint">Колесо або клік — масштаб · перетягніть, щоб рухати</span></div>
      </div>`);
    document.body.appendChild(box);
  }
  const img = box.querySelector('#lbImg'), stage = box.querySelector('#lbStage');
  const counter = box.querySelector('#lbCount');
  let i = startIndex || 0, scale = 1, tx = 0, ty = 0, dragging = false, sx = 0, sy = 0, moved = false;

  const apply = () => { img.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`; };
  const reset = () => { scale = 1; tx = 0; ty = 0; apply(); box.classList.toggle('zoomed', false); };
  const show = (n) => {
    i = (n + gal.length) % gal.length;
    img.onerror = function () { img.onerror = null; img.src = gal[i]; };
    img.src = webpOf(gal[i]);
    if (counter) counter.textContent = (i + 1) + ' / ' + gal.length;
    reset();
  };
  const setScale = (next, cx, cy) => {
    const prev = scale;
    scale = Math.max(1, Math.min(4, next));
    if (scale === 1) { tx = 0; ty = 0; }
    else if (cx != null) {
      const r = stage.getBoundingClientRect();
      const dx = cx - (r.left + r.width / 2), dy = cy - (r.top + r.height / 2);
      tx = (tx - dx) * (scale / prev) + dx;
      ty = (ty - dy) * (scale / prev) + dy;
    }
    box.classList.toggle('zoomed', scale > 1);
    apply();
  };

  box.querySelector('#lbPrev').onclick = (e) => { e.stopPropagation(); show(i - 1); };
  box.querySelector('#lbNext').onclick = (e) => { e.stopPropagation(); show(i + 1); };

  stage.onwheel = (e) => { e.preventDefault(); setScale(scale * (e.deltaY < 0 ? 1.22 : 1 / 1.22), e.clientX, e.clientY); };
  stage.onpointerdown = (e) => { dragging = true; moved = false; sx = e.clientX - tx; sy = e.clientY - ty; stage.setPointerCapture(e.pointerId); };
  stage.onpointermove = (e) => {
    if (!dragging) return;
    if (Math.abs(e.clientX - tx - sx) > 3 || Math.abs(e.clientY - ty - sy) > 3) moved = true;
    if (scale > 1) { tx = e.clientX - sx; ty = e.clientY - sy; apply(); }
  };
  stage.onpointerup = (e) => {
    dragging = false;
    if (moved) return;                       // тягнули, а не клікали
    setScale(scale > 1 ? 1 : 2.4, e.clientX, e.clientY);
  };

  const onKey = (e) => {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  };
  const close = () => {
    box.classList.remove('open'); box.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
  };
  box.querySelectorAll('[data-lb-close]').forEach(n => n.onclick = close);
  document.addEventListener('keydown', onKey);

  show(i);
  box.classList.add('open'); box.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

/* --- accordion (product + FAQ) --- */
function initAcc() {
  document.querySelectorAll('.acc__q:not([data-ready])').forEach(q => {
    q.dataset.ready = '1';
    q.addEventListener('click', () => {
      const item = q.closest('.acc__i'), a = item.querySelector('.acc__a'), was = item.classList.contains('open');
      const scope = item.parentElement;
      scope.querySelectorAll('.acc__i.open').forEach(x => { x.classList.remove('open'); x.querySelector('.acc__a').style.maxHeight = null; });
      if (!was) { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });
  document.querySelectorAll('.acc__i.open .acc__a').forEach(a => { a.style.maxHeight = a.scrollHeight + 'px'; });
}

/* =====================================================================
   КОШИК — зберігається в localStorage, живе на всіх сторінках
   ===================================================================== */
const CART_KEY = 'motomix_cart_v1';

const cartRead = () => {
  try { const v = JSON.parse(localStorage.getItem(CART_KEY) || '[]'); return Array.isArray(v) ? v : []; }
  catch { return []; }
};
const cartWrite = (items) => {
  try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch {}
  cartPaintBadge(); cartPaintBody();
};
const cartQty = () => cartRead().reduce((s, i) => s + i.q, 0);
const cartList = () => cartRead()
  .map(i => ({ ...i, p: PRODUCTS.find(x => x.id === i.id) }))
  .filter(i => i.p);                                  // товар зник з каталогу — тихо прибираємо
const cartTotal = () => cartList().reduce((s, i) => s + (i.p.priceUah || 0) * i.q, 0);
const uah = (n) => n.toLocaleString('uk-UA').replace(/,/g, ' ') + ' ₴';

function cartAdd(id, q = 1) {
  const items = cartRead();
  const hit = items.find(i => i.id === id);
  if (hit) hit.q = Math.min(99, hit.q + q); else items.push({ id, q });
  cartWrite(items);
  cartFlash();
}
function cartSetQty(id, q) {
  let items = cartRead();
  if (q <= 0) items = items.filter(i => i.id !== id);
  else { const hit = items.find(i => i.id === id); if (hit) hit.q = Math.min(99, q); }
  cartWrite(items);
}
const cartRemove = (id) => cartSetQty(id, 0);
const cartClear = () => cartWrite([]);

function cartPaintBadge() {
  const n = cartQty(), b = document.getElementById('cartCount');
  if (!b) return;
  b.textContent = n;
  b.hidden = n === 0;
}

/* коротка підсвітка кнопки кошика — видно, що товар долетів */
function cartFlash() {
  const b = document.getElementById('cartBtn'); if (!b) return;
  b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
}

function cartPaintBody() {
  const box = document.getElementById('cartBody'); if (!box) return;
  const foot = document.getElementById('cartFoot');
  const list = cartList();

  if (!list.length) {
    box.innerHTML = '<div class="cart__empty">' +
      '<svg class="icon"><use href="#ic-cart"></use></svg>' +
      '<b>Кошик порожній</b>' +
      '<p>Додай техніку з каталогу — і оформимо замовлення в пару кліків.</p>' +
      '<a class="btn btn--line" href="catalog.html">Перейти до каталогу</a></div>';
    if (foot) foot.hidden = true;
    return;
  }

  box.innerHTML = list.map(i => {
    const n = nameOf(i.p);
    return `<article class="ci" data-id="${i.p.id}">
      <a class="ci__img" href="product.html?id=${i.p.id}">${picCard(i.p.img, `alt="${n.title}" loading="lazy" decoding="async"`, "90px")}</a>
      <div class="ci__main">
        <a class="ci__name" href="product.html?id=${i.p.id}">${n.title}</a>
        <div class="ci__price">${priceText(i.p)}</div>
        <div class="ci__row">
          <div class="qty">
            <button type="button" class="qty__b" data-q="-1" aria-label="Менше"><svg class="icon"><use href="#ic-minus"></use></svg></button>
            <input class="qty__i" type="text" inputmode="numeric" value="${i.q}" aria-label="Кількість">
            <button type="button" class="qty__b" data-q="1" aria-label="Більше"><svg class="icon"><use href="#ic-plus"></use></svg></button>
          </div>
          <button type="button" class="ci__del" aria-label="Прибрати"><svg class="icon"><use href="#ic-trash"></use></svg></button>
        </div>
      </div>
      <div class="ci__sum">${i.p.priceUah ? uah(i.p.priceUah * i.q) : "—"}</div>
    </article>`;
  }).join('');

  if (foot) foot.hidden = false;
  const t = uah(cartTotal());
  const t1 = document.getElementById('cartTotal'), t2 = document.getElementById('cartTotal2');
  if (t1) t1.textContent = t;
  if (t2) t2.textContent = t;
}

const cartOpen = () => {
  const p = document.getElementById('cartPanel'); if (!p) return;
  cartStep('list');
  p.classList.add('open'); p.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};
const cartClose = () => {
  const p = document.getElementById('cartPanel'); if (!p) return;
  p.classList.remove('open'); p.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

/* три стани панелі: список → форма → підтвердження */
function cartStep(step) {
  const body = document.getElementById('cartBody'), foot = document.getElementById('cartFoot');
  const form = document.getElementById('cartForm'), done = document.getElementById('cartDone');
  if (!body) return;
  const show = (n, on) => { if (n) n.hidden = !on; };
  show(body, step === 'list'); show(form, step === 'form'); show(done, step === 'done');
  show(foot, step === 'list' && cartList().length > 0);
}

/* ---------------- доставка ----------------
   Чотири варіанти: Нова Пошта, Укрпошта, Міст Експрес і самовивіз.
   У Нової Пошти є відкритий API — там підказки міста й відділення.
   В інших перевізників поля заповнюються руками: менеджер однаково
   передзвонює і підтверджує відділення. Головне — щоб вибір доставки
   ніколи не блокував оформлення. */
const NP_ENDPOINT = (ORDER_ENDPOINT || '/api/order').replace(/\/order$/, '/np');

const CARRIERS = {
  np:     { label: 'Нова Пошта',   auto: true,  wh: 'Номер або адреса відділення' },
  up:     { label: 'Укрпошта',     auto: false, wh: 'Індекс або номер відділення' },
  mist:   { label: 'Міст Експрес', auto: false, wh: 'Номер або адреса відділення' },
  pickup: { label: 'Самовивіз',    auto: false, wh: '' },
};

function initDelivery() {
  const wrap = document.querySelector('.dlv'); if (!wrap) return;
  const fields = document.getElementById('dlvFields'), pickBox = document.getElementById('dlvPickup');
  const city = document.getElementById('npCity'), wh = document.getElementById('npWh');
  const cityList = document.getElementById('npCityList'), whList = document.getElementById('npWhList');
  const hint = document.getElementById('npHint');
  let mode = 'np', cityRef = '', manual = false;

  const showHint = (t) => { if (!hint) return; hint.hidden = !t; hint.textContent = t || ''; };

  const setMode = (m) => {
    mode = m;
    const c = CARRIERS[m];
    fields.hidden = m === 'pickup';
    pickBox.hidden = m !== 'pickup';
    if (m === 'pickup') { showHint(''); return; }
    wh.placeholder = c.wh;
    cityRef = ''; cityList.hidden = true; whList.hidden = true;
    showHint(c.auto
      ? ''
      : 'Підкажіть місто й відділення — менеджер підтвердить і розрахує доставку.');
  };

  wrap.querySelectorAll('.dlv__tab').forEach((t) => t.addEventListener('click', () => {
    wrap.querySelectorAll('.dlv__tab').forEach((x) => x.classList.toggle('is-on', x === t));
    setMode(t.dataset.dlv);
  }));

  const goManual = () => {
    if (manual) return;
    manual = true;
    showHint('Підказки зараз недоступні — впишіть місто й відділення вручну, менеджер підтвердить.');
  };

  const ask = async (params) => {
    try {
      const r = await fetch(NP_ENDPOINT + '?' + new URLSearchParams(params));
      if (!r.ok) { goManual(); return null; }
      return await r.json();
    } catch { goManual(); return null; }
  };

  const paint = (box, items, onPick) => {
    if (!items || !items.length) { box.hidden = true; return; }
    box.innerHTML = items.map((i, k) =>
      `<button type="button" data-k="${k}"><b>${i.name}</b>${i.area ? `<span>${i.area}</span>` : ''}</button>`).join('');
    box.hidden = false;
    box.querySelectorAll('button').forEach((btn) => btn.addEventListener('click', () => {
      onPick(items[+btn.dataset.k]); box.hidden = true;
    }));
  };

  let t1 = null;
  city.addEventListener('input', () => {
    cityRef = '';
    clearTimeout(t1);
    if (!CARRIERS[mode].auto || manual) { cityList.hidden = true; return; }
    const q = city.value.trim();
    if (q.length < 2) { cityList.hidden = true; return; }
    t1 = setTimeout(async () => {
      const d = await ask({ q });
      if (!d || !d.items) return;
      paint(cityList, d.items, (it) => { city.value = it.name; cityRef = it.ref; wh.focus(); });
    }, 260);
  });

  let t2 = null;
  wh.addEventListener('input', () => {
    clearTimeout(t2);
    if (!CARRIERS[mode].auto || manual || !cityRef) { whList.hidden = true; return; }
    t2 = setTimeout(async () => {
      const d = await ask({ city: cityRef, name: city.value.trim(), q: wh.value.trim() });
      if (!d || !d.items) return;
      paint(whList, d.items, (it) => { wh.value = it.name; });
    }, 260);
  });
  wh.addEventListener('focus', () => {
    if (CARRIERS[mode].auto && !manual && cityRef && !wh.value) wh.dispatchEvent(new Event('input'));
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#npCityList') && e.target !== city) cityList.hidden = true;
    if (!e.target.closest('#npWhList') && e.target !== wh) whList.hidden = true;
  });

  setMode('np');

  window.__deliveryValue = () => {
    if (mode === 'pickup') return 'Самовивіз — вул. Сухоярська, Біла Церква';
    const c = city.value.trim(), w = wh.value.trim();
    if (!c && !w) return '';
    return CARRIERS[mode].label + ': ' + [c, w].filter(Boolean).join(', ');
  };
}

function initCart() {
  cartPaintBadge(); cartPaintBody();

  document.getElementById('cartBtn')?.addEventListener('click', cartOpen);
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-cart-close]')) { cartClose(); return; }

    // «В кошик» з карточки або зі сторінки товару
    const add = e.target.closest('[data-cart-add]');
    if (add) {
      e.preventDefault(); e.stopPropagation();
      cartAdd(add.getAttribute('data-cart-add'));
      if (add.hasAttribute('data-cart-open')) cartOpen();
      return;
    }

    const row = e.target.closest('.ci'); if (!row) return;
    const id = row.dataset.id;
    const q = e.target.closest('.qty__b');
    if (q) { const cur = cartRead().find(i => i.id === id); cartSetQty(id, (cur ? cur.q : 0) + Number(q.dataset.q)); return; }
    if (e.target.closest('.ci__del')) cartRemove(id);
  });

  // ручне введення кількості
  document.addEventListener('change', (e) => {
    const inp = e.target.closest('.qty__i'); if (!inp) return;
    const id = inp.closest('.ci')?.dataset.id; if (!id) return;
    const v = parseInt(String(inp.value).replace(/\D/g, ''), 10);
    cartSetQty(id, Number.isFinite(v) ? v : 1);
  });

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cartClose(); });
  document.getElementById('cartClear')?.addEventListener('click', () => { if (confirm('Очистити кошик?')) cartClear(); });
  document.getElementById('cartCheckout')?.addEventListener('click', () => cartStep('form'));
  document.getElementById('cartBack')?.addEventListener('click', () => cartStep('list'));

  // кошик спільний для вкладок
  window.addEventListener('storage', (e) => { if (e.key === CART_KEY) { cartPaintBadge(); cartPaintBody(); } });

  const form = document.getElementById('cartForm');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const note = document.getElementById('cartNote'), btn = document.getElementById('cartSend');
    const list = cartList();
    if (!list.length) { cartStep('list'); return; }

    const fd = new FormData(form);
    const sum = cartTotal();
    const payload = {
      kind: 'order',
      subject: 'Замовлення з кошика',
      name: fd.get('name'), phone: fd.get('phone'), comment: fd.get('comment'), company: fd.get('company'),
      page: location.pathname + location.search,
      delivery: (window.__deliveryValue ? window.__deliveryValue() : ''),
      total: sum,
      items: list.map(i => ({
        id: i.p.id, name: nameOf(i.p).title, qty: i.q,
        price: priceText(i.p), sum: (i.p.priceUah || 0) * i.q,
      })),
    };

    note.textContent = 'Відправляємо…'; note.className = 'form__note';
    btn.disabled = true;
    try {
      const r = await fetch(ORDER_ENDPOINT || '/api/order', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error('bad status');
      const sub = document.getElementById('cartDoneSub');
      const word = list.length === 1 ? 'позицію' : 'позиції';
      if (sub) sub.textContent = 'Замовлення на ' + list.length + ' ' + word + ' на суму ' + uah(sum) +
        ' прийнято. Менеджер передзвонить на ' + fd.get('phone') + ' і підтвердить наявність та доставку.';
      cartClear(); form.reset();
      cartStep('done');
      note.textContent = '';
    } catch {
      note.textContent = '⚠️ Не вдалось відправити. Подзвоніть: +38 093 870 11 07';
      note.className = 'form__note err';
    } finally { btn.disabled = false; }
  });
}

/* ---------------- повернення на те саме місце ----------------
   Клікнув товар у блоці посеред сторінки, натиснув «назад» — і маєш
   опинитися там само, а не вгорі. Позицію пишемо перед виходом зі
   сторінки, а повертаємо лише коли браузер каже, що це саме «назад». */
const SCROLL_KEY = () => 'mm:scroll:' + location.pathname + location.search;

const cameBack = () => {
  try {
    const nav = performance.getEntriesByType('navigation')[0];
    return !!nav && nav.type === 'back_forward';
  } catch { return false; }
};

function initScrollMemory() {
  const save = () => {
    try { sessionStorage.setItem(SCROLL_KEY(), String(Math.round(window.scrollY))); } catch {}
  };
  addEventListener('pagehide', save);
  addEventListener('beforeunload', save);
  // Safari/iOS іноді не дає pagehide доїхати — підстраховуємось
  document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
}

function restoreScroll() {
  if (!cameBack()) return false;
  let y = 0;
  try { y = parseInt(sessionStorage.getItem(SCROLL_KEY()) || '0', 10) || 0; } catch {}
  if (y <= 0) return false;
  const jump = () => {
    if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true });
    else window.scrollTo(0, y);
  };
  requestAnimationFrame(() => requestAnimationFrame(jump));
  setTimeout(jump, 240);          // після того, як домалюються картки
  return true;
}

/* ---------------- chrome ---------------- */
function initCards() {
  document.addEventListener("click", (e) => {
    const card = e.target.closest(".pcard[data-href]"); if (!card) return;
    if (e.target.closest("a,button")) return;        // внутрішні посилання працюють самі
    if (window.__dragMoved) return;                   // тягнули карусель — не відкривати
    location.href = card.dataset.href;
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const card = document.activeElement?.closest?.(".pcard[data-href]");
    if (card) location.href = card.dataset.href;
  });
}

function initChrome() {
  const header = document.getElementById('header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 24);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  }
  const burger = document.getElementById('burger'), menu = document.getElementById('mobileMenu');
  if (burger && menu) {
    burger.addEventListener('click', () => menu.classList.toggle('open'));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
  }
  const page = (location.pathname.split('/').pop() || 'index.html').replace('.html', '') || 'index';
  document.querySelectorAll('[data-nav]').forEach(a => { if (a.dataset.nav === page) a.classList.add('active'); });
  // підсвічуємо розділ, у який людина перейшла: сам тип і його групу в шапці
  const curType = qs('type'), curCat = qs('cat');
  const marks = new Set();
  if (curType) {
    marks.add(curType);
    const g = (window.MM_CATEGORIES || []).find(c => c.name === curType);
    if (g && g.group) marks.add(g.group);
  }
  if (curCat) marks.add(curCat);
  if (marks.size) {
    let hit = false;
    document.querySelectorAll('[data-nav-cat]').forEach(el => {
      if (marks.has(el.dataset.navCat)) { el.classList.add('active'); hit = true; }
    });
    if (hit) document.querySelectorAll('[data-nav="catalog"]').forEach(el => el.classList.remove('active'));
  }
  const s = document.getElementById('siteSearch');
  s?.closest('form')?.addEventListener('submit', () => {
    const v = s.value.trim(); if (v) location.href = `catalog.html?q=${encodeURIComponent(v)}`;
  });
}

/* ховаємо плаваючу кнопку, коли дійшли до підвалу — вона перекривала
   нижній рядок із посиланнями */
function initFabHide() {
  const fab = document.querySelector('.callback-fab');
  const foot = document.querySelector('.footer__base');
  if (!fab || !foot) return;
  new IntersectionObserver((e) => {
    fab.classList.toggle('tucked', e[0].isIntersecting);
  }, { rootMargin: '0px 0px -10px 0px' }).observe(foot);
}

function revealInit() {
  const io = new IntersectionObserver((e) => e.forEach(x => {
    if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); }
  }), { threshold: 0.1, rootMargin: '0px 0px -60px' });
  document.querySelectorAll('.rv:not(.in)').forEach((n, i) => { n.style.transitionDelay = `${(i % 5) * 70}ms`; io.observe(n); });
  // те, що вже у видимій частині, проявляємо одразу — інакше перший екран стоїть порожнім
  requestAnimationFrame(() => {
    document.querySelectorAll('.rv:not(.in)').forEach(n => {
      const r = n.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) n.classList.add('in');
    });
  });
}

function initModal() {
  const modal = document.getElementById('orderModal'); if (!modal) return;
  const sub = document.getElementById('modalSub'), subject = document.getElementById('orderSubject'), note = document.getElementById('formNote');
  const open = (s) => {
    subject.value = s || 'Заявка з сайту';
    sub.textContent = s && s !== 'Загальна заявка' ? `Заявка: ${s}. Залиш контакти — зв'яжемось найближчим часом.`
      : 'Залиш контакти — передзвонимо, проконсультуємо, забронюємо.';
    note.textContent = ''; note.className = 'form__note';
    modal.classList.add('open'); document.body.style.overflow = 'hidden';
  };
  const close = () => { modal.classList.remove('open'); document.body.style.overflow = ''; };
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-order]');
    if (t) { e.preventDefault(); open(t.getAttribute('data-order')); }
    if (e.target.closest('[data-close]')) close();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  document.getElementById('orderForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = {
      subject: fd.get('subject'), name: fd.get('name'), phone: fd.get('phone'),
      comment: fd.get('comment'), company: fd.get('company'), page: location.pathname + location.search,
    };
    note.textContent = 'Відправляємо…'; note.className = 'form__note';
    try {
      const r = await fetch(ORDER_ENDPOINT || '/api/order', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error('bad status');
      note.textContent = '✅ Дякуємо! Передзвонимо найближчим часом.'; note.className = 'form__note ok';
      e.target.reset(); setTimeout(close, 2200);
    } catch {
      note.textContent = '⚠️ Не вдалось відправити. Подзвоніть: +38 093 870 11 07'; note.className = 'form__note err';
    }
  });
}

/* форми, вбудовані прямо в сторінку (контакти) — без модалки */
function initInlineForms() {
  document.querySelectorAll('[data-inline-form]').forEach(form => {
    const note = form.querySelector('.form__note');
    const btn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const payload = {
        subject: fd.get('subject') || 'Заявка з сайту',
        name: fd.get('name'), phone: fd.get('phone'),
        comment: fd.get('comment'), company: fd.get('company'),
        page: location.pathname + location.search,
      };
      if (note) { note.textContent = 'Відправляємо…'; note.className = 'form__note fband__note'; }
      if (btn) btn.disabled = true;
      try {
        const r = await fetch(ORDER_ENDPOINT || '/api/order', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        });
        if (!r.ok) throw new Error('bad status');
        if (note) { note.textContent = '✅ Дякуємо! Передзвонимо найближчим часом.'; note.className = 'form__note fband__note ok'; }
        form.reset();
      } catch {
        if (note) { note.textContent = '⚠️ Не вдалось відправити. Подзвоніть: +38 093 870 11 07'; note.className = 'form__note fband__note err'; }
      } finally { if (btn) btn.disabled = false; }
    });
  });
}

function initSmooth() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js';
  s.onload = () => {
    try {
      const lenis = window.__lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
      if (!cameBack()) lenis.scrollTo(0, { immediate: true });
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    } catch {}
  };
  document.head.appendChild(s);
}

/* ---------------- boot ---------------- */
(async function boot() {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  const back = cameBack();
  if (!back) window.scrollTo(0, 0);
  initScrollMemory();
  await Promise.all([...document.querySelectorAll('[data-include]')].map(async n => {
    try { n.innerHTML = await (await fetch(n.getAttribute('data-include'))).text(); } catch {}
    n.classList.add('filled');
  }));
  const setHH = () => { const h = document.getElementById("header"); if (h) document.documentElement.style.setProperty("--hh", h.offsetHeight + "px"); };
  setHH(); window.addEventListener("resize", setHH); setTimeout(setHH, 350);
  initChrome(); initModal(); initCards(); initCart(); initInlineForms(); initFabHide(); initDelivery();
  renderStrip(); renderCats(); renderRail(); renderBrands(); renderCatalog(); renderProduct(); renderReviews();
  initAcc(); revealInit(); initSmooth();

  // прибираємо позначку завантаження: далі все вже на місці
  requestAnimationFrame(() => document.documentElement.classList.remove('booting'));
  if (back) restoreScroll();
})();

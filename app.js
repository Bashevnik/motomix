/* ============ MOTOMIX — app (multi-page) ============ */
const ORDER_ENDPOINT = ''; // Vercel /api/order — порожньо = демо-режим

/* ---------------- DATA ---------------- */
const CATEGORIES = [
  { name: 'Ендуро',     meta: 'від 250 см³',      img: 'assets/products/enduro.jpg' },
  { name: 'Пітбайки',   meta: 'старт і спорт',    img: 'assets/products/pitbike.jpg' },
  { name: 'Мотоцикли',  meta: 'місто · траса',    img: 'assets/hero/moto-dark.jpg' },
  { name: 'Скутери',    meta: 'щоденні поїздки',  img: 'assets/products/scooter.jpg' },
  { name: 'Екіпіровка', meta: 'шоломи · захист',  img: 'assets/products/helmet.jpg' },
];

const PRODUCTS = [
  { id:'geon-gns-300', name:'GEON GNS 300', brand:'GEON', cat:'Ендуро', badge:'Хіт', img:'assets/ig/post-1.jpg',
    gallery:['assets/ig/post-1.jpg','assets/hero/story-2.jpg','assets/products/enduro.jpg','assets/hero/forest-ride.jpg'],
    spec:['300 см³','4-такт','з документами'],
    desc:'Повнорозмірне ендуро для тих, хто вже впевнено тримається в сідлі. Рідинне охолодження тримає температуру на довгих підйомах, 6-ступенева КПП дає запас і для лісу, і для траси. Йде з повним пакетом документів — одразу ставиш на облік.',
    specs:{ 'Двигун':'1-циліндровий, 4-такт', "Об'єм":'300 см³', 'Охолодження':'рідинне', 'КПП':'6 ступенів',
            'Колеса':'21" / 18"', 'Гальма':'дискові', 'Документи':'повний пакет', 'Призначення':'ендуро / оффроуд' },
    kit:['Передпродажна підготовка','Пакет документів для реєстрації','Базовий набір інструменту','Гарантійний талон'] },

  { id:'kayo-t4-300', name:'KAYO T4 300', brand:'KAYO', cat:'Ендуро', badge:'', img:'assets/ig/post-3.jpg',
    gallery:['assets/ig/post-3.jpg','assets/hero/story-2.jpg','assets/products/enduro.jpg'],
    spec:['300 см³','баланс-вал','оффроуд'],
    desc:'Ендуро з балансувальним валом — менше вібрації на довгих перегонах, менше втоми в руках. Міцна рама та довгоходова підвіска тримають удар на складному ґрунті.',
    specs:{ 'Двигун':'1-циліндровий, 4-такт', "Об'єм":'300 см³', 'Особливість':'балансувальний вал',
            'КПП':'6 ступенів', 'Колеса':'21" / 18"', 'Гальма':'дискові', 'Призначення':'ендуро' },
    kit:['Передпродажна підготовка','Гарантійний талон','Консультація з обслуговування'] },

  { id:'kovi-pr50', name:'KOVI PR50', brand:'KOVI', cat:'Пітбайки', badge:'Новинка', img:'assets/ig/post-2.jpg',
    gallery:['assets/ig/post-2.jpg','assets/products/pitbike.jpg'],
    spec:['пітбайк','для старту','легкий'],
    desc:'Легкий пітбайк для першого досвіду та тренувань на треку. Невелика вага і проста механіка прощають помилки — ідеально, щоб поставити техніку їзди.',
    specs:{ 'Тип':'пітбайк', 'Охолодження':'повітряне', 'КПП':'механічна', 'Колеса':'14" / 12"',
            'Гальма':'дискові', 'Призначення':'навчання, трек' },
    kit:['Передпродажна підготовка','Інструмент','Гарантійний талон'] },

  { id:'shineray-xy250', name:'Shineray XY 250GY', brand:'SHINERAY', cat:'Ендуро', badge:'Під замовлення', img:'assets/products/enduro.jpg',
    gallery:['assets/products/enduro.jpg','assets/hero/forest-ride.jpg'],
    spec:['250 см³','ендуро','під замовлення'],
    desc:'Універсальне ендуро 250 для щоденних виїздів і подорожей. Повітряне охолодження — простіше в обслуговуванні, менше витрат у сервісі.',
    specs:{ 'Двигун':'1-циліндровий, 4-такт', "Об'єм":'250 см³', 'Охолодження':'повітряне',
            'КПП':'5 ступенів', 'Колеса':'21" / 18"', 'Призначення':'ендуро / туризм' },
    kit:['Передпродажна підготовка','Пакет документів','Гарантія'] },

  { id:'musstang-region-250', name:'Musstang Region 250', brand:'MUSSTANG', cat:'Мотоцикли', badge:'', img:'assets/hero/moto-dark.jpg',
    gallery:['assets/hero/moto-dark.jpg','assets/hero/story-1.jpg'],
    spec:['250 см³','дорожній','надійний'],
    desc:'Дорожній мотоцикл для міста і траси. Невибагливий до пального, зрозумілий у ремонті, з доступними запчастинами.',
    specs:{ 'Двигун':'1-циліндровий, 4-такт', "Об'єм":'250 см³', 'КПП':'5 ступенів',
            'Колеса':'18" / 17"', 'Гальма':'диск / барабан', 'Призначення':'місто + траса' },
    kit:['Передпродажна підготовка','Пакет документів','Гарантія'] },

  { id:'kovi-125', name:'Пітбайк KOVI 125', brand:'KOVI', cat:'Пітбайки', badge:'', img:'assets/products/pitbike.jpg',
    gallery:['assets/products/pitbike.jpg','assets/ig/post-2.jpg'],
    spec:['125 см³','повітр. охол.','для старту'],
    desc:'Класичний пітбайк 125 — найпопулярніший старт у мото. Достатньо тяги для треку, але без надлишку, який лякає новачка.',
    specs:{ "Об'єм":'125 см³', 'Охолодження':'повітряне', 'КПП':'механічна, 4 ст.',
            'Колеса':'14" / 12"', 'Призначення':'старт, трек' },
    kit:['Передпродажна підготовка','Інструмент','Гарантія'] },

  { id:'yadea-scooter', name:'Скутер Yadea', brand:'YADEA', cat:'Скутери', badge:'', img:'assets/products/scooter.jpg',
    gallery:['assets/products/scooter.jpg'],
    spec:['місто','економний','щоденний'],
    desc:'Скутер для щоденних поїздок по місту. Варіатор — рушив і поїхав, без перемикань. Економний і простий в обслуговуванні.',
    specs:{ 'Тип':'скутер', 'КПП':'варіатор', 'Колеса':'12"', 'Гальма':'диск / барабан', 'Призначення':'місто' },
    kit:['Передпродажна підготовка','Гарантія'] },

  { id:'helmet-set', name:'Шолом + екіпіровка', brand:'MOTO', cat:'Екіпіровка', badge:'', img:'assets/products/helmet.jpg',
    gallery:['assets/products/helmet.jpg'],
    spec:['шолом','захист','комплект'],
    desc:'Базовий комплект захисту: шолом, рукавички та захист корпусу. Підбираємо за розміром — міряти обовʼязково.',
    specs:{ 'Склад':'шолом, рукавички, захист', 'Розміри':'S–XXL', 'Призначення':'ендуро / крос' },
    kit:['Підбір розміру','Консультація'] },

  { id:'geon-trail', name:'GEON Trail Edition', brand:'GEON', cat:'Ендуро', badge:'', img:'assets/hero/forest-ride.jpg',
    gallery:['assets/hero/forest-ride.jpg','assets/hero/story-2.jpg'],
    spec:['ендуро','оффроуд','тест-драйв'],
    desc:'Версія для лісових маршрутів: довгоходова підвіска та захист картера. Для тих, хто їздить там, де закінчується асфальт.',
    specs:{ 'Тип':'ендуро', 'Призначення':'лісові маршрути', 'Підвіска':'довгоходова' },
    kit:['Передпродажна підготовка','Гарантія'] },

  { id:'lifan-road', name:'LIFAN дорожній', brand:'LIFAN', cat:'Мотоцикли', badge:'', img:'assets/hero/rider.jpg',
    gallery:['assets/hero/rider.jpg','assets/hero/story-1.jpg'],
    spec:['місто+траса','надійний','сервіс'],
    desc:'Надійний дорожній мотоцикл із доступним сервісом. Варіант для щоденних поїздок без зайвих витрат.',
    specs:{ 'Тип':'дорожній', 'КПП':'5 ступенів', 'Призначення':'щоденні поїздки' },
    kit:['Передпродажна підготовка','Пакет документів','Гарантія'] },

  { id:'kayo-cross', name:'KAYO Cross', brand:'KAYO', cat:'Пітбайки', badge:'', img:'assets/hero/story-2.jpg',
    gallery:['assets/hero/story-2.jpg','assets/products/pitbike.jpg'],
    spec:['крос','спорт','трек'],
    desc:'Кросовий апарат для треку і змагань. Спортивна підвіска та агресивна геометрія — не для спокійних прогулянок.',
    specs:{ 'Тип':'кросовий', 'Призначення':'трек, змагання', 'Підвіска':'спортивна' },
    kit:['Передпродажна підготовка','Консультація'] },

  { id:'enduro-sport', name:'Ендуро Sport 250', brand:'BSE', cat:'Ендуро', badge:'', img:'assets/hero/enduro-action.jpg',
    gallery:['assets/hero/enduro-action.jpg','assets/products/enduro.jpg'],
    spec:['250 см³','спорт','легкий'],
    desc:'Легке спортивне ендуро 250. Мала вага дає керованість на вузьких стежках і менше втоми за кермом.',
    specs:{ "Об'єм":'250 см³', 'Тип':'ендуро-спорт', 'Призначення':'оффроуд' },
    kit:['Передпродажна підготовка','Гарантія'] },
];

const BRANDS = ['GEON','KOVI','KAYO','SHINERAY','MUSSTANG','SPARK','LIFAN','BAJAJ','FORTE','LONCIN',
  'YADEA','LINHAI','MIKILON','BENELLI','FADA','BSE','CFMOTO','RENEGADE'];

/* ЗАГЛУШКА: приклади відгуків — замінити на реальні від клієнта */
const REVIEWS = [
  { n:'Андрій', c:'Біла Церква', t:'Брав ендуро — підібрали під мій зріст, не нав\'язували дорожче. Підготували, пояснили по обслуговуванню. Катаю другий сезон, питань нема.' },
  { n:'Олег', c:'Київ', t:'Привезли в Київ без передоплати, як і домовлялись. Документи всі на місці, поставив на облік без проблем.' },
  { n:'Віталій', c:'Фастів', t:'Здав старий мопед по Trade-in, доплатив різницю. Оцінили нормально, без заниження. Рекомендую.' },
];

/* ---------------- helpers ---------------- */
const el = (h) => { const t = document.createElement('template'); t.innerHTML = h.trim(); return t.content.firstChild; };
const ico = (id) => `<svg class="icon"><use href="#${id}"></use></svg>`;
const qs = (k) => new URLSearchParams(location.search).get(k);

const pcardHtml = (p) => `
  <article class="pcard rv">
    <div class="pcard__media">
      ${p.badge ? `<span class="pcard__badge">${p.badge}</span>` : ''}
      <img src="${p.img}" alt="${p.name}" loading="lazy">
      <span class="pcard__brand">${p.brand}</span>
    </div>
    <div class="pcard__body">
      <h3 class="pcard__name">${p.name}</h3>
      <div class="pcard__spec">${p.spec.map(s => `<span>${s}</span>`).join('')}</div>
      <div class="pcard__foot">
        <div class="pcard__price">Ціна за запитом<small>уточнюйте наявність</small></div>
        <a class="tlink" href="product.html?id=${p.id}">Деталі ${ico('ic-arrow')}</a>
      </div>
    </div>
  </article>`;

/* ---------------- renders ---------------- */
function renderCats() {
  const box = document.getElementById('cats'); if (!box) return;
  CATEGORIES.forEach((c, i) => box.appendChild(el(`
    <a class="cat rv" href="catalog.html?cat=${encodeURIComponent(c.name)}">
      <img src="${c.img}" alt="${c.name}" loading="lazy">
      <span class="cat__n num-out">0${i + 1}</span>
      <div class="cat__body">
        <div class="cat__bar"></div>
        <div class="cat__name">${c.name}</div>
        <div class="cat__meta">${c.meta}</div>
      </div>
    </a>`)));
}

function renderBrands() {
  const box = document.getElementById('brands-track'); if (!box) return;
  const track = el(`<div class="marquee__track"></div>`);
  [...BRANDS, ...BRANDS].forEach(b => track.appendChild(el(`<div class="bchip">${b}</div>`)));
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

/* --- product rail: autoscroll 1 card / 3s, arrows sit on the rail --- */
function renderRail() {
  const track = document.getElementById('rail-track'); if (!track) return;
  PRODUCTS.slice(0, 8).forEach(p => track.appendChild(el(pcardHtml(p))));
  const view = track.parentElement, bar = document.querySelector('#rail-bar i');
  let idx = 0;
  const step = () => {
    const card = track.children[0]; if (!card) return 1;
    return card.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).gap) || 16);
  };
  const maxIdx = () => Math.max(0, track.children.length - Math.floor(view.clientWidth / step()));
  const go = (i) => {
    idx = Math.max(0, Math.min(i, maxIdx()));
    track.style.transform = `translateX(${-idx * step()}px)`;
    if (bar) bar.style.width = `${((idx + 1) / (maxIdx() + 1)) * 100}%`;
  };
  let timer = null;
  const tick = () => go(idx >= maxIdx() ? 0 : idx + 1);
  const restart = () => { clearInterval(timer); timer = setInterval(tick, 3000); };
  document.getElementById('rail-prev')?.addEventListener('click', () => { go(idx - 1); restart(); });
  document.getElementById('rail-next')?.addEventListener('click', () => { go(idx + 1); restart(); });
  view.addEventListener('mouseenter', () => clearInterval(timer));
  view.addEventListener('mouseleave', restart);
  window.addEventListener('resize', () => go(idx));
  go(0); restart();
}

/* --- catalog: sticky sidebar filters + grid --- */
function renderCatalog() {
  const grid = document.getElementById('catalog-grid'); if (!grid) return;
  const catBox = document.getElementById('f-cats'), brandBox = document.getElementById('f-brands');
  const countEl = document.getElementById('f-count'), sortSel = document.getElementById('f-sort');
  const cats = ['Усі', ...CATEGORIES.map(c => c.name)];
  const brandsUsed = ['Усі', ...[...new Set(PRODUCTS.map(p => p.brand))]];
  const q = (qs('q') || '').toLowerCase();
  let aCat = cats.includes(qs('cat')) ? qs('cat') : 'Усі', aBrand = 'Усі', sort = 'default';

  const match = (p) => (aCat === 'Усі' || p.cat === aCat) && (aBrand === 'Усі' || p.brand === aBrand)
    && (!q || (p.name + ' ' + p.brand + ' ' + p.cat + ' ' + p.spec.join(' ')).toLowerCase().includes(q));
  const countFor = (type, v) => PRODUCTS.filter(p => {
    if (type === 'cat') return (v === 'Усі' || p.cat === v) && (aBrand === 'Усі' || p.brand === aBrand);
    return (v === 'Усі' || p.brand === v) && (aCat === 'Усі' || p.cat === aCat);
  }).length;

  const draw = () => {
    let list = PRODUCTS.filter(match);
    if (sort === 'az') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'za') list = [...list].sort((a, b) => b.name.localeCompare(a.name));
    grid.innerHTML = '';
    if (!list.length) grid.appendChild(el(`<div class="empty"><b>Нічого не знайшли</b><p>Спробуй змінити фільтри або залиш заявку — підберемо під запит.</p></div>`));
    else list.forEach(p => grid.appendChild(el(pcardHtml(p))));
    if (countEl) countEl.textContent = `Знайдено: ${list.length}`;
    lists(); revealInit();
  };
  const lists = () => {
    const build = (box, arr, type, get, set) => {
      if (!box) return;
      box.innerHTML = '';
      arr.forEach(v => {
        const b = el(`<button class="${get() === v ? 'active' : ''}">${v}<i>${countFor(type, v)}</i></button>`);
        b.addEventListener('click', () => { set(v); draw(); });
        box.appendChild(b);
      });
    };
    build(catBox, cats, 'cat', () => aCat, v => aCat = v);
    build(brandBox, brandsUsed, 'brand', () => aBrand, v => aBrand = v);
  };
  sortSel?.addEventListener('change', e => { sort = e.target.value; draw(); });
  document.getElementById('f-reset')?.addEventListener('click', () => { aCat = 'Усі'; aBrand = 'Усі'; draw(); });
  document.getElementById('f-toggle')?.addEventListener('click', () => document.getElementById('fside')?.classList.toggle('open'));
  draw();
}

/* --- product page: swipe gallery + accordions + reviews --- */
function renderProduct() {
  const root = document.getElementById('pdp'); if (!root) return;
  const p = PRODUCTS.find(x => x.id === qs('id')) || PRODUCTS[0];
  document.title = `${p.name} — MOTOMIX`;
  const c = document.getElementById('pdp-crumb'); if (c) c.textContent = p.name;
  const h = document.getElementById('pdp-h1'); if (h) h.textContent = p.name;
  const gal = (p.gallery && p.gallery.length) ? p.gallery : [p.img];

  root.innerHTML = `
    <div class="gallery">
      <div class="gallery__main" id="galMain">
        <div class="gallery__strip" id="galStrip">${gal.map(g => `<img src="${g}" alt="${p.name}" draggable="false">`).join('')}</div>
        ${gal.length > 1 ? `<button class="gallery__nav gallery__nav--p" id="galPrev" aria-label="Попереднє">${ico('ic-arrow-l')}</button>
        <button class="gallery__nav gallery__nav--n" id="galNext" aria-label="Наступне">${ico('ic-arrow')}</button>` : ''}
      </div>
      ${gal.length > 1 ? `<div class="gallery__thumbs" id="galThumbs">${gal.map((g, i) => `<button class="${i ? '' : 'active'}" data-i="${i}"><img src="${g}" alt=""></button>`).join('')}</div>` : ''}
    </div>
    <div class="pdp__info">
      <span class="eyebrow"><span class="slashes"><i></i><i></i><i></i></span> ${p.brand} · ${p.cat}</span>
      <h2 class="pdp__title">${p.name}</h2>
      <div class="pdp__price"><b>Ціна за запитом</b><span>уточнюйте наявність і умови</span></div>
      <div class="pdp__actions">
        <button class="btn btn--red btn--lg" data-order="${p.name}">Замовити</button>
        <a class="btn btn--line btn--lg" href="tel:+380938701107">${ico('ic-phone')} Подзвонити</a>
      </div>
      <div class="acc">
        <div class="acc__i open"><button class="acc__q">Характеристики ${ico('ic-plus')}</button>
          <div class="acc__a"><div><table class="spec-table">${Object.entries(p.specs || {}).map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table></div></div></div>
        <div class="acc__i"><button class="acc__q">Опис ${ico('ic-plus')}</button>
          <div class="acc__a"><div><p>${p.desc || ''}</p></div></div></div>
        <div class="acc__i"><button class="acc__q">Комплектація ${ico('ic-plus')}</button>
          <div class="acc__a"><div><ul>${(p.kit || []).map(k => `<li>${k}</li>`).join('')}</ul></div></div></div>
        <div class="acc__i"><button class="acc__q">Доставка та оплата ${ico('ic-plus')}</button>
          <div class="acc__a"><div><ul>
            <li>Доставка по всій Україні, без передоплати</li>
            <li>Самовивіз у Білій Церкві</li>
            <li>Готівка, картка, безготівковий розрахунок</li>
            <li>Повний пакет документів для реєстрації</li></ul></div></div></div>
      </div>
      <div class="trust">
        <div>${ico('ic-shield')}<b>Гарантія</b><span>офіційний бренд</span></div>
        <div>${ico('ic-truck')}<b>Доставка</b><span>по всій Україні</span></div>
        <div>${ico('ic-wrench')}<b>Сервіс</b><span>після покупки</span></div>
      </div>
    </div>`;

  initGallery(gal.length);
  initAcc();
  const rel = document.getElementById('related');
  if (rel) PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4).forEach(x => rel.appendChild(el(pcardHtml(x))));
  const rev = document.getElementById('reviews');
  if (rev) REVIEWS.forEach(r => rev.appendChild(el(`
    <div class="rev rv">
      <div class="rev__top">
        <div class="rev__av">${r.n[0]}</div>
        <div class="rev__who"><b>${r.n}</b><span>${r.c}</span></div>
      </div>
      <div class="rev__stars">${Array(5).fill(ico('ic-star')).join('')}</div>
      <p>${r.t}</p>
    </div>`)));
}

/* --- swipeable gallery (drag + arrows + thumbs) --- */
function initGallery(total) {
  const main = document.getElementById('galMain'), strip = document.getElementById('galStrip');
  if (!main || !strip || total < 1) return;
  let i = 0, startX = 0, dx = 0, dragging = false;
  const w = () => main.clientWidth;
  const go = (n) => {
    i = Math.max(0, Math.min(n, total - 1));
    strip.style.transition = '.6s cubic-bezier(.19,1,.22,1)';
    strip.style.transform = `translateX(${-i * w()}px)`;
    document.querySelectorAll('#galThumbs button').forEach((b, k) => b.classList.toggle('active', k === i));
  };
  document.getElementById('galPrev')?.addEventListener('click', () => go(i - 1));
  document.getElementById('galNext')?.addEventListener('click', () => go(i + 1));
  document.querySelectorAll('#galThumbs button').forEach(b => b.addEventListener('click', () => go(+b.dataset.i)));
  const down = (x) => { dragging = true; startX = x; dx = 0; main.classList.add('drag'); strip.style.transition = 'none'; };
  const move = (x) => { if (!dragging) return; dx = x - startX; strip.style.transform = `translateX(${-i * w() + dx}px)`; };
  const up = () => { if (!dragging) return; dragging = false; main.classList.remove('drag');
    if (Math.abs(dx) > w() * 0.18) go(dx < 0 ? i + 1 : i - 1); else go(i); };
  main.addEventListener('pointerdown', e => down(e.clientX));
  main.addEventListener('pointermove', e => move(e.clientX));
  main.addEventListener('pointerup', up); main.addEventListener('pointerleave', up);
  window.addEventListener('resize', () => go(i));
  go(0);
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

/* ---------------- chrome ---------------- */
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
  const s = document.getElementById('siteSearch');
  s?.closest('form')?.addEventListener('submit', () => {
    const v = s.value.trim(); if (v) location.href = `catalog.html?q=${encodeURIComponent(v)}`;
  });
}

function revealInit() {
  const io = new IntersectionObserver((e) => e.forEach(x => {
    if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); }
  }), { threshold: 0.1, rootMargin: '0px 0px -60px' });
  document.querySelectorAll('.rv:not(.in)').forEach((n, i) => { n.style.transitionDelay = `${(i % 5) * 70}ms`; io.observe(n); });
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
    const text = `🏍️ <b>Нова заявка MOTOMIX</b>\nТема: ${fd.get('subject')}\nІм'я: ${fd.get('name')}\nТелефон: ${fd.get('phone')}\n`
      + (fd.get('comment') ? `Коментар: ${fd.get('comment')}\n` : '');
    note.textContent = 'Відправляємо…'; note.className = 'form__note';
    try {
      if (!ORDER_ENDPOINT) { console.log('[DEMO ORDER]\n' + text); await new Promise(r => setTimeout(r, 450)); }
      else { const r = await fetch(ORDER_ENDPOINT, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ text }) }); if (!r.ok) throw 0; }
      note.textContent = '✅ Дякуємо! Зв\'яжемось найближчим часом.'; note.className = 'form__note ok';
      e.target.reset(); setTimeout(close, 2000);
    } catch { note.textContent = '⚠️ Не вдалось відправити. Подзвоніть: +38 093 870 11 07'; note.className = 'form__note err'; }
  });
}

function initSmooth() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js';
  s.onload = () => {
    try {
      const lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
      lenis.scrollTo(0, { immediate: true });
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    } catch {}
  };
  document.head.appendChild(s);
}

/* ---------------- boot ---------------- */
(async function boot() {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
  await Promise.all([...document.querySelectorAll('[data-include]')].map(async n => {
    try { n.innerHTML = await (await fetch(n.getAttribute('data-include'))).text(); } catch {}
  }));
  initChrome(); initModal();
  renderStrip(); renderCats(); renderRail(); renderBrands(); renderCatalog(); renderProduct();
  initAcc(); revealInit(); initSmooth();
})();

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
    specs:{ 'Двигун':'1-циліндровий, 4-такт', 'Об\'єм':'300 см³', 'Охолодження':'рідинне', 'КПП':'6 ступенів',
            'Колеса':'21" / 18"', 'Гальма':'дискові', 'Документи':'повний пакет', 'Призначення':'ендуро / оффроуд' },
    kit:['Передпродажна підготовка','Пакет документів для реєстрації','Базовий набір інструменту','Гарантійний талон'] },

  { id:'kayo-t4-300', name:'KAYO T4 300', brand:'KAYO', cat:'Ендуро', badge:'', img:'assets/ig/post-3.jpg',
    gallery:['assets/ig/post-3.jpg','assets/hero/story-2.jpg','assets/products/enduro.jpg'],
    spec:['300 см³','баланс-вал','оффроуд'],
    specs:{ 'Двигун':'1-циліндровий, 4-такт', 'Об\'єм':'300 см³', 'Особливість':'балансувальний вал',
            'КПП':'6 ступенів', 'Колеса':'21" / 18"', 'Гальма':'дискові', 'Призначення':'ендуро' },
    kit:['Передпродажна підготовка','Гарантійний талон','Консультація з обслуговування'] },

  { id:'kovi-pr50', name:'KOVI PR50', brand:'KOVI', cat:'Пітбайки', badge:'Новинка', img:'assets/ig/post-2.jpg',
    gallery:['assets/ig/post-2.jpg','assets/products/pitbike.jpg'],
    spec:['пітбайк','для старту','легкий'],
    specs:{ 'Тип':'пітбайк', 'Охолодження':'повітряне', 'КПП':'механічна', 'Колеса':'14" / 12"',
            'Гальма':'дискові', 'Призначення':'навчання, трек' },
    kit:['Передпродажна підготовка','Інструмент','Гарантійний талон'] },

  { id:'shineray-xy250', name:'Shineray XY 250GY', brand:'SHINERAY', cat:'Ендуро', badge:'Під замовлення', img:'assets/products/enduro.jpg',
    gallery:['assets/products/enduro.jpg','assets/hero/forest-ride.jpg'],
    spec:['250 см³','ендуро','під замовлення'],
    specs:{ 'Двигун':'1-циліндровий, 4-такт', 'Об\'єм':'250 см³', 'Охолодження':'повітряне',
            'КПП':'5 ступенів', 'Колеса':'21" / 18"', 'Призначення':'ендуро / туризм' },
    kit:['Передпродажна підготовка','Пакет документів','Гарантія'] },

  { id:'musstang-region-250', name:'Musstang Region 250', brand:'MUSSTANG', cat:'Мотоцикли', badge:'', img:'assets/hero/moto-dark.jpg',
    gallery:['assets/hero/moto-dark.jpg','assets/hero/story-1.jpg'],
    spec:['250 см³','дорожній','надійний'],
    specs:{ 'Двигун':'1-циліндровий, 4-такт', 'Об\'єм':'250 см³', 'КПП':'5 ступенів',
            'Колеса':'18" / 17"', 'Гальма':'диск / барабан', 'Призначення':'місто + траса' },
    kit:['Передпродажна підготовка','Пакет документів','Гарантія'] },

  { id:'kovi-125', name:'Пітбайк KOVI 125', brand:'KOVI', cat:'Пітбайки', badge:'', img:'assets/products/pitbike.jpg',
    gallery:['assets/products/pitbike.jpg','assets/ig/post-2.jpg'],
    spec:['125 см³','повітр. охол.','для старту'],
    specs:{ 'Об\'єм':'125 см³', 'Охолодження':'повітряне', 'КПП':'механічна, 4 ст.',
            'Колеса':'14" / 12"', 'Призначення':'старт, трек' },
    kit:['Передпродажна підготовка','Інструмент','Гарантія'] },

  { id:'yadea-scooter', name:'Скутер Yadea', brand:'YADEA', cat:'Скутери', badge:'', img:'assets/products/scooter.jpg',
    gallery:['assets/products/scooter.jpg'],
    spec:['місто','економний','щоденний'],
    specs:{ 'Тип':'скутер', 'КПП':'варіатор', 'Колеса':'12"', 'Гальма':'диск / барабан', 'Призначення':'місто' },
    kit:['Передпродажна підготовка','Гарантія'] },

  { id:'helmet-set', name:'Шолом + екіпіровка', brand:'MOTO', cat:'Екіпіровка', badge:'', img:'assets/products/helmet.jpg',
    gallery:['assets/products/helmet.jpg'],
    spec:['шолом','захист','комплект'],
    specs:{ 'Склад':'шолом, рукавички, захист', 'Розміри':'S–XXL', 'Призначення':'ендуро / крос' },
    kit:['Підбір розміру','Консультація'] },

  { id:'geon-trail', name:'GEON Trail Edition', brand:'GEON', cat:'Ендуро', badge:'', img:'assets/hero/forest-ride.jpg',
    gallery:['assets/hero/forest-ride.jpg','assets/hero/story-2.jpg'],
    spec:['ендуро','оффроуд','тест-драйв'],
    specs:{ 'Тип':'ендуро', 'Призначення':'лісові маршрути', 'Підвіска':'довгоходова' },
    kit:['Передпродажна підготовка','Гарантія'] },

  { id:'lifan-road', name:'LIFAN дорожній', brand:'LIFAN', cat:'Мотоцикли', badge:'', img:'assets/hero/rider.jpg',
    gallery:['assets/hero/rider.jpg','assets/hero/story-1.jpg'],
    spec:['місто+траса','надійний','сервіс'],
    specs:{ 'Тип':'дорожній', 'КПП':'5 ступенів', 'Призначення':'щоденні поїздки' },
    kit:['Передпродажна підготовка','Пакет документів','Гарантія'] },

  { id:'kayo-cross', name:'KAYO Cross', brand:'KAYO', cat:'Пітбайки', badge:'', img:'assets/hero/story-2.jpg',
    gallery:['assets/hero/story-2.jpg','assets/products/pitbike.jpg'],
    spec:['крос','спорт','трек'],
    specs:{ 'Тип':'кросовий', 'Призначення':'трек, змагання', 'Підвіска':'спортивна' },
    kit:['Передпродажна підготовка','Консультація'] },

  { id:'enduro-sport', name:'Ендуро Sport 250', brand:'BSE', cat:'Ендуро', badge:'', img:'assets/hero/enduro-action.jpg',
    gallery:['assets/hero/enduro-action.jpg','assets/products/enduro.jpg'],
    spec:['250 см³','спорт','легкий'],
    specs:{ 'Об\'єм':'250 см³', 'Тип':'ендуро-спорт', 'Призначення':'оффроуд' },
    kit:['Передпродажна підготовка','Гарантія'] },
];

const BRANDS = ['GEON','KOVI','KAYO','SHINERAY','MUSSTANG','SPARK','LIFAN','BAJAJ','FORTE','LONCIN',
  'YADEA','LINHAI','MIKILON','BENELLI','FADA','BSE','CFMOTO','RENEGADE'];

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
    ['ic-truck', 'Доставка по Україні'], ['ic-shield', 'Офіційні бренди'],
    ['ic-swap', 'Trade-in'], ['ic-wrench', 'Сервіс і запчастини'],
    ['ic-support', 'Жива консультація'], ['ic-doc', 'Повний пакет документів'],
  ];
  const track = el(`<div class="strip__track"></div>`);
  [...items, ...items].forEach(([i, t]) => track.appendChild(el(`<div class="strip__item">${ico(i)}${t}</div>`)));
  box.appendChild(track);
}

/* --- product rail: horizontal carousel, autoscroll 1 card / 3s --- */
function renderRail() {
  const track = document.getElementById('rail-track'); if (!track) return;
  PRODUCTS.slice(0, 8).forEach(p => track.appendChild(el(pcardHtml(p))));
  const view = track.parentElement;
  const bar = document.querySelector('#rail-bar i');
  let idx = 0;
  const step = () => {
    const card = track.children[0]; if (!card) return 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 16;
    return card.getBoundingClientRect().width + gap;
  };
  const maxIdx = () => Math.max(0, track.children.length - Math.floor(view.clientWidth / step()));
  const go = (i) => {
    idx = Math.max(0, Math.min(i, maxIdx()));
    track.style.transform = `translateX(${-idx * step()}px)`;
    if (bar) bar.style.width = `${((idx + 1) / (maxIdx() + 1)) * 100}%`;
  };
  document.getElementById('rail-prev')?.addEventListener('click', () => { go(idx - 1); restart(); });
  document.getElementById('rail-next')?.addEventListener('click', () => { go(idx + 1); restart(); });
  let timer = null;
  const tick = () => go(idx >= maxIdx() ? 0 : idx + 1);
  const restart = () => { clearInterval(timer); timer = setInterval(tick, 3000); }; // правило: автосвайп 3 с
  view.addEventListener('mouseenter', () => clearInterval(timer));
  view.addEventListener('mouseleave', restart);
  window.addEventListener('resize', () => go(idx));
  go(0); restart();
}

/* --- catalog with filters --- */
function renderCatalog() {
  const grid = document.getElementById('catalog-grid'); if (!grid) return;
  const catBox = document.getElementById('f-cats'), brandBox = document.getElementById('f-brands');
  const countEl = document.getElementById('f-count'), sortSel = document.getElementById('f-sort');
  const cats = ['Усі', ...CATEGORIES.map(c => c.name)];
  const brands = ['Усі', ...[...new Set(PRODUCTS.map(p => p.brand))]];
  let aCat = qs('cat') && cats.includes(qs('cat')) ? qs('cat') : 'Усі';
  let aBrand = 'Усі', sort = 'default';

  const draw = () => {
    let list = PRODUCTS.filter(p => (aCat === 'Усі' || p.cat === aCat) && (aBrand === 'Усі' || p.brand === aBrand));
    if (sort === 'az') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'za') list = [...list].sort((a, b) => b.name.localeCompare(a.name));
    grid.innerHTML = '';
    if (!list.length) {
      grid.appendChild(el(`<div class="empty"><b>Нічого не знайшли</b><p>Спробуй змінити фільтри або залиш заявку — підберемо під запит.</p></div>`));
    } else list.forEach(p => grid.appendChild(el(pcardHtml(p))));
    if (countEl) countEl.textContent = `Знайдено: ${list.length}`;
    revealInit();
  };
  const chips = (box, arr, get, set) => {
    box.innerHTML = '';
    arr.forEach(v => {
      const b = el(`<button class="chip${get() === v ? ' active' : ''}">${v}</button>`);
      b.addEventListener('click', () => { set(v); box.querySelectorAll('.chip').forEach(x => x.classList.toggle('active', x.textContent === v)); draw(); });
      box.appendChild(b);
    });
  };
  if (catBox) chips(catBox, cats, () => aCat, v => aCat = v);
  if (brandBox) chips(brandBox, brands, () => aBrand, v => aBrand = v);
  sortSel?.addEventListener('change', e => { sort = e.target.value; draw(); });
  draw();
}

/* --- product page --- */
function renderProduct() {
  const root = document.getElementById('pdp'); if (!root) return;
  const p = PRODUCTS.find(x => x.id === qs('id')) || PRODUCTS[0];
  document.title = `${p.name} — MOTOMIX`;
  const crumb = document.getElementById('pdp-crumb'); if (crumb) crumb.textContent = p.name;
  const h1 = document.getElementById('pdp-h1'); if (h1) h1.textContent = p.name;
  const gal = p.gallery && p.gallery.length ? p.gallery : [p.img];
  root.innerHTML = `
    <div>
      <div class="pdp__main"><img id="pdp-img" src="${gal[0]}" alt="${p.name}"></div>
      <div class="pdp__thumbs">${gal.map((g, i) => `<button class="${i ? '' : 'active'}" data-src="${g}"><img src="${g}" alt=""></button>`).join('')}</div>
    </div>
    <div class="pdp__info">
      <span class="eyebrow"><span class="slashes"><i></i><i></i><i></i></span> ${p.brand} · ${p.cat}</span>
      <h2 class="pdp__title">${p.name}</h2>
      <div class="pdp__price"><b>Ціна за запитом</b><span>уточнюйте наявність і умови</span></div>
      <div class="pdp__actions">
        <button class="btn btn--red btn--lg" data-order="${p.name}">Замовити</button>
        <a class="btn btn--line btn--lg" href="tel:+380938701107">${ico('ic-phone')} Подзвонити</a>
      </div>
      <table class="spec-table">${Object.entries(p.specs || {}).map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table>
      <h3 class="disp" style="color:#fff;font-size:1.3rem;margin-bottom:14px">У комплекті</h3>
      <ul class="story__list">${(p.kit || []).map(k => `<li>${k}</li>`).join('')}</ul>
      <div class="trust">
        <div>${ico('ic-shield')}<b>Гарантія</b><span>офіційний бренд</span></div>
        <div>${ico('ic-truck')}<b>Доставка</b><span>по всій Україні</span></div>
        <div>${ico('ic-wrench')}<b>Сервіс</b><span>після покупки</span></div>
      </div>
    </div>`;
  root.querySelectorAll('.pdp__thumbs button').forEach(b => b.addEventListener('click', () => {
    document.getElementById('pdp-img').src = b.dataset.src;
    root.querySelectorAll('.pdp__thumbs button').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
  }));
  const rel = document.getElementById('related');
  if (rel) PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4).forEach(x => rel.appendChild(el(pcardHtml(x))));
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

function initFaq() {
  document.querySelectorAll('.faq__q').forEach(q => q.addEventListener('click', () => {
    const item = q.closest('.faq__i'), a = item.querySelector('.faq__a'), open = item.classList.contains('open');
    document.querySelectorAll('.faq__i.open').forEach(i => { i.classList.remove('open'); i.querySelector('.faq__a').style.maxHeight = null; });
    if (!open) { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
  }));
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

/* --- Lenis smooth scroll --- */
function initSmooth() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js';
  s.onload = () => {
    try {
      const lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    } catch {}
  };
  document.head.appendChild(s);
}

/* ---------------- boot ---------------- */
(async function boot() {
  await Promise.all([...document.querySelectorAll('[data-include]')].map(async n => {
    try { n.innerHTML = await (await fetch(n.getAttribute('data-include'))).text(); } catch {}
  }));
  initChrome(); initModal(); initFaq();
  renderStrip(); renderCats(); renderRail(); renderBrands(); renderCatalog(); renderProduct();
  revealInit(); initSmooth();
})();

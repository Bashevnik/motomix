/* ============ MOTOMIX — shared app (multi-page) ============ */
const ORDER_ENDPOINT = ''; // Vercel /api/order — empty = demo mode until backend is wired

/* ---------- data ---------- */
const CATEGORIES = [
  { name: 'Ендуро', count: 'від 250 см³', img: 'assets/products/enduro.jpg' },
  { name: 'Пітбайки', count: 'для старту', img: 'assets/products/pitbike.jpg' },
  { name: 'Мотоцикли', count: 'дорожні · турінг', img: 'assets/hero/moto-dark.jpg' },
  { name: 'Скутери', count: 'місто щодня', img: 'assets/products/scooter.jpg' },
  { name: 'Екіпіровка', count: 'шоломи · захист', img: 'assets/products/helmet.jpg' },
];

const PRODUCTS = [
  { name: 'GEON GNS 300', brand: 'GEON', cat: 'Ендуро', badge: 'Хіт', img: 'assets/ig/post-1.jpg', spec: ['300 см³', '4-такт', 'з документами'] },
  { name: 'KAYO T4 300', brand: 'KAYO', cat: 'Ендуро', badge: '', img: 'assets/ig/post-3.jpg', spec: ['300 см³', 'баланс-вал', 'оффроуд'] },
  { name: 'KOVI PR50', brand: 'KOVI', cat: 'Пітбайки', badge: 'Новинка', img: 'assets/ig/post-2.jpg', spec: ['пітбайк', 'для старту', 'легкий'] },
  { name: 'Shineray XY 250GY', brand: 'SHINERAY', cat: 'Ендуро', badge: '', img: 'assets/products/enduro.jpg', spec: ['250 см³', 'ендуро', 'під замовлення'] },
  { name: 'Musstang Region 250', brand: 'MUSSTANG', cat: 'Мотоцикли', badge: '', img: 'assets/hero/moto-dark.jpg', spec: ['250 см³', 'дорожній', 'під замовлення'] },
  { name: 'Пітбайк KOVI 125', brand: 'KOVI', cat: 'Пітбайки', badge: '', img: 'assets/products/pitbike.jpg', spec: ['125 см³', 'повітр. охол.', 'для старту'] },
  { name: 'Скутер Yadea', brand: 'YADEA', cat: 'Скутери', badge: '', img: 'assets/products/scooter.jpg', spec: ['місто', 'економний', 'щоденний'] },
  { name: 'Шолом + екіпіровка', brand: 'MOTO', cat: 'Екіпіровка', badge: '', img: 'assets/products/helmet.jpg', spec: ['шолом', 'захист', 'комплект'] },
  { name: 'GEON ендуро в русі', brand: 'GEON', cat: 'Ендуро', badge: '', img: 'assets/hero/forest-ride.jpg', spec: ['ендуро', 'оффроуд', 'тест-драйв'] },
  { name: 'Мотоцикл дорожній', brand: 'LIFAN', cat: 'Мотоцикли', badge: '', img: 'assets/hero/rider.jpg', spec: ['місто+траса', 'надійний', 'під замовлення'] },
];

const BRANDS = ['SPARK','LIFAN','KAYO','BAJAJ','KOVI','FORTE','LONCIN','SHINERAY','YADEA',
  'MUSSTANG','LINHAI','MIKILON','BENELLI','FADA','BSE','CFMOTO','GEON','RENEGADE'];

/* ---------- helpers ---------- */
const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; };
const svg = (id) => `<svg class="icon"><use href="#${id}"></use></svg>`;
const pcardHtml = (p) => `
  <article class="pcard reveal">
    <div class="pcard__media">
      ${p.badge ? `<span class="pcard__badge">${p.badge}</span>` : ''}
      <span class="pcard__brand">${p.brand}</span>
      <img src="${p.img}" alt="${p.name}" loading="lazy">
    </div>
    <div class="pcard__body">
      <h3 class="pcard__name">${p.name}</h3>
      <div class="pcard__spec">${p.spec.map(s => `<span>${s}</span>`).join('')}</div>
      <div class="pcard__foot">
        <div class="pcard__price">Ціна за запитом<small>уточнюйте наявність</small></div>
        <button class="btn btn--red" data-order="${p.name}">Замовити</button>
      </div>
    </div>
  </article>`;

/* ---------- renders ---------- */
function renderCats() {
  const box = document.getElementById('cats'); if (!box) return;
  CATEGORIES.forEach(c => box.appendChild(el(`
    <a class="cat reveal" href="catalog.html?cat=${encodeURIComponent(c.name)}">
      <img src="${c.img}" alt="${c.name}" loading="lazy">
      <div class="cat__go">${svg('ic-arrow')}</div>
      <div class="cat__body"><div class="cat__name">${c.name}</div><div class="cat__count">${c.count}</div></div>
    </a>`)));
}
function renderProducts() {
  const box = document.getElementById('products'); if (!box) return;
  PRODUCTS.slice(0, 8).forEach(p => box.appendChild(el(pcardHtml(p))));
}
function renderBrands() {
  const box = document.getElementById('brands-track'); if (!box) return;
  const track = el(`<div class="marquee__track"></div>`);
  [...BRANDS, ...BRANDS].forEach(b => track.appendChild(el(`<div class="brandchip">${b}</div>`)));
  box.appendChild(track);
}
function renderCatalog() {
  const grid = document.getElementById('catalog-grid'); if (!grid) return;
  const chips = document.getElementById('catalog-filters');
  const cats = ['Усі', ...CATEGORIES.map(c => c.name)];
  const params = new URLSearchParams(location.search);
  let active = params.get('cat') || 'Усі';
  if (!cats.includes(active)) active = 'Усі';

  const draw = () => {
    grid.innerHTML = '';
    PRODUCTS.filter(p => active === 'Усі' || p.cat === active).forEach(p => grid.appendChild(el(pcardHtml(p))));
    initReveal();
  };
  chips.innerHTML = '';
  cats.forEach(c => {
    const b = el(`<button class="chip ${c === active ? 'active' : ''}">${c}</button>`);
    b.addEventListener('click', () => { active = c; chips.querySelectorAll('.chip').forEach(x => x.classList.toggle('active', x.textContent === c)); draw(); });
    chips.appendChild(b);
  });
  draw();
}

/* ---------- chrome ---------- */
function initChrome() {
  const header = document.getElementById('header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  }
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobileMenu');
  if (burger && menu) {
    burger.addEventListener('click', () => menu.classList.toggle('open'));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
  }
  // active nav
  const page = (location.pathname.split('/').pop() || 'index.html').replace('.html', '') || 'index';
  document.querySelectorAll('.nav a[data-nav]').forEach(a => { if (a.getAttribute('data-nav') === page) a.classList.add('active'); });
}

function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal:not(.in)').forEach(n => io.observe(n));
}

function initModal() {
  const modal = document.getElementById('orderModal'); if (!modal) return;
  const subEl = document.getElementById('modalSub');
  const subjectInput = document.getElementById('orderSubject');
  const note = document.getElementById('formNote');
  const open = (subject) => {
    subjectInput.value = subject || 'Заявка з сайту';
    subEl.textContent = subject && subject !== 'Загальна заявка'
      ? `Заявка: ${subject}. Залиш контакти — зв'яжемось найближчим часом.`
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
    const text = `🏍️ <b>Нова заявка MOTOMIX</b>\nТема: ${fd.get('subject')}\nІм'я: ${fd.get('name')}\nТелефон: ${fd.get('phone')}\n` + (fd.get('comment') ? `Коментар: ${fd.get('comment')}\n` : '');
    note.textContent = 'Відправляємо…'; note.className = 'form__note';
    try {
      if (!ORDER_ENDPOINT) { console.log('[DEMO ORDER]\n' + text); await new Promise(r => setTimeout(r, 500)); }
      else { const r = await fetch(ORDER_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) }); if (!r.ok) throw 0; }
      note.textContent = '✅ Дякуємо! Ми зв\'яжемось із вами найближчим часом.'; note.className = 'form__note ok';
      e.target.reset(); setTimeout(close, 2200);
    } catch { note.textContent = '⚠️ Не вдалось відправити. Подзвоніть: +38 093 870 11 07'; note.className = 'form__note err'; }
  });
}

/* ---------- includes loader (header/footer shared across pages) ---------- */
async function loadIncludes() {
  const nodes = [...document.querySelectorAll('[data-include]')];
  await Promise.all(nodes.map(async (n) => {
    try { n.innerHTML = await (await fetch(n.getAttribute('data-include'))).text(); } catch (e) { /* ignore */ }
  }));
}

(async function boot() {
  await loadIncludes();
  initChrome(); initModal();
  renderCats(); renderProducts(); renderBrands(); renderCatalog();
  initReveal();
})();

/* ============ MOTOMIX — app (multi-page) ============ */
const ORDER_ENDPOINT = 'https://motomix.vercel.app/api/order'; // прод-ендпоінт (працює і з дзеркала на GitHub Pages)

/* ---------------- DATA (з data.js, згенеровано з OLX) ---------------- */
const CATEGORIES = window.MM_CATEGORIES || [];
const PRODUCTS   = window.MM_PRODUCTS   || [];
const BRANDS     = window.MM_BRANDS     || [];

/* ЗАГЛУШКА: приклади відгуків — замінити на реальні від клієнта */
const REVIEWS = [
  { n:'Андрій', c:'Біла Церква', t:'Брав ендуро — підібрали під мій зріст, не нав\'язували дорожче. Підготували, пояснили по обслуговуванню. Катаю другий сезон, питань нема.' },
  { n:'Олег', c:'Київ', t:'Привезли в Київ без передоплати, як і домовлялись. Документи всі на місці, поставив на облік без проблем.' },
  { n:'Віталій', c:'Фастів', t:'Здав старий мопед по Trade-in, доплатив різницю. Оцінили нормально, без заниження. Рекомендую.' },
];

/* ---------------- helpers ---------------- */
const el = (h) => { const t = document.createElement('template'); t.innerHTML = h.trim(); return t.content.firstChild; };
const ico = (id) => `<svg class="icon"><use href="#${id}"></use></svg>`;
const priceText = (p) => p.priceRaw || "Ціна за запитом";
const stockOf = () => "В наявності";
const factsOf = (p) => {
  const f = [{ k: "Бренд", v: p.brand, href: "catalog.html?brand=" + encodeURIComponent(p.brand) }];
  if (p.cc) f.push({ k: "Обʼєм", v: p.cc + " см³", href: "catalog.html?cc=" + p.cc });
  f.push({ k: "Тип", v: p.cat, href: "catalog.html?cat=" + encodeURIComponent(p.cat) });
  return f;
};
const qs = (k) => new URLSearchParams(location.search).get(k);

const pcardHtml = (p) => `
  <article class="pcard rv" data-href="product.html?id=${p.id}" tabindex="0">
    <div class="pcard__media">
      ${p.badge ? `<span class="pcard__badge">${p.badge}</span>` : ""}
      <img src="${p.img}" alt="${p.name}" loading="lazy">
    </div>
    <div class="pcard__body">
      <h3 class="pcard__name">${p.name}</h3>
      <dl class="facts">${factsOf(p).map(f => `<div class="facts__r"><dt>${f.k}</dt><dd><a href="${f.href}">${f.v}</a></dd></div>`).join("")}</dl>
      <div class="pcard__foot">
        <div class="pcard__price">${priceText(p)}<small class="in">${stockOf(p)}</small></div>
        <span class="tlink">Деталі ${ico("ic-arrow")}</span>
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
  const grid = document.getElementById("catalog-grid"); if (!grid) return;
  const countEl = document.getElementById("f-count"), sortSel = document.getElementById("f-sort");
  const chipsBox = document.getElementById("f-chips");
  const ALL = "Усі";
  const groups = {
    cat:   { label: "Тип",        values: [ALL, ...CATEGORIES.map(c => c.name)] },
    brand: { label: "Бренд",      values: [ALL, ...[...new Set(PRODUCTS.map(p => p.brand))]] },
    cc:    { label: "Об’єм, см³", values: [ALL, ...[...new Set(PRODUCTS.map(p => p.cc).filter(Boolean))].sort((a,b)=>a-b)] },
  };
  const PRICE_RANGES = [["до 50 000",0,50000],["50 000 – 100 000",50000,100000],
    ["100 000 – 150 000",100000,150000],["від 150 000",150000,Infinity]];
  groups.price = { label: "Ціна, ₴", values: [ALL, ...PRICE_RANGES.map(r => r[0])] };
  const state = { cat: ALL, brand: ALL, cc: ALL, price: ALL };
  const q = (qs("q") || "").toLowerCase();
  if (groups.cat.values.includes(qs("cat"))) state.cat = qs("cat");
  if (qs("cc") && groups.cc.values.map(String).includes(qs("cc"))) state.cc = Number(qs("cc"));
  if (groups.brand.values.includes(qs("brand"))) state.brand = qs("brand");

  const inPrice = (p, label) => {
    if (label === ALL) return true;
    const r = PRICE_RANGES.find(x => x[0] === label); if (!r) return true;
    return typeof p.priceUah === "number" && p.priceUah >= r[1] && p.priceUah < r[2];
  };
  const fits = (p, st) => (st.cat === ALL || p.cat === st.cat) && (st.brand === ALL || p.brand === st.brand)
    && (st.cc === ALL || p.cc === st.cc) && inPrice(p, st.price);
  const match = (p) => fits(p, state)
    && (!q || (p.name + " " + p.brand + " " + p.cat + " " + p.spec.join(" ")).toLowerCase().includes(q));
  const countFor = (g, v) => PRODUCTS.filter(p => fits(p, { ...state, [g]: v })).length;

  const CATMETA = {
    "Мотоцикли":      { img: "assets/hero/story-2.jpg",     d: "Дорожні, ендуро та мотард від KOVI, LIFAN, GEON, KAYO, SHINERAY. Нові, з документами." },
    "Квадроцикли":    { img: "assets/hero/forest-ride.jpg", d: "Квадроцикли для дорослих і дітей: KAYO, SOK MOTO, QUADRATERRA. 125-300 см³, 4x4." },
    "Електроскутери": { img: "assets/hero/moto-dark.jpg",   d: "Електроскутери FADA — для міста, без пального." },
    "Аксесуари":      { img: "assets/products/helmet.jpg",  d: "Оптика, екіпіровка та аксесуари для мототехніки." },
  };
  const paintHead = () => {
    const h1 = document.getElementById("cat-h1"), desc = document.getElementById("cat-desc");
    const tail = document.getElementById("cat-crumb-tail"), img = document.getElementById("cat-img");
    const link = document.getElementById("cat-crumb-link");
    const c = state.cat;
    if (c === ALL) {
      if (h1) h1.textContent = "Каталог мототехніки";
      if (desc) desc.textContent = "Мотоцикли, квадроцикли, електроскутери та аксесуари — обери напрям або скористайся фільтром.";
      if (tail) tail.innerHTML = "";
      if (link) link.removeAttribute("href");
      document.title = "Каталог мототехніки — MOTOMIX";
    } else {
      if (h1) h1.textContent = c;
      if (desc) desc.textContent = (CATMETA[c] || {}).d || "";
      if (tail) tail.innerHTML = `<em>›</em><span>${c}</span>`;
      if (link) link.setAttribute("href", "catalog.html");
      if (img && CATMETA[c]) img.src = CATMETA[c].img;
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
      const box = document.querySelector(`.fdd[data-g="${g}"]`); if (!box) return;
      const btn = box.querySelector(".fdd__b"), panel = box.querySelector(".fdd__p");
      const sel = state[g];
      btn.innerHTML = `${sel === ALL ? cfg.label : sel}` + ico("ic-chev");
      btn.classList.toggle("on", sel !== ALL);
      panel.innerHTML = "";
      cfg.values.forEach(v => {
        const n = countFor(g, v);
        const o = el(`<button type="button" class="${state[g] === v ? "sel" : ""}" ${!n && v !== ALL ? "disabled" : ""}>${v}<i>${n}</i></button>`);
        o.addEventListener("click", () => { state[g] = v; box.classList.remove("open"); draw(); });
        panel.appendChild(o);
      });
    });
  };

  const paintChips = () => {
    if (!chipsBox) return;
    chipsBox.innerHTML = "";
    Object.entries(groups).forEach(([g, cfg]) => {
      if (state[g] === ALL) return;
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
    if (!was) box.classList.add("open");
  }));
  document.addEventListener("click", () => document.querySelectorAll(".fdd.open").forEach(x => x.classList.remove("open")));
  document.getElementById("f-reset")?.addEventListener("click", () => { state.cat = ALL; state.brand = ALL; state.cc = ALL; state.price = ALL; draw(); });
  sortSel?.addEventListener("change", draw);
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

  const shortDesc = (p.desc || "").slice(0, 300);
  const needMore = (p.desc || "").length > 320;
  root.innerHTML = `
    <div class="gallery-col">
      <div class="gallery">
        <div class="gallery__main" id="galMain">
          <div class="gallery__strip" id="galStrip">${gal.map(g => `<img src="${g}" alt="${p.name}" draggable="false">`).join("")}</div>
          ${gal.length > 1 ? `<button class="gallery__nav gallery__nav--p" id="galPrev" aria-label="Попереднє">${ico("ic-arrow-l")}</button>
          <button class="gallery__nav gallery__nav--n" id="galNext" aria-label="Наступне">${ico("ic-arrow")}</button>` : ""}
        </div>
        ${gal.length > 1 ? `<div class="gallery__thumbs" id="galThumbs">${gal.map((g, i) => `<button class="${i ? "" : "active"}" data-i="${i}"><img src="${g}" alt=""></button>`).join("")}</div>` : ""}
      </div>
      <section class="pdesc" id="pdesc">
        <h2 class="pdesc__t">Опис</h2>
        <div class="pdesc__body" id="pdescBody"><p>${p.desc || "Опис уточнюйте у менеджера."}</p></div>
        ${needMore ? `<button class="pdesc__more" id="pdescMore" type="button">Переглянути більше ${ico("ic-chev")}</button>` : ""}
      </section>
    </div>
    <div class="pdp__info">
      <span class="eyebrow"><span class="slashes"><i></i><i></i><i></i></span> <a href="catalog.html?brand=${encodeURIComponent(p.brand)}">${p.brand}</a> · <a href="catalog.html?cat=${encodeURIComponent(p.cat)}">${p.cat}</a></span>
      <h2 class="pdp__title">${p.name}</h2>
      <div class="pdp__price"><b>${priceText(p)}</b><span class="in">${stockOf(p)}</span></div>
      <dl class="facts facts--pdp">${factsOf(p).map(f => `<div class="facts__r"><dt>${f.k}</dt><dd><a href="${f.href}">${f.v}</a></dd></div>`).join("")}</dl>
      <div class="pdp__actions">
        <button class="btn btn--red btn--lg" data-order="${p.name}">Замовити</button>
        <a class="btn btn--line btn--lg" href="tel:+380938701107">${ico("ic-phone")} Подзвонити</a>
      </div>
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
  const setHH = () => { const h = document.getElementById("header"); if (h) document.documentElement.style.setProperty("--hh", h.offsetHeight + "px"); };
  setHH(); window.addEventListener("resize", setHH); setTimeout(setHH, 350);
  initChrome(); initModal(); initCards();
  renderStrip(); renderCats(); renderRail(); renderBrands(); renderCatalog(); renderProduct();
  initAcc(); revealInit(); initSmooth();
})();

/* ============ MOTOMIX — app (multi-page) ============ */
const ORDER_ENDPOINT = 'https://motomix.vercel.app/api/order'; // прод-ендпоінт (працює і з дзеркала на GitHub Pages)

/* ---------------- DATA (з data.js, згенеровано з OLX) ---------------- */
const CATEGORIES = window.MM_CATEGORIES || [];
const PRODUCTS   = window.MM_PRODUCTS   || [];
const BRANDS     = window.MM_BRANDS     || [];

/* ЗАГЛУШКА: приклади відгуків — замінити на реальні від клієнта */
const REVIEWS = [
  { n:'Андрій', c:'Біла Церква', av:'assets/reviews/r1.jpg', t:'Брав ендуро — підібрали під мій зріст, не нав\'язували дорожче. Підготували, пояснили по обслуговуванню. Катаю другий сезон, питань нема.' },
  { n:'Олег', c:'Київ', av:'assets/reviews/r2.jpg', t:'Привезли в Київ без передоплати, як і домовлялись. Документи всі на місці, поставив на облік без проблем.' },
  { n:'Віталій', c:'Фастів', av:'assets/reviews/r3.jpg', t:'Здав старий мопед по Trade-in, доплатив різницю. Оцінили нормально, без заниження. Рекомендую.' },
];

/* ---------------- helpers ---------------- */
const el = (h) => { const t = document.createElement('template'); t.innerHTML = h.trim(); return t.content.firstChild; };
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
      <img src="${p.img}" alt="${n.title}" loading="lazy">
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

/* ---------------- renders ---------------- */
function renderCats() {
  const box = document.getElementById('cats'); if (!box) return;
  CATEGORIES.forEach((c, i) => box.appendChild(el(`
    <a class="cat rv" href="catalog.html?type=${encodeURIComponent(c.name)}">
      <img src="${c.img}" alt="${c.name}" loading="lazy">
      <span class="cat__n num-out">0${i + 1}</span>
      <div class="cat__body">
        <div class="cat__bar"></div>
        <div class="cat__name">${c.name}</div>
        <div class="cat__meta">${c.short || ""}</div>
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
    type:  { label: "Тип",        values: [ALL, ...CATEGORIES.map(c => c.name)] },
    brand: { label: "Бренд",      values: [ALL, ...[...new Set(PRODUCTS.map(p => p.brand))]] },
    cc:    { label: "Об’єм, см³", values: [ALL, ...[...new Set(PRODUCTS.map(p => p.cc).filter(Boolean))].sort((a,b)=>a-b)] },
  };
  const PRICE_RANGES = [["до 50 000",0,50000],["50 000 – 100 000",50000,100000],
    ["100 000 – 150 000",100000,150000],["від 150 000",150000,Infinity]];
  groups.price = { label: "Ціна, ₴", values: [ALL, ...PRICE_RANGES.map(r => r[0])] };
  const state = { type: ALL, brand: ALL, cc: ALL, price: ALL };
  const q = (qs("q") || "").toLowerCase();
  if (groups.type.values.includes(qs("type"))) state.type = qs("type");
  // ?cat= (група верхнього рівня) теж працює — лишаємо старі посилання робочими
  const grp = qs("cat");
  if (qs("cc") && groups.cc.values.map(String).includes(qs("cc"))) state.cc = Number(qs("cc"));
  if (groups.brand.values.includes(qs("brand"))) state.brand = qs("brand");

  const inPrice = (p, label) => {
    if (label === ALL) return true;
    const r = PRICE_RANGES.find(x => x[0] === label); if (!r) return true;
    return typeof p.priceUah === "number" && p.priceUah >= r[1] && p.priceUah < r[2];
  };
  const fits = (p, st) => (st.type === ALL || p.type === st.type) && (st.brand === ALL || p.brand === st.brand)
    && (st.cc === ALL || p.cc === st.cc) && inPrice(p, st.price)
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
      if (h1) h1.textContent = c;
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
  document.getElementById("f-reset")?.addEventListener("click", () => { state.type = ALL; state.brand = ALL; state.cc = ALL; state.price = ALL; draw(); });
  sortSel?.addEventListener("change", draw);
  draw();
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
        <div class="gallery__main" id="galMain">
          <div class="gallery__strip" id="galStrip">${gal.map(g => `<div class="gallery__slide" style="--bg:url('${g}')"><img src="${g}" alt="${n.title}" draggable="false"></div>`).join("")}</div>
          ${gal.length > 1 ? `<button class="gallery__nav gallery__nav--p" id="galPrev" type="button" aria-label="Попереднє фото">${ico("ic-arrow-l")}</button>
          <button class="gallery__nav gallery__nav--n" id="galNext" type="button" aria-label="Наступне фото">${ico("ic-arrow")}</button>
          <span class="gallery__count" id="galCount">1 / ${gal.length}</span>` : ""}
        </div>
        ${gal.length > 1 ? `<div class="gallery__thumbs" id="galThumbs">${gal.map((g, i) => `<button type="button" class="${i ? "" : "active"}" data-i="${i}" aria-label="Фото ${i + 1}"><img src="${g}" alt="" loading="lazy"></button>`).join("")}</div>` : ""}
      </div>
      <section class="pdesc" id="pdesc">
        <h2 class="pdesc__t">Опис</h2>
        <div class="pdesc__body" id="pdescBody"><p>${p.desc || "Опис уточнюйте у менеджера."}</p></div>
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

  initGallery(gal.length);
  initAcc();
  const rel = document.getElementById('related');
  if (rel) PRODUCTS.filter(x => (x.type || x.cat) === (p.type || p.cat) && x.id !== p.id).slice(0, 5)
    .forEach(x => rel.appendChild(el(pcardHtml(x))));
  const rev = document.getElementById('reviews');
  if (rev) REVIEWS.forEach(r => rev.appendChild(el(`
    <div class="rev rv">
      <div class="rev__top">
        <div class="rev__av">${r.av ? `<img src="${r.av}" alt="" loading="lazy">` : r.n[0]}</div>
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

  // клавіатура — стрілками вліво/вправо
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') go(i - 1);
    if (e.key === 'ArrowRight') go(i + 1);
  });
  window.addEventListener('resize', () => go(i, false));
  go(0, false);
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
      <a class="ci__img" href="product.html?id=${i.p.id}"><img src="${i.p.img}" alt="${n.title}" loading="lazy"></a>
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
  initChrome(); initModal(); initCards(); initCart();
  renderStrip(); renderCats(); renderRail(); renderBrands(); renderCatalog(); renderProduct();
  initAcc(); revealInit(); initSmooth();
})();

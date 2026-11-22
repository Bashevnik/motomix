(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const stored = () => { try { return JSON.parse(sessionStorage.getItem('motomix-admin') || 'null'); } catch { return null; } };
  const saveSession = (value) => sessionStorage.setItem('motomix-admin', JSON.stringify(value));
  const escape = (v) => String(v ?? '').replace(/[&<>'"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[c]);
  const slugify = (v) => String(v).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
  let auth = stored();
  let state = { version: 1, products: [], categories: [] };
  let editingProduct = null;
  let editingCategory = null;
  let toastTimer;

  const notify = (message) => { const box = $('#toast'); box.textContent = message; box.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => box.classList.remove('show'), 3600); };
  const basic = () => `Basic ${btoa(`${auth.user}:${auth.password}`)}`;
  const api = async (path, options = {}) => {
    const headers = { Authorization: basic(), ...(options.headers || {}) };
    if (auth.githubToken) headers['X-Motomix-GitHub-Token'] = auth.githubToken;
    const response = await fetch(`/api/admin${path}`, { ...options, headers });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || 'Помилка запиту.');
    return body;
  };
  const catalogProducts = () => window.MM_PRODUCTS || [];
  const catalogCategories = () => window.MM_CATEGORIES || [];
  const imageSrc = (value) => /^https?:\/\//i.test(String(value || '')) ? value : `/${String(value || '')}`;
  const overrideFor = (id) => state.products.find((p) => p.id === id);
  const replaceOverride = (entry) => { const at = state.products.findIndex((p) => p.id === entry.id); if (at >= 0) state.products[at] = entry; else state.products.push(entry); };
  const replaceCategory = (entry) => { const at = state.categories.findIndex((p) => p.slug === entry.slug); if (at >= 0) state.categories[at] = entry; else state.categories.push(entry); };
  const applyLocal = () => { window.MM_APPLY_ADMIN_CATALOG?.(state); };

  function renderMetrics() {
    const products = catalogProducts(); const categories = catalogCategories();
    $('#metrics').innerHTML = `<article class="metric"><b>${products.length}</b><span>товарів у каталозі</span></article><article class="metric"><b>${categories.length}</b><span>категорій</span></article><article class="metric"><b>${state.products.length}</b><span>адмін-правок очікують публікацію</span></article>`;
  }
  function renderFilter() {
    const select = $('#product-filter'); const value = select.value;
    select.innerHTML = '<option value="">Усі категорії</option>' + catalogCategories().map((c) => `<option value="${escape(c.name)}">${escape(c.name)}</option>`).join('');
    select.value = value;
  }
  function renderProducts() {
    const query = $('#product-search').value.trim().toLowerCase(); const type = $('#product-filter').value;
    const list = catalogProducts().filter((p) => (!query || `${p.name} ${p.displayName || ''} ${p.brand || ''}`.toLowerCase().includes(query)) && (!type || p.type === type));
    $('#products-list').innerHTML = list.length ? list.map((p) => `<article class="admin-card"><img class="admin-card__img" src="${escape(imageSrc(p.img))}" alt=""><div class="admin-card__body"><div class="admin-card__meta">${escape(p.brand || 'MOTOMIX')} · ${escape(p.type || '')}</div><h2>${escape(p.displayName || p.name)}</h2><div class="admin-card__price">${escape(p.priceRaw || 'Ціна за запитом')}</div><button class="link-btn" data-edit-product="${escape(p.id)}" type="button">Редагувати</button></div></article>`).join('') : '<p class="empty-state">Нічого не знайдено.</p>';
    $$('[data-edit-product]').forEach((button) => button.addEventListener('click', () => openProduct(catalogProducts().find((p) => p.id === button.dataset.editProduct))));
  }
  function renderCategories() {
    $('#categories-list').innerHTML = catalogCategories().map((c) => `<article class="category-row"><div><b>${escape(c.name)}</b><span>/${escape(c.slug)} · ${escape(c.short || 'Без короткого опису')}</span></div><button class="link-btn" data-edit-category="${escape(c.slug)}" type="button">Редагувати</button></article>`).join('');
    $$('[data-edit-category]').forEach((button) => button.addEventListener('click', () => openCategory(catalogCategories().find((c) => c.slug === button.dataset.editCategory))));
  }
  function renderAll() { renderMetrics(); renderFilter(); renderProducts(); renderCategories(); }

  function view(name) {
    $$('.panel-view').forEach((node) => node.classList.toggle('active', node.id === `${name}-view`));
    $$('.nav-item').forEach((node) => node.classList.toggle('active', node.dataset.view === name));
    if (name === 'orders') loadOrders();
  }
  async function loadOrders() {
    const box = $('#orders-list'); box.innerHTML = '<p class="empty-state">Завантаження заявок…</p>';
    try {
      const result = await api('?action=orders'); const orders = result.orders || [];
      box.innerHTML = orders.length ? orders.map((o) => `<article class="order"><div><b>${escape(o.n || 'Без імені')}</b><div class="order__meta">${escape(o.d || '')} · ${escape(o.p || '')}</div><p>${escape(o.it || 'Заявка з сайту')}</p>${o.c ? `<p class="order__meta">${escape(o.c)}</p>` : ''}</div><strong>${o.s ? `${Number(o.s).toLocaleString('uk-UA')} грн` : 'Заявка'}</strong></article>`).join('') : '<p class="empty-state">У журналі заявок поки порожньо.</p>';
    } catch (error) { box.innerHTML = `<p class="empty-state">${escape(error.message)}</p>`; }
  }
  async function saveCatalog(message) {
    if (!auth.githubToken) { view('settings'); throw new Error('Додайте GitHub token перед публікацією.'); }
    const source = `/* MOTOMIX admin catalog state. Managed through /admin. */\nwindow.MM_ADMIN_CATALOG = ${JSON.stringify(state, null, 2)};\nwindow.MM_APPLY_ADMIN_CATALOG?.(window.MM_ADMIN_CATALOG);\n`;
    await api('?action=save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: 'catalog-overrides.js', content: btoa(unescape(encodeURIComponent(source))), message }) });
  }
  async function uploadImage(file, id) {
    if (!file) return null;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 3 * 1024 * 1024) throw new Error('Оберіть JPG, PNG або WEBP до 3 МБ.');
    if (!auth.githubToken) { view('settings'); throw new Error('Додайте GitHub token перед завантаженням фото.'); }
    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
    const base64 = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(',')[1]); reader.onerror = reject; reader.readAsDataURL(file); });
    const path = `assets/admin/${slugify(id) || `product-${Date.now()}`}.${ext}`;
    await api('?action=upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path, content: base64, message: `Admin upload: ${path}` }) });
    return path;
  }
  function openProduct(product) {
    editingProduct = product || null; const p = product || {};
    $('#product-modal-title').textContent = product ? 'Редагувати товар' : 'Новий товар'; $('#p-id').value = p.id || '';
    $('#p-name').value = p.displayName || p.name || ''; $('#p-brand').value = p.brand || 'MOTOMIX'; $('#p-price').value = p.priceRaw || 'Ціна за запитом'; $('#p-stock').value = p.stock || 'Уточнюйте наявність'; $('#p-badge').value = p.badge || 'Новинка'; $('#p-desc').value = p.desc || ''; $('#p-source').value = p.source || p.olx || '';
    $('#p-type').innerHTML = catalogCategories().map((c) => `<option value="${escape(c.name)}">${escape(c.name)}</option>`).join(''); $('#p-type').value = p.type || catalogCategories()[0]?.name || '';
    const preview = $('#p-preview'); preview.src = p.img ? imageSrc(p.img) : ''; preview.classList.toggle('hidden', !p.img); $('#p-image').value = ''; $('#product-error').textContent = ''; $('#delete-product').style.visibility = product ? 'visible' : 'hidden'; $('#product-modal').showModal();
  }
  function openCategory(category) {
    editingCategory = category || null; const c = category || {};
    $('#category-modal-title').textContent = category ? 'Редагувати категорію' : 'Нова категорія'; $('#c-slug-original').value = c.slug || ''; $('#c-name').value = c.name || ''; $('#c-slug').value = c.slug || ''; $('#c-short').value = c.short || ''; $('#c-desc').value = c.d || ''; $('#category-error').textContent = ''; $('#delete-category').style.visibility = category ? 'visible' : 'hidden'; $('#category-modal').showModal();
  }
  function start() { $('#login-view').classList.add('hidden'); $('#admin-view').classList.remove('hidden'); state = structuredClone(window.MM_ADMIN_CATALOG || state); renderAll(); }

  document.addEventListener('DOMContentLoaded', () => {
    $('#login-form').addEventListener('submit', async (event) => { event.preventDefault(); const error = $('#login-error'); error.textContent = ''; const user = $('#login-user').value.trim(); const password = $('#login-password').value; try { const probe = { user, password, githubToken: '' }; auth = probe; await api('?action=login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'login' }) }); saveSession(auth); start(); } catch (e) { auth = null; error.textContent = e.message; } });
    $('#logout').addEventListener('click', () => { sessionStorage.removeItem('motomix-admin'); location.reload(); });
    $$('.nav-item').forEach((button) => button.addEventListener('click', () => view(button.dataset.view)));
    $$('[data-go-settings]').forEach((button) => button.addEventListener('click', () => view('settings'))); $$('[data-open-product]').forEach((button) => button.addEventListener('click', () => openProduct()));
    $('#product-search').addEventListener('input', renderProducts); $('#product-filter').addEventListener('change', renderProducts); $('#add-category').addEventListener('click', () => openCategory()); $('#refresh-orders').addEventListener('click', loadOrders);
    $('#settings-form').addEventListener('submit', (event) => { event.preventDefault(); auth.githubToken = $('#github-token').value.trim(); saveSession(auth); notify(auth.githubToken ? 'Token додано лише для цієї сесії.' : 'Token видалено.'); });
    $('#github-token').value = auth?.githubToken || '';
    $('#p-image').addEventListener('change', (event) => { const file = event.target.files[0]; if (!file) return; const preview = $('#p-preview'); preview.src = URL.createObjectURL(file); preview.classList.remove('hidden'); });
    $('#product-form').addEventListener('submit', async (event) => { event.preventDefault(); const error = $('#product-error'); error.textContent = ''; const submit = $('#product-form button[type="submit"]'); submit.disabled = true; try { const id = $('#p-id').value || slugify($('#p-name').value) || `product-${Date.now()}`; const file = $('#p-image').files[0]; const image = await uploadImage(file, id); const old = editingProduct || {}; const entry = { ...old, id, name: $('#p-name').value.trim(), displayName: $('#p-name').value.trim(), brand: $('#p-brand').value.trim() || 'MOTOMIX', cat: old.cat || $('#p-type').value, type: $('#p-type').value, priceRaw: $('#p-price').value.trim() || 'Ціна за запитом', priceUah: null, stock: $('#p-stock').value.trim() || 'Уточнюйте наявність', badge: $('#p-badge').value.trim(), desc: $('#p-desc').value.trim(), source: $('#p-source').value.trim(), ...(image ? { img: image, gallery: [image] } : {}), ar: old.ar || .75 }; replaceOverride(entry); applyLocal(); await saveCatalog(`Admin: ${editingProduct ? 'update' : 'add'} product ${id}`); $('#product-modal').close(); renderAll(); notify('Товар збережено. Vercel опублікує зміни автоматично.'); } catch (e) { error.textContent = e.message; } finally { submit.disabled = false; } });
    $('#delete-product').addEventListener('click', async () => { if (!editingProduct || !confirm(`Приховати «${editingProduct.displayName || editingProduct.name}» з каталогу?`)) return; try { replaceOverride({ id: editingProduct.id, hidden: true }); applyLocal(); await saveCatalog(`Admin: hide product ${editingProduct.id}`); $('#product-modal').close(); renderAll(); notify('Товар приховано.'); } catch (e) { $('#product-error').textContent = e.message; } });
    $('#category-form').addEventListener('submit', async (event) => { event.preventDefault(); const error = $('#category-error'); error.textContent = ''; try { const slug = slugify($('#c-slug').value); if (!slug) throw new Error('Slug має складатися з латиниці, цифр та дефісів.'); const old = editingCategory || {}; const originalSlug = $('#c-slug-original').value; const entry = { ...old, name: $('#c-name').value.trim(), slug, group: old.group || 'Аксесуари', icon: old.icon || 'ic-t-gear', short: $('#c-short').value.trim(), d: $('#c-desc').value.trim(), hiddenFromHome: old.hiddenFromHome ?? true }; if (originalSlug && originalSlug !== slug) replaceCategory({ slug: originalSlug, hidden: true }); replaceCategory(entry); applyLocal(); await saveCatalog(`Admin: ${editingCategory ? 'update' : 'add'} category ${slug}`); $('#category-modal').close(); renderAll(); notify('Категорію збережено.'); } catch (e) { error.textContent = e.message; } });
    $('#delete-category').addEventListener('click', async () => { if (!editingCategory || !confirm(`Приховати «${editingCategory.name}»?`)) return; try { replaceCategory({ slug: editingCategory.slug, hidden: true }); applyLocal(); await saveCatalog(`Admin: hide category ${editingCategory.slug}`); $('#category-modal').close(); renderAll(); notify('Категорію приховано.'); } catch (e) { $('#category-error').textContent = e.message; } });
    if (auth?.user && auth?.password) api('?action=session').then(start).catch(() => { sessionStorage.removeItem('motomix-admin'); auth = null; });
  });
})();

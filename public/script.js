let currentUser = null;
let filterCategory = 'all';
let sortOrder = 'default';
let searchQuery = '';
let products = [];
let cart = [];
let selectedVariant = null;
let editPriceMode = false;

const IMAGE_MAP = {
  'Кроссовки детские «Звёздочка» экокожа':'IMG_KS_195217.png',
  'Кроссовки детские «Гонщик» экокожа':'IMG_KS_195213.png',
  'Кроссовки детские «Радуга» экокожа перфорированная':'IMG_KS_195222.png',
  'Сапожки детские «Снежинка» зимние на меху':'IMG_KB_185501.png',
  'Сапожки детские «Медвежонок» демисезонные непромокаемые':'IMG_KB_164816.png',
  'Сапожки детские «Принцесса» кожаные':'IMG_KB_164811.png',
  'Сандалии детские «Пчёлка» ортопедические летние':'IMG_KSd_195207.png',
  'Сандалии детские «Морячок» текстильные с фиксатором':'IMG_KSd_185508.png',
  'Туфли детские «Бантик» лаковые праздничные':'IMG_KSho_185512.png',
  'Сапоги зимние натуральная кожа':'IMG_WB_170905.png',
  'Сапоги осенние натуральная кожа':'IMG_WB_170859.png',
  'Сапоги трубы демисезонные замшевые':'IMG_WB_170906.png',
  'Босоножки «Песчаный берег» коричневые':'IMG_WSd_174332.png',
  'Женские босоножки «Черный кофе» со скульптурным каблуком':'IMG_WSd_185156.png',
  'Босоножки женские «Летний бриз»':'IMG_WSd_185551.png',
  'Демисезонные туфли натуральная кожа':'IMG_WSho_174409.png',
  'Туфли женские натуральная кожа с металлическими вставками':'IMG_WSho_185202.png',
  'Туфли классические лодочки натуральная кожа':'IMG_WSho_185545.png',
  'Кроссовки белые с оранжевым и красным':'IMG_WS_174110.png',
  'Кроссовки летние кожаные':'IMG_WS_185528.png',
  'Кроссовки кожаные':'IMG_WS_185535.png',
  'Кроссовки «Стиль и комфорт»':'IMG_WS_185538.png',
  'Кроссовки для бега «Драйв»':'IMG_MS_185531.png',
  'Кроссовки «Азимут Бег»':'IMG_MS_185532.png',
  'Кроссовки':'IMG_MS_185533.png',
  'Черные туфли в классическом стиле':'IMG_MSho_190514.png',
  'Туфли мужские светлые классика демисезонные':'IMG_MSho_190518.png',
  'Туфли из натуральной кожи':'IMG_MSho_191612.png',
  'Ботинки мужские демисезонные':'IMG_MB_174349.png',
  'Ботинки черные из натуральной кожи':'IMG_MB_191200.png',
  'Ботинки зимние классические':'IMG_MB_191205.png'
};

function getProductImage(name) { return IMAGE_MAP[name] || 'picture.png'; }

function showToast(text) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = text;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2500);
}

function openAuth() {
  document.getElementById('loginInput').value = '';
  document.getElementById('modalError').textContent = '';
  document.getElementById('authModal').classList.add('show');
  setTimeout(() => document.getElementById('loginInput')?.focus(), 50);
}
function closeAuth() { document.getElementById('authModal').classList.remove('show'); }

async function login() {
  const loginInput = document.getElementById('loginInput').value.trim().toLowerCase();
  const errorEl = document.getElementById('modalError');
  if (!loginInput) { errorEl.textContent = 'Введите логин'; return; }

  const data = await window.api.auth.login(loginInput);
  if (!data.success) { errorEl.textContent = data.error || 'Не найден'; return; }
  currentUser = data.user;
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  closeAuth();
  updateUserUI();
  loadProducts();
}

function logout() {
  currentUser = null; cart = [];
  localStorage.removeItem('currentUser');
  updateUserUI(); updateCartUI(); loadProducts();
}

function updateUserUI() {
  const block = document.getElementById('userBlock');
  const filters = document.getElementById('filtersBar');

  if (currentUser) {
    const isAdmin = currentUser.role_id === 1;
    const isManager = currentUser.role_id === 1 || currentUser.role_id === 2;
    const ordersBtn = isManager ? `<button class="btn btn-outline" onclick="openManager()">📋 Заказы</button>` : '';
    const adminBtn = isAdmin ? `<button class="btn btn-outline" onclick="togglePriceEdit()" id="editPriceBtn">💰 Цены</button>` : '';
    block.innerHTML = `
      <div class="user-info">
        <div class="name">${currentUser.last_name} ${currentUser.first_name} ${currentUser.middle_name || ''}</div>
        <div class="role">${ROLES[currentUser.role_id] || 'Пользователь'}</div>
      </div>
      ${adminBtn}
      ${ordersBtn}
      <button class="btn btn-outline" onclick="logout()">Выйти</button>`;
    filters.classList.remove('hidden');
  } else {
    block.innerHTML = `<button class="btn btn-primary" onclick="openAuth()">🔐 Войти в систему</button>`;
    filters.classList.add('hidden');
  }
}

function openManager() { window.location.href = 'manager.html'; }

function togglePriceEdit() {
  editPriceMode = !editPriceMode;
  const btn = document.getElementById('editPriceBtn');
  if (btn) btn.textContent = editPriceMode ? '✅ Готово' : '💰 Цены';
  renderCatalog();
}

async function loadProducts() {
  const container = document.getElementById('catalog');
  container.innerHTML = '<div style="text-align:center;padding:40px;color:#70B2AF;">Загрузка…</div>';
  try {
    products = await window.api.products.getAll();
    renderCatalog();
  } catch (e) {
    console.error(e);
    container.innerHTML = '<div style="text-align:center;padding:40px;color:#d92d2d;">Ошибка загрузки товаров</div>';
  }
}

function renderCatalog() {
  const container = document.getElementById('catalog');
  let list = [...products];

  if (currentUser) {
    if (filterCategory !== 'all') list = list.filter(p => p.category === filterCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.product_name.toLowerCase().includes(q));
    }
    if (sortOrder === 'asc')  list.sort((a, b) => a.min_price - b.min_price);
    if (sortOrder === 'desc') list.sort((a, b) => b.min_price - a.min_price);
  }

  if (list.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:60px 20px;color:#999;"><div style="font-size:3rem;">🔍</div><div style="font-size:1.1rem;font-weight:700;">Товары не найдены</div></div>';
    document.getElementById('resultsInfo').textContent = '';
    return;
  }

  container.innerHTML = list.map(p => {
    const lowStock = p.total_stock <= 3;
    const img = getProductImage(p.product_name);
    const sizesCount = p.variants.length;

    const priceBlock = (editPriceMode && currentUser?.role_id === 1)
      ? `<div class="price-edit">
           <input type="number" value="${p.min_price}" data-product="${p.product_id}" 
                  onclick="event.stopPropagation()" 
                  onchange="saveProductPrice(${p.product_id}, this.value)" 
                  class="price-input">
           <div class="price-label">₽</div>
         </div>`
      : `<div class="price-new">${p.min_price.toFixed(2)} ₽</div>`;

    const cartBtn = !editPriceMode
      ? `<button class="btn-cart" onclick="event.stopPropagation(); openProductModal(${p.product_id})" title="Выбрать размер">🛒</button>`
      : '';

    return `<div class="product-card ${lowStock ? 'low-stock-red' : ''}" onclick="openProductModal(${p.product_id})">
      <div class="product-image"><img src="images/${img}" alt="${p.product_name}" onerror="this.parentElement.innerHTML='👟';"></div>
      <div class="product-info">
        <div class="product-title"><span class="manufacturer">${p.category}</span>${p.product_name}</div>
        <div class="product-meta"><span>📁 ${p.category} • 📏 Размеров: ${sizesCount}</span></div>
        <div class="product-stock ${lowStock ? 'critical' : 'many'}">
          ${lowStock ? '🔴 Мало' : '🟢 В наличии'}: ${p.total_stock} шт
        </div>
      </div>
      <div class="product-price">
        ${priceBlock}
        ${cartBtn}
      </div>
    </div>`;
  }).join('');

  document.getElementById('resultsInfo').textContent = `Найдено: ${list.length} моделей`;
}

function openProductModal(productId) {
  if (!currentUser) {
    dialogWarning('Войдите в систему');
    openAuth();
    return;
  }
  const p = products.find(x => x.product_id === productId);
  if (!p) return;
  const img = getProductImage(p.product_name);

  const sizeButtons = p.variants.map(v => `
    <button class="size-btn" data-variant="${v.variant_id}" data-stock="${v.stock_quantity}" data-price="${v.price}" data-size="${v.size}"
            onclick="selectSize(this)">
      <b>${v.size}</b>
      <small>${v.stock_quantity} шт</small>
    </button>
  `).join('');

  document.getElementById('productModalContent').innerHTML = `
    <button class="modal-back-btn" onclick="closeProductModal()">← Назад</button>
    <div class="product-detail">
      <div class="product-detail-image"><img src="${'images/' + img}" alt="${p.product_name}" onerror="this.parentElement.innerHTML='👟';"></div>
      <div class="product-detail-info">
        <div class="detail-manufacturer">${p.category}</div>
        <h2>${p.product_name}</h2>
        <div class="detail-row"><b>Категория:</b> ${p.category}</div>
        <div class="detail-row"><b>Доступно размеров:</b> ${p.variants.length}</div>
        <div class="detail-row"><b>Всего на складе:</b> ${p.total_stock} шт</div>

        <div class="detail-section">
          <label>Выберите размер:</label>
          <div class="size-grid" id="sizeGrid">${sizeButtons}</div>
        </div>

        <div class="detail-section" id="qtySection" style="display:none;">
          <label>Количество:</label>
          <div class="qty-control">
            <button class="qty-btn" onclick="changeQty(-1)">−</button>
            <input type="number" id="qtyInput" value="1" min="1" readonly>
            <button class="qty-btn" onclick="changeQty(1)">+</button>
          </div>
        </div>

        <div class="detail-price" id="priceDisplay" style="display:none;">
          <span class="price-new" id="selectedPrice"></span>
        </div>

        <button class="btn btn-primary btn-full" id="addToCartBtn" style="display:none;margin-top:16px;" onclick="addSelectedToCart()">
          🛒 Добавить в корзину
        </button>
      </div>
    </div>`;
  document.getElementById('productModal').classList.add('show');
}

function selectSize(btn) {
  document.querySelectorAll('#sizeGrid .size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  selectedVariant = {
    variant_id: parseInt(btn.dataset.variant),
    size: parseFloat(btn.dataset.size),
    price: parseFloat(btn.dataset.price),
    stock: parseInt(btn.dataset.stock)
  };

  document.getElementById('qtySection').style.display = 'block';
  const input = document.getElementById('qtyInput');
  input.value = 1;
  input.max = selectedVariant.stock;

  document.getElementById('priceDisplay').style.display = 'flex';
  document.getElementById('selectedPrice').textContent = `${selectedVariant.price.toFixed(2)} ₽`;
  document.getElementById('addToCartBtn').style.display = 'flex';
}

function changeQty(delta) {
  const input = document.getElementById('qtyInput');
  let val = parseInt(input.value) + delta;
  if (val < 1) val = 1;
  if (val > selectedVariant.stock) val = selectedVariant.stock;
  input.value = val;
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('show');
  selectedVariant = null;
}

function addSelectedToCart() {
  if (!selectedVariant) {
    dialogWarning('Выберите размер');
    return;
  }
  const qty = parseInt(document.getElementById('qtyInput').value);
  const existing = cart.find(c => c.variant_id === selectedVariant.variant_id);

  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({
      variant_id: selectedVariant.variant_id,
      size: selectedVariant.size,
      price: selectedVariant.price,
      quantity: qty
    });
  }

  updateCartUI();
  showToast(`🛒 Добавлено: размер ${selectedVariant.size}, ${qty} шт`);
  closeProductModal();
}

async function saveProductPrice(productId, newPrice) {
  const price = Number(newPrice);
  if (isNaN(price) || price < 0) { dialogError('Некорректная цена'); return; }
  const p = products.find(x => x.product_id === productId);
  if (!p) return;
  for (const v of p.variants) {
    await window.api.variants.updatePrice(v.variant_id, price);
    v.price = price;
  }
  p.min_price = price;
  showToast(`💰 Цена обновлена: ${price.toFixed(2)} ₽`);
}

function updateCartUI() {
  const count = cart.reduce((s, c) => s + c.quantity, 0);
  const el = document.getElementById('cartCount');
  if (el) el.textContent = count;
}

function openCart() {
  if (!currentUser) { openAuth(); return; }
  const container = document.getElementById('cartContent');
  if (cart.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:40px 20px;color:#999;">
      <div style="font-size:3rem;margin-bottom:12px;">🛒</div>
      <div style="font-size:1.05rem;font-weight:700;">Корзина пуста</div>
      <div style="font-size:.85rem;margin-top:6px;">Добавьте товары из каталога</div>
    </div>`;
  } else {
    const total = cart.reduce((s, c) => s + c.price * c.quantity, 0);
    container.innerHTML = `
      <div class="cart-list">
        ${cart.map((c, i) => {
          const p = products.find(x => x.variants.some(v => v.variant_id === c.variant_id));
          return `
          <div class="cart-item">
            <div>
              <div class="cart-item-title">${p ? p.product_name : 'Товар'} — размер ${c.size}</div>
              <div class="cart-item-meta">Кол-во: ${c.quantity} шт • ${c.price.toFixed(2)} ₽/шт</div>
            </div>
            <div class="cart-item-price">${(c.price * c.quantity).toFixed(2)} ₽</div>
            <button class="cart-item-remove" onclick="removeFromCart(${i})">✕</button>
          </div>
        `}).join('')}
      </div>
      <div class="cart-total">
        <span>Итого:</span>
        <span class="cart-total-price">${total.toFixed(2)} ₽</span>
      </div>
      <button class="btn btn-primary btn-full" onclick="checkout()">✅ Оформить заказ</button>
      <button class="btn btn-outline btn-full" style="margin-top:8px;" onclick="clearCart()">Очистить корзину</button>
    `;
  }
  document.getElementById('cartModal').classList.add('show');
}

function closeCart() { document.getElementById('cartModal').classList.remove('show'); }
function removeFromCart(index) { cart.splice(index, 1); updateCartUI(); openCart(); }

async function clearCart() {
  const ok = await dialogConfirm('Удалить все товары из корзины?', { confirmText: 'Да, очистить' });
  if (ok) { cart = []; updateCartUI(); closeCart(); }
}

async function checkout() {
  if (cart.length === 0) { dialogWarning('Корзина пуста'); return; }
  const data = await window.api.orders.bulk(
    currentUser.id,
    cart.map(c => ({ variant_id: c.variant_id, quantity: c.quantity }))
  );
  if (data.success) {
    const total = cart.reduce((s, c) => s + c.price * c.quantity, 0);
    await dialogSuccess(`✅ Заказ оформлен!\n\nПозиций: ${cart.length}\nИтого: ${total.toFixed(2)} ₽`);
    cart = []; updateCartUI(); closeCart(); loadProducts();
  } else {
    dialogError(data.error || 'Ошибка оформления');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('currentUser');
  if (saved) { try { currentUser = JSON.parse(saved); } catch (e) {} }
  updateUserUI(); updateCartUI();

  document.getElementById('loginInput').addEventListener('keydown', e => { if (e.code === 'Enter') login(); });
  document.getElementById('filterCategory').addEventListener('change', e => { filterCategory = e.target.value; renderCatalog(); });
  document.getElementById('sortOrder').addEventListener('change', e => { sortOrder = e.target.value; renderCatalog(); });
  document.getElementById('searchInput').addEventListener('input', e => { searchQuery = e.target.value; renderCatalog(); });

  loadProducts();
});
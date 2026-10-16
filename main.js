const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./db');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'public', 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ===== АВТОРИЗАЦИЯ =====
ipcMain.handle('auth:login', (e, login) => {
  const user = db.prepare('SELECT * FROM users WHERE login = ?').get(login);
  if (!user) return { success: false, error: 'Пользователь не найден' };
  return { success: true, user };
});

// ===== ТОВАРЫ =====
ipcMain.handle('products:getAll', () => {
  const products = db.prepare(`
    SELECT p.id AS product_id, p.name AS product_name, c.name AS category
    FROM products p
    INNER JOIN categories c ON c.id = p.category_id
    ORDER BY p.id
  `).all();

  const variants = db.prepare(`
    SELECT pv.id AS variant_id, pv.product_id, pv.sku, pv.price, pv.stock_quantity, s.value AS size
    FROM product_variants pv
    INNER JOIN sizes s ON s.id = pv.size_id
    ORDER BY pv.product_id, s.value
  `).all();

  const variantsByProduct = {};
  for (const v of variants) {
    if (!variantsByProduct[v.product_id]) variantsByProduct[v.product_id] = [];
    variantsByProduct[v.product_id].push({
      variant_id: v.variant_id,
      sku: v.sku,
      price: Number(v.price),
      stock_quantity: Number(v.stock_quantity),
      size: Number(v.size)
    });
  }

  return products.map(p => {
    const vs = variantsByProduct[p.product_id] || [];
    const totalStock = vs.reduce((sum, v) => sum + v.stock_quantity, 0);
    const minPrice = vs.length ? Math.min(...vs.map(v => v.price)) : 0;
    return {
      product_id: p.product_id,
      product_name: p.product_name,
      category: p.category,
      min_price: minPrice,
      total_stock: totalStock,
      variants: vs
    };
  });
});

ipcMain.handle('variants:updatePrice', (e, { id, price }) => {
  db.prepare('UPDATE product_variants SET price = ? WHERE id = ?').run(Number(price), id);
  return { success: true };
});

// ===== ЗАКАЗЫ =====
ipcMain.handle('orders:getAll', () => {
  const orders = db.prepare(`
    SELECT o.id AS order_id, o.order_date, o.quantity, o.status, o.user_id,
           u.last_name, u.first_name, u.middle_name,
           pv.sku, pv.price,
           p.name AS product_name,
           c.name AS category,
           s.value AS size
    FROM orders o
    INNER JOIN users u ON u.id = o.user_id
    INNER JOIN product_variants pv ON pv.id = o.variant_id
    INNER JOIN products p ON p.id = pv.product_id
    INNER JOIN categories c ON c.id = p.category_id
    INNER JOIN sizes s ON s.id = pv.size_id
    ORDER BY o.order_date DESC
  `).all();

  return orders.map(o => ({
    ...o,
    total: Number(o.price) * Number(o.quantity),
    client: `${o.last_name} ${o.first_name} ${o.middle_name || ''}`.trim()
  }));
});

ipcMain.handle('orders:bulk', (e, { user_id, items }) => {
  const insertOrder = db.prepare(`
    INSERT INTO orders (user_id, variant_id, order_date, quantity, status)
    VALUES (?, ?, datetime('now'), ?, 'Новый')
  `);
  const updateStock = db.prepare(`
    UPDATE product_variants SET stock_quantity = stock_quantity - ? WHERE id = ?
  `);
  const getStock = db.prepare('SELECT stock_quantity FROM product_variants WHERE id = ?');

  const tx = db.transaction(() => {
    for (const item of items) {
      const v = getStock.get(item.variant_id);
      if (!v) throw new Error('Вариант не найден');
      if (Number(v.stock_quantity) < Number(item.quantity)) {
        throw new Error('Недостаточно на складе');
      }
      insertOrder.run(user_id, item.variant_id, item.quantity);
      updateStock.run(item.quantity, item.variant_id);
    }
  });

  try {
    tx();
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('orders:delete', (e, id) => {
  db.prepare('DELETE FROM orders WHERE id = ?').run(id);
  return { success: true };
});
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { app } = require('electron');

function getDbPath() {
  const dbPath = app.isPackaged
    ? path.join(app.getPath('userData'), 'data', 'app.db')
    : path.join(__dirname, 'data', 'app.db');
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dbPath;
}

const db = new Database(getDbPath());
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    last_name TEXT NOT NULL,
    first_name TEXT NOT NULL,
    middle_name TEXT,
    login TEXT UNIQUE NOT NULL,
    role_id INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS manufacturers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sizes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    value REAL NOT NULL
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    manufacturer_id INTEGER,
    description TEXT,
    composition TEXT,
    image TEXT,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (manufacturer_id) REFERENCES manufacturers(id)
  );

  CREATE TABLE IF NOT EXISTS product_variants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    size_id INTEGER NOT NULL,
    sku TEXT,
    price REAL NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (size_id) REFERENCES sizes(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    variant_id INTEGER NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    quantity INTEGER NOT NULL,
    status TEXT DEFAULT 'Новый',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (variant_id) REFERENCES product_variants(id)
  );
`);

// ===== ЗАПОЛНЕНИЕ НАЧАЛЬНЫМИ ДАННЫМИ =====
const count = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
if (count === 0) {
  const insertUser = db.prepare(`INSERT INTO users (last_name, first_name, middle_name, login, role_id) VALUES (?, ?, ?, ?, ?)`);
  const users = [
    ['Иванов','Иван','Сергеевич','isivanov',1],
    ['Петров','Пётр','Алексеевич','papetrov',2],
    ['Сидорова','Анна','Дмитриевна','asidorova',3],
    ['Кузнецова','Екатерина','Андреевна','ekuznetsova',2],
    ['Смирнов','Дмитрий','Владимирович','dsmirnov',3],
    ['Попов','Алексей','Николаевич','apopov',1],
    ['Васильева','Ольга','Игоревна','ovasileva',3],
    ['Соколов','Павел','Викторович','psokolov',2],
    ['Михайлова','Татьяна','Юрьевна','tmikhailova',3],
    ['Новикова','Наталья','Сергеевна','nnovikova',2],
    ['Фёдоров','Андрей','Максимович','afedorov',1],
    ['Морозов','Сергей','Павлович','smorozov',3],
    ['Волкова','Юлия','Александровна','jvolkova',2],
    ['Алексеев','Артём','Евгеньевич','aalekseev',3],
    ['Лебедева','Ирина','Владимировна','ilebedeva',3],
    ['Егоров','Никита','Денисович','negorov',2],
    ['Павлова','Елена','Петровна','epavlova',3],
    ['Козлов','Роман','Олегович','rkozlov',1],
    ['Степанова','Виктория','Романовна','vstepanova',2],
    ['Николаев','Владимир','Иванович','vnikolaev',3]
  ];
  const txUsers = db.transaction(() => users.forEach(u => insertUser.run(...u)));
  txUsers();

  const insertCat = db.prepare('INSERT INTO categories (name) VALUES (?)');
  ['Детская обувь','Женская обувь','Мужская обувь'].forEach(n => insertCat.run(n));

  const insertMan = db.prepare('INSERT INTO manufacturers (name) VALUES (?)');
  ['Малыш-Спорт','Топ-Топ','Лапушка','Тёплые ножки','Северята','Весна','Здоровый шаг','Карапуз','Маленький франт','Барбари','Твой комфорт','Стиль и комфорт','Кожевенные традиции','Модный силуэт','Азимут','Берестов'].forEach(n => insertMan.run(n));

  const insertSize = db.prepare('INSERT INTO sizes (value) VALUES (?)');
  const allSizes = [18,19,20,21,22,23,24,25,26,27,28,29,30,33,34,35,36,36.5,37,37.5,38,38.5,39,40,41,41.5,42,42.5,43,44,45];
  const txSizes = db.transaction(() => allSizes.forEach(s => insertSize.run(s)));
  txSizes();

  const insertProduct = db.prepare(`INSERT INTO products (name, category_id, manufacturer_id, description, composition, image) VALUES (?, ?, ?, ?, ?, ?)`);
  const insertVariant = db.prepare(`INSERT INTO product_variants (product_id, size_id, sku, price, stock_quantity) VALUES (?, ?, ?, ?, ?)`);
  const getSizeId = db.prepare('SELECT id FROM sizes WHERE value = ?');

  const PRODUCTS = [
    { name:'Кроссовки детские «Звёздочка» экокожа', image:'IMG_KS_195217.png', description:'Детские кроссовки с ортопедической стелькой', composition:'Экокожа, хлопок, ПВХ', price:2190, category_id:1, manufacturer_id:1, sizes:[18,19,20,21,22,23,24,25] },
    { name:'Кроссовки детские «Гонщик» экокожа', image:'IMG_KS_195213.png', description:'Детские кроссовки для активных игр', composition:'Экокожа, текстиль, ТЭП', price:2490, category_id:1, manufacturer_id:2, sizes:[18,19,20,21,22,23,24] },
    { name:'Кроссовки детские «Радуга» экокожа перфорированная', image:'IMG_KS_195222.png', description:'Детские кроссовки с перфорацией', composition:'Экокожа, ЭВА', price:1990, category_id:1, manufacturer_id:3, sizes:[20,21,22,23,24,25,26] },
    { name:'Сапожки детские «Снежинка» зимние на меху', image:'IMG_KB_185501.png', description:'Тёплые зимние сапожки', composition:'Экокожа, мех, ТЭП', price:3490, category_id:1, manufacturer_id:4, sizes:[18,19,20,21,22] },
    { name:'Сапожки детские «Медвежонок» демисезонные непромокаемые', image:'IMG_KB_164816.png', description:'Непромокаемые сапожки с мембраной', composition:'Плащёвая ткань, мембрана AirTex', price:3190, category_id:1, manufacturer_id:5, sizes:[20,21,22,23,24] },
    { name:'Сапожки детские «Принцесса» кожаные', image:'IMG_KB_164811.png', description:'Кожаные сапожки', composition:'Кожа, шерсть, полиуретан', price:4290, category_id:1, manufacturer_id:6, sizes:[18,19,20,21,22,23] },
    { name:'Сандалии детские «Пчёлка» ортопедические летние', image:'IMG_KSd_195207.png', description:'Ортопедические сандалии', composition:'Нубук, каучук', price:2790, category_id:1, manufacturer_id:7, sizes:[22,23,24,25,26,27] },
    { name:'Сандалии детские «Морячок» текстильные с фиксатором', image:'IMG_KSd_185508.png', description:'Лёгкие сандалии', composition:'Джинсовая ткань, ЭВА', price:1690, category_id:1, manufacturer_id:8, sizes:[22,23,24,25,26] },
    { name:'Туфли детские «Бантик» лаковые праздничные', image:'IMG_KSho_185512.png', description:'Праздничные туфли', composition:'Искусственная кожа, полиуретан', price:2390, category_id:1, manufacturer_id:9, sizes:[20,21,22,23,24,25] },
    { name:'Сапоги зимние натуральная кожа', image:'IMG_WB_170905.png', description:'Женские зимние сапоги', composition:'Кожа, евромех, резина', price:25000, category_id:2, manufacturer_id:10, sizes:[35,36,37,38,39,40] },
    { name:'Сапоги осенние натуральная кожа', image:'IMG_WB_170859.png', description:'Демисезонные сапоги', composition:'Кожа, ТПР', price:15000, category_id:2, manufacturer_id:10, sizes:[35,36,37,38,39] },
    { name:'Сапоги трубы демисезонные замшевые', image:'IMG_WB_170906.png', description:'Женские сапоги-трубы', composition:'Замша, резина', price:17000, category_id:2, manufacturer_id:11, sizes:[36,37,38,39,40] },
    { name:'Босоножки «Песчаный берег» коричневые', image:'IMG_WSd_174332.png', description:'Кожаные босоножки', composition:'Козья кожа', price:7500, category_id:2, manufacturer_id:12, sizes:[36,37,38,39] },
    { name:'Женские босоножки «Черный кофе» со скульптурным каблуком', image:'IMG_WSd_185156.png', description:'Босоножки с каблуком', composition:'Кожа, резина', price:5600, category_id:2, manufacturer_id:13, sizes:[36,37,38,39] },
    { name:'Босоножки женские «Летний бриз»', image:'IMG_WSd_185551.png', description:'Лёгкие босоножки', composition:'Кожа', price:7130, category_id:2, manufacturer_id:14, sizes:[36,37,38,39,40] },
    { name:'Демисезонные туфли натуральная кожа', image:'IMG_WSho_174409.png', description:'Туфли-лодочки', composition:'Овечья кожа, резина', price:12340, category_id:2, manufacturer_id:14, sizes:[35,36,37,38] },
    { name:'Туфли женские натуральная кожа с металлическими вставками', image:'IMG_WSho_185202.png', description:'Туфли с вставками', composition:'Телячья кожа, резина', price:7757, category_id:2, manufacturer_id:13, sizes:[36,37,38,39] },
    { name:'Туфли классические лодочки натуральная кожа', image:'IMG_WSho_185545.png', description:'Классические лодочки', composition:'Кожа, тунит', price:7550, category_id:2, manufacturer_id:12, sizes:[35,36,37,38,39] },
    { name:'Кроссовки белые с оранжевым и красным', image:'IMG_WS_174110.png', description:'Женские кроссовки', composition:'70% кожа, 30% текстиль', price:9450, category_id:2, manufacturer_id:2, sizes:[36,37,38,39,40] },
    { name:'Кроссовки летние кожаные', image:'IMG_WS_185528.png', description:'Летние кроссовки', composition:'Кожа, текстиль', price:8565, category_id:2, manufacturer_id:2, sizes:[36,37,38,39] },
    { name:'Кроссовки кожаные', image:'IMG_WS_185535.png', description:'Классические кроссовки', composition:'Кожа, полиуретан', price:8765, category_id:2, manufacturer_id:12, sizes:[36,37,38,39,40] },
    { name:'Кроссовки «Стиль и комфорт»', image:'IMG_WS_185538.png', description:'Стильные кроссовки', composition:'Кожа, полиамид', price:7795, category_id:2, manufacturer_id:12, sizes:[36,37,38,39] },
    { name:'Кроссовки для бега «Драйв»', image:'IMG_MS_185531.png', description:'Беговые кроссовки', composition:'Сетка, резина', price:6550, category_id:3, manufacturer_id:15, sizes:[40,41,42,43,44,45] },
    { name:'Кроссовки «Азимут Бег»', image:'IMG_MS_185532.png', description:'Универсальные кроссовки', composition:'Кожа, текстиль, резина', price:7890, category_id:3, manufacturer_id:15, sizes:[40,41,42,43,44] },
    { name:'Кроссовки', image:'IMG_MS_185533.png', description:'Классические кроссовки', composition:'Кожа, текстиль', price:9567, category_id:3, manufacturer_id:2, sizes:[40,41,42,43,44] },
    { name:'Черные туфли в классическом стиле', image:'IMG_MSho_190514.png', description:'Классические туфли', composition:'Кожа, резина', price:24569, category_id:3, manufacturer_id:10, sizes:[40,41,42,43,44,45] },
    { name:'Туфли мужские светлые классика демисезонные', image:'IMG_MSho_190518.png', description:'Светлые туфли', composition:'Кожа, ТЭП', price:10155, category_id:3, manufacturer_id:16, sizes:[40,41,42,43,44] },
    { name:'Туфли из натуральной кожи', image:'IMG_MSho_191612.png', description:'Классические туфли', composition:'Кожа, резина', price:25625, category_id:3, manufacturer_id:16, sizes:[40,41,42,43,44,45] },
    { name:'Ботинки мужские демисезонные', image:'IMG_MB_174349.png', description:'Демисезонные ботинки', composition:'Кожа, текстиль', price:21500, category_id:3, manufacturer_id:10, sizes:[40,41,42,43,44] },
    { name:'Ботинки черные из натуральной кожи', image:'IMG_MB_191200.png', description:'Классические ботинки', composition:'Кожа, тунит', price:14567, category_id:3, manufacturer_id:13, sizes:[40,41,42,43,44,45] }
  ];

  const txProducts = db.transaction(() => {
    for (const p of PRODUCTS) {
      const info = insertProduct.run(p.name, p.category_id, p.manufacturer_id, p.description, p.composition, p.image);
      const productId = info.lastInsertRowid;
      for (const sizeVal of p.sizes) {
        const sizeRow = getSizeId.get(sizeVal);
        if (!sizeRow) continue;
        const sku = `SKU-${productId}-${sizeVal}`;
        const stock = Math.floor(Math.random() * 15) + 1;
        insertVariant.run(productId, sizeRow.id, sku, p.price, stock);
      }
    }
  });
  txProducts();
}

module.exports = db;
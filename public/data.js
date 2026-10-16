// =====================================================
// Данные для приложения «Чудо Обувь»
// =====================================================

const USERS = [
  { user_id: 1,  last_name: 'Иванов',    first_name: 'Иван',     middle_name: 'Сергеевич',    login: 'isivanov' },
  { user_id: 2,  last_name: 'Петров',    first_name: 'Пётр',     middle_name: 'Алексеевич',   login: 'papetrov' },
  { user_id: 3,  last_name: 'Сидорова',  first_name: 'Анна',     middle_name: 'Дмитриевна',   login: 'asidorova' },
  { user_id: 4,  last_name: 'Кузнецова', first_name: 'Екатерина',middle_name: 'Андреевна',    login: 'ekuznetsova' },
  { user_id: 5,  last_name: 'Смирнов',   first_name: 'Дмитрий',  middle_name: 'Владимирович', login: 'dsmirnov' },
  { user_id: 6,  last_name: 'Попов',     first_name: 'Алексей',  middle_name: 'Николаевич',   login: 'apopov' },
  { user_id: 7,  last_name: 'Васильева', first_name: 'Ольга',    middle_name: 'Игоревна',     login: 'ovasileva' },
  { user_id: 8,  last_name: 'Соколов',   first_name: 'Павел',    middle_name: 'Викторович',   login: 'psokolov' },
  { user_id: 9,  last_name: 'Михайлова', first_name: 'Татьяна',  middle_name: 'Юрьевна',      login: 'tmikhailova' },
  { user_id: 10, last_name: 'Новикова',  first_name: 'Наталья',  middle_name: 'Сергеевна',    login: 'nnovikova' },
  { user_id: 11, last_name: 'Фёдоров',   first_name: 'Андрей',   middle_name: 'Максимович',   login: 'afedorov' },
  { user_id: 12, last_name: 'Морозов',   first_name: 'Сергей',   middle_name: 'Павлович',     login: 'smorozov' },
  { user_id: 13, last_name: 'Волкова',   first_name: 'Юлия',     middle_name: 'Александровна',login: 'jvolkova' },
  { user_id: 14, last_name: 'Алексеев',  first_name: 'Артём',    middle_name: 'Евгеньевич',   login: 'aalekseev' },
  { user_id: 15, last_name: 'Лебедева',  first_name: 'Ирина',    middle_name: 'Владимировна', login: 'ilebedeva' },
  { user_id: 16, last_name: 'Егоров',    first_name: 'Никита',   middle_name: 'Денисович',    login: 'negorov' },
  { user_id: 17, last_name: 'Павлова',   first_name: 'Елена',    middle_name: 'Петровна',     login: 'epavlova' },
  { user_id: 18, last_name: 'Козлов',    first_name: 'Роман',    middle_name: 'Олегович',     login: 'rkozlov' },
  { user_id: 19, last_name: 'Степанова', first_name: 'Виктория', middle_name: 'Романовна',    login: 'vstepanova' },
  { user_id: 20, last_name: 'Николаев',  first_name: 'Владимир', middle_name: 'Иванович',     login: 'vnikolaev' }
];

const ROLES = {
  1: 'Администратор',
  2: 'Менеджер',
  3: 'Авторизованный пользователь'
};

function getUserRole(login) {
  const admins = ['isivanov', 'apopov', 'afedorov', 'rkozlov'];
  const managers = ['papetrov', 'ekuznetsova', 'psokolov', 'nnovikova', 'jvolkova', 'negorov', 'vstepanova'];
  if (admins.includes(login)) return 1;
  if (managers.includes(login)) return 2;
  return 3;
}

USERS.forEach(u => u.role_id = getUserRole(u.login));

const CATEGORIES = { 1: 'Детская обувь', 2: 'Женская обувь', 3: 'Мужская обувь' };

const MANUFACTURERS = {
  1: 'Малыш-Спорт', 2: 'Топ-Топ', 3: 'Лапушка', 4: 'Тёплые ножки',
  5: 'Северята', 6: 'Весна', 7: 'Здоровый шаг', 8: 'Карапуз',
  9: 'Маленький франт', 10: 'Барбари', 11: 'Твой комфорт', 12: 'Стиль и комфорт',
  13: 'Кожевенные традиции', 14: 'Модный силуэт', 15: 'Азимут', 16: 'Берестов'
};

// Размеры по категориям (для UI)
const SIZES_BY_CATEGORY = {
  1: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 33, 34],
  2: [35, 36, 36.5, 37, 37.5, 38, 38.5, 39, 40],
  3: [38, 39, 40, 41, 41.5, 42, 42.5, 43, 44, 45]
};

const PRODUCTS = [
  { product_id: 1,  name: 'Кроссовки детские «Звёздочка» экокожа', image: 'IMG_KS_195217.png', description: 'Детские кроссовки с ортопедической стелькой', composition: 'Экокожа, хлопок, ПВХ', price: 2190, category_id: 1, manufacturer_id: 1 },
  { product_id: 2,  name: 'Кроссовки детские «Гонщик» экокожа', image: 'IMG_KS_195213.png', description: 'Детские кроссовки для активных игр', composition: 'Экокожа, текстиль, ТЭП', price: 2490, category_id: 1, manufacturer_id: 2 },
  { product_id: 3,  name: 'Кроссовки детские «Радуга» экокожа перфорированная', image: 'IMG_KS_195222.png', description: 'Детские кроссовки с перфорацией', composition: 'Экокожа, ЭВА', price: 1990, category_id: 1, manufacturer_id: 3 },
  { product_id: 4,  name: 'Сапожки детские «Снежинка» зимние на меху', image: 'IMG_KB_185501.png', description: 'Тёплые зимние сапожки', composition: 'Экокожа, мех, ТЭП', price: 3490, category_id: 1, manufacturer_id: 4 },
  { product_id: 5,  name: 'Сапожки детские «Медвежонок» демисезонные непромокаемые', image: 'IMG_KB_164816.png', description: 'Непромокаемые сапожки с мембраной', composition: 'Плащёвая ткань, мембрана AirTex', price: 3190, category_id: 1, manufacturer_id: 5 },
  { product_id: 6,  name: 'Сапожки детские «Принцесса» кожаные', image: 'IMG_KB_164811.png', description: 'Кожаные сапожки', composition: 'Кожа, шерсть, полиуретан', price: 4290, category_id: 1, manufacturer_id: 6 },
  { product_id: 7,  name: 'Сандалии детские «Пчёлка» ортопедические летние', image: 'IMG_KSd_195207.png', description: 'Ортопедические сандалии', composition: 'Нубук, каучук', price: 2790, category_id: 1, manufacturer_id: 7 },
  { product_id: 8,  name: 'Сандалии детские «Морячок» текстильные с фиксатором', image: 'IMG_KSd_185508.png', description: 'Лёгкие сандалии', composition: 'Джинсовая ткань, ЭВА', price: 1690, category_id: 1, manufacturer_id: 8 },
  { product_id: 9,  name: 'Туфли детские «Бантик» лаковые праздничные', image: 'IMG_KSho_185512.png', description: 'Праздничные туфли', composition: 'Искусственная кожа, полиуретан', price: 2390, category_id: 1, manufacturer_id: 9 },
  { product_id: 10, name: 'Сапоги зимние натуральная кожа', image: 'IMG_WB_170905.png', description: 'Женские зимние сапоги', composition: 'Кожа, евромех, резина', price: 25000, category_id: 2, manufacturer_id: 10 },
  { product_id: 11, name: 'Сапоги осенние натуральная кожа', image: 'IMG_WB_170859.png', description: 'Демисезонные сапоги', composition: 'Кожа, ТПР', price: 15000, category_id: 2, manufacturer_id: 10 },
  { product_id: 12, name: 'Сапоги трубы демисезонные замшевые', image: 'IMG_WB_170906.png', description: 'Женские сапоги-трубы', composition: 'Замша, резина', price: 17000, category_id: 2, manufacturer_id: 11 },
  { product_id: 13, name: 'Босоножки «Песчаный берег» коричневые', image: 'IMG_WSd_174332.png', description: 'Кожаные босоножки', composition: 'Козья кожа', price: 7500, category_id: 2, manufacturer_id: 12 },
  { product_id: 14, name: 'Женские босоножки «Черный кофе» со скульптурным каблуком', image: 'IMG_WSd_185156.png', description: 'Босоножки с каблуком', composition: 'Кожа, резина', price: 5600, category_id: 2, manufacturer_id: 13 },
  { product_id: 15, name: 'Босоножки женские «Летний бриз»', image: 'IMG_WSd_185551.png', description: 'Лёгкие босоножки', composition: 'Кожа', price: 7130, category_id: 2, manufacturer_id: 14 },
  { product_id: 16, name: 'Демисезонные туфли натуральная кожа', image: 'IMG_WSho_174409.png', description: 'Туфли-лодочки', composition: 'Овечья кожа, резина', price: 12340, category_id: 2, manufacturer_id: 14 },
  { product_id: 17, name: 'Туфли женские натуральная кожа с металлическими вставками', image: 'IMG_WSho_185202.png', description: 'Туфли с вставками', composition: 'Телячья кожа, резина', price: 7757, category_id: 2, manufacturer_id: 13 },
  { product_id: 18, name: 'Туфли классические лодочки натуральная кожа', image: 'IMG_WSho_185545.png', description: 'Классические лодочки', composition: 'Кожа, тунит', price: 7550, category_id: 2, manufacturer_id: 12 },
  { product_id: 19, name: 'Кроссовки белые с оранжевым и красным', image: 'IMG_WS_174110.png', description: 'Женские кроссовки', composition: '70% кожа, 30% текстиль', price: 9450, category_id: 2, manufacturer_id: 2 },
  { product_id: 20, name: 'Кроссовки летние кожаные', image: 'IMG_WS_185528.png', description: 'Летние кроссовки', composition: 'Кожа, текстиль', price: 8565, category_id: 2, manufacturer_id: 2 },
  { product_id: 21, name: 'Кроссовки кожаные', image: 'IMG_WS_185535.png', description: 'Классические кроссовки', composition: 'Кожа, полиуретан', price: 8765, category_id: 2, manufacturer_id: 12 },
  { product_id: 22, name: 'Кроссовки «Стиль и комфорт»', image: 'IMG_WS_185538.png', description: 'Стильные кроссовки', composition: 'Кожа, полиамид', price: 7795, category_id: 2, manufacturer_id: 12 },
  { product_id: 23, name: 'Кроссовки для бега «Драйв»', image: 'IMG_MS_185531.png', description: 'Беговые кроссовки', composition: 'Сетка, резина', price: 6550, category_id: 3, manufacturer_id: 15 },
  { product_id: 24, name: 'Кроссовки «Азимут Бег»', image: 'IMG_MS_185532.png', description: 'Универсальные кроссовки', composition: 'Кожа, текстиль, резина', price: 7890, category_id: 3, manufacturer_id: 15 },
  { product_id: 25, name: 'Кроссовки', image: 'IMG_MS_185533.png', description: 'Классические кроссовки', composition: 'Кожа, текстиль', price: 9567, category_id: 3, manufacturer_id: 2 },
  { product_id: 26, name: 'Черные туфли в классическом стиле', image: 'IMG_MSho_190514.png', description: 'Классические туфли', composition: 'Кожа, резина', price: 24569, category_id: 3, manufacturer_id: 10 },
  { product_id: 27, name: 'Туфли мужские светлые классика демисезонные', image: 'IMG_MSho_190518.png', description: 'Светлые туфли', composition: 'Кожа, ТЭП', price: 10155, category_id: 3, manufacturer_id: 16 },
  { product_id: 28, name: 'Туфли из натуральной кожи', image: 'IMG_MSho_191612.png', description: 'Классические туфли', composition: 'Кожа, резина', price: 25625, category_id: 3, manufacturer_id: 16 },
  { product_id: 29, name: 'Ботинки мужские демисезонные', image: 'IMG_MB_174349.png', description: 'Демисезонные ботинки', composition: 'Кожа, текстиль', price: 21500, category_id: 3, manufacturer_id: 10 },
  { product_id: 30, name: 'Ботинки черные из натуральной кожи', image: 'IMG_MB_191200.png', description: 'Классические ботинки', composition: 'Кожа, тунит', price: 14567, category_id: 3, manufacturer_id: 13 }
];

const ORDERS_LAST_MONTH = [];
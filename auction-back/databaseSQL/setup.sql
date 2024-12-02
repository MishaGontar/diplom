DROP table if exists users CASCADE;
DROP table if exists users_codes CASCADE;
DROP table if exists sellers CASCADE;
DROP table if exists seller_status CASCADE;
DROP table if exists admins CASCADE;
DROP table if exists auctions CASCADE;
DROP table if exists auction_status CASCADE;
DROP table if exists lots CASCADE;
DROP table if exists lot_bet CASCADE;
DROP table if exists lot_winner CASCADE;
DROP table if exists lot_images CASCADE;
DROP table if exists images CASCADE;
DROP table if exists blocked_users CASCADE;
DROP table if exists blocked_seller_users CASCADE;


SET timezone TO 'Europe/Kiev';

CREATE TABLE IF NOT EXISTS images
(
    id         serial PRIMARY KEY,
    name       varchar(255) NOT NULL,
    image_url  varchar(255) NOT NULL UNIQUE,
    photo_data BYTEA
);

INSERT INTO images (name, image_url)
VALUES ('user_logo_standard.png', '/images/user_logo_standard.png');

create table if not exists users
(
    id           serial primary key,
    username     varchar(255)          not null unique,
    password     varchar(255)          not null,
    email        varchar(255)          not null,
    image_id     integer DEFAULT 1 REFERENCES images (id),
    is_activated boolean default false not null
);

CREATE TABLE admins
(
    id          SERIAL PRIMARY KEY,
    login       VARCHAR(255) UNIQUE NOT NULL,
    password    VARCHAR(255)        NOT NULL,
    user_id     integer UNIQUE      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    secure_code VARCHAR(255)        NOT NULL
);

CREATE TABLE IF NOT EXISTS users_codes
(
    id      SERIAL PRIMARY KEY,
    code    varchar(255) NOT NULL UNIQUE,
    user_id integer      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_users_codes FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

create table if not exists seller_status
(
    id   SERIAL PRIMARY KEY,
    name varchar(50) not null unique
);

INSERT INTO seller_status (id, name)
VALUES (1, 'очікування'),
       (2, 'підтверджено'),
       (3, 'відхилено');

CREATE TABLE IF NOT EXISTS sellers
(
    id           SERIAL PRIMARY KEY,
    user_id      integer             NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
    full_name    varchar(255)        NOT NULL,
    social_media varchar(255)        NOT NULL,
    status_id    integer DEFAULT (1) NOT NULL REFERENCES seller_status (id) ON DELETE CASCADE,
    address      varchar(255),
    description  TEXT                NOT NULL,
    phone_number varchar(20)
);

create table if not exists auction_status
(
    id   SERIAL PRIMARY KEY,
    name varchar(50) not null unique
);

INSERT INTO auction_status (id, name)
VALUES (1, 'відкритий'),
       (2, 'тільки за посиланням'),
       (3, 'закритий'),
       (4, 'продано'),
       (5, 'завершений');

CREATE TABLE IF NOT EXISTS auctions
(
    id            SERIAL PRIMARY KEY,
    name          varchar(255)                        NOT NULL,
    description   TEXT                                NOT NULL,
    seller_id     integer                             NOT NULL REFERENCES sellers (id) ON DELETE CASCADE,
    status_id     integer   DEFAULT (1)               NOT NULL REFERENCES auction_status (id) ON DELETE CASCADE,
    img_id        integer REFERENCES images (id),
    date_created  timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_finished timestamp
);


CREATE TABLE IF NOT EXISTS lots
(
    id               SERIAL PRIMARY KEY,
    name             varchar(255)                        NOT NULL,
    description      TEXT                                NOT NULL,
    seller_id        integer                             NOT NULL REFERENCES sellers (id) ON DELETE CASCADE,
    auction_id       integer                             NOT NULL REFERENCES auctions (id) ON DELETE CASCADE,
    status_id        integer   DEFAULT (1)               NOT NULL REFERENCES auction_status (id) ON DELETE CASCADE,
    amount           integer                             NOT NULL DEFAULT 0,
    bank_card_number varchar(19),
    monobank_link    varchar(255),
    date_created     timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_finished    timestamp
);

CREATE TABLE IF NOT EXISTS lot_bet
(
    id           SERIAL PRIMARY KEY,
    lot_id       integer   NOT NULL REFERENCES lots (id) ON DELETE CASCADE,
    user_id      integer REFERENCES users (id) ON DELETE CASCADE,
    amount       integer   NOT NULL DEFAULT 0,
    date_created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lot_winner
(
    id           SERIAL PRIMARY KEY,
    lot_id       integer                             NOT NULL REFERENCES lots (id) ON DELETE CASCADE,
    lot_bet_id   integer                             NOT NULL REFERENCES lot_bet (id) ON DELETE CASCADE,
    date_created timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS lot_images
(
    id     SERIAL PRIMARY KEY,
    lot_id integer NOT NULL REFERENCES lots (id) ON DELETE CASCADE,
    img_id integer NOT NULL REFERENCES images (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS blocked_users
(
    id           SERIAL PRIMARY KEY,
    user_id      integer                             NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    date_created timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS blocked_seller_users
(
    id           SERIAL PRIMARY KEY,
    seller_id    integer                             NOT NULL REFERENCES sellers (id) ON DELETE CASCADE,
    user_id      integer                             NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    date_created timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

---TEST DATA ----

INSERT INTO images (name, image_url)
VALUES ('fight.jpeg', '/images/fight.jpeg'),
       ('bear-1.jpeg', '/images/bear-1.png'),
       ('bear-2.png', '/images/bear-2.png'),
       ('bear-3.jpeg', '/images/bear-3.jpeg'),
       ('panda-1.png', '/images/panda-1.png'),
       ('panda-2.png', '/images/panda-2.png'),
       ('panda-3.png', '/images/panda-3.png'),

       ('car-main.jpeg', '/images/car-main.jpeg'),
       ('big-car-1.jpeg', '/images/big-car-1.jpeg'),
       ('big-car-2.jpeg', '/images/big-car-2.jpeg'),
       ('big-car-3.jpeg', '/images/big-car-3.jpeg'),
       ('fly-car-1.jpeg', '/images/fly-car-1.jpeg'),
       ('fly-car-2.jpeg', '/images/fly-car-2.jpeg'),
       ('fly-car-3.jpeg', '/images/fly-car-3.jpeg'),
       ('neon-car-1.jpeg', '/images/neon-car-1.jpeg'),
       ('neon-car-2.jpeg', '/images/neon-car-2.jpeg'),
       ('neon-car-3.jpeg', '/images/neon-car-3.jpeg'),

       ('eagle-main.jpeg', '/images/eagle-main.jpeg'),
       ('bird-1.jpeg', '/images/bird-1.jpeg'),
       ('bird-2.jpeg', '/images/bird-2.jpeg'),
       ('bird-3.jpeg', '/images/bird-3.jpeg'),
       ('eagle-1.jpeg', '/images/eagle-1.jpeg'),
       ('eagle-2.jpeg', '/images/eagle-2.jpeg'),
       ('eagle-3.jpeg', '/images/eagle-3.jpeg'),

       ('food-main.png', '/images/food-main.png'),
       ('ice-1.jpeg', '/images/ice-1.jpeg'),
       ('ice-2.jpeg', '/images/ice-2.jpeg'),
       ('ice-3.jpeg', '/images/ice-3.jpeg'),
       ('burger-1.jpeg', '/images/burger-1.jpeg'),
       ('burger-2.jpeg', '/images/burger-2.jpeg'),
       ('burger-3.jpeg', '/images/burger-3.jpeg'),

       ('magic-food-main.png', '/images/magic-food-main.png'),
       ('magic-food-1.jpeg', '/images/magic-food-1.jpeg'),
       ('magic-food-2.jpeg', '/images/magic-food-2.jpeg'),
       ('magic-food-3.jpeg', '/images/magic-food-3.jpeg'),
       ('magic-tea-1.jpeg', '/images/magic-tea-1.jpeg'),
       ('magic-tea-2.jpeg', '/images/magic-tea-2.jpeg'),
       ('magic-tea-3.jpeg', '/images/magic-tea-3.jpeg'),

       ('avatar-1.png', '/images/avatar-1.png'),
       ('avatar-2.png', '/images/avatar-2.png'),
       ('avatar-3.png', '/images/avatar-3.png'),
       ('avatar-4.png', '/images/avatar-4.png'),
       ('avatar-5.png', '/images/avatar-5.png'),
       ('avatar-6.png', '/images/avatar-6.png'),
       ('avatar-7.png', '/images/avatar-7.png'),
       ('avatar-8.png', '/images/avatar-8.png'),
       ('avatar-9.png', '/images/avatar-9.png'),
       ('avatar-10.png', '/images/avatar-10.png')
;

-- Тестові користувачі
INSERT INTO users (username, password, email, is_activated, image_id)
VALUES ('misha', '$2b$10$aNs79TF/NXKjqdma3NMinOW0AmDFmHcSQosn0sQI92sQzq3rf4yaC', 'turictscol40@gmail.com', true, 1),
       ('sasha', '$2b$10$aNs79TF/NXKjqdma3NMinOW0AmDFmHcSQosn0sQI92sQzq3rf4yaC', 'afgfduzbf@yomail.info', true, 1),
       ('mirko', '$2b$10$aNs79TF/NXKjqdma3NMinOW0AmDFmHcSQosn0sQI92sQzq3rf4yaC', 'knwkmwfqf@emlpro.com', true, 40),
       ('pili', '$2b$10$aNs79TF/NXKjqdma3NMinOW0AmDFmHcSQosn0sQI92sQzq3rf4yaC', 'fya2k7p6@flymail.tk', true, 41),
       ('lili', '$2b$10$aNs79TF/NXKjqdma3NMinOW0AmDFmHcSQosn0sQI92sQzq3rf4yaC', 'ayccneirg@emltmp.com', true, 42),
       ('marta', '$2b$10$aNs79TF/NXKjqdma3NMinOW0AmDFmHcSQosn0sQI92sQzq3rf4yaC', 'afqfonfodfbvjo@dropmail.me', true,
        43),
       ('ciel', '$2b$10$aNs79TF/NXKjqdma3NMinOW0AmDFmHcSQosn0sQI92sQzq3rf4yaC', 'qkbdktknf@emlhub.com', true, 44),
       ('landon', '$2b$10$aNs79TF/NXKjqdma3NMinOW0AmDFmHcSQosn0sQI92sQzq3rf4yaC', 'j1jf0j2x@spymail.one', true, 45),
       ('matia', '$2b$10$aNs79TF/NXKjqdma3NMinOW0AmDFmHcSQosn0sQI92sQzq3rf4yaC', 'j1jf3c7g@spymail.one', true, 46),
       ('alma', '$2b$10$aNs79TF/NXKjqdma3NMinOW0AmDFmHcSQosn0sQI92sQzq3rf4yaC', 'iebymwfqf@emlpro.com', true, 47),
       ('eliora', '$2b$10$aNs79TF/NXKjqdma3NMinOW0AmDFmHcSQosn0sQI92sQzq3rf4yaC', 'fpfhktknf@emlhub.com', true, 48),
       ('catrine', '$2b$10$aNs79TF/NXKjqdma3NMinOW0AmDFmHcSQosn0sQI92sQzq3rf4yaC', 'j1jf745x@spymail.one', true, 49),
       ('brandon', '$2b$10$aNs79TF/NXKjqdma3NMinOW0AmDFmHcSQosn0sQI92sQzq3rf4yaC', 'd0dod1wedak3@10mail.xyz', true, 1);


-- Тестові продавці
INSERT INTO sellers (user_id, full_name, social_media, status_id, address, description, phone_number)
VALUES (3, 'Іван Петренко', 'instagram:IvanPetrenko', 1, 'вул. Головна 123, Місто',
        'Досвідчений продавець, спеціалізується на антикваріаті.',
        '123-456-7890'),
       (4, 'Олена Смирнова', 'twitter:OlenaSmirnova', 3, 'вул. Ялинкова 456, Селище',
        'Пристрасно захоплюється вінтажними колекціями.',
        '234-567-8901'),
       (5, 'Лілія Лелека', 'instagram:BohdanIvanov', 2, 'вул. Дубова 789, Село',
        'Поціновувач мистецтва з акцентом на сучасний живопис.', '345-678-9012'),
       (6, 'Іван Браун', 'twitter:AnastasiaBraun', 2, 'вул. Соснова 987, Передмістя',
        'Відданий продавець рідкісних книг та рукописів.', '456-789-0123'),
       (7, 'Давид Вілсон', 'instagram:DavidWilson', 3, 'вул. Кедрова 321, Район',
        'Експерт у вінтажних прикрасах та коштовностях.', '567-890-1234'),
       (8, 'Софія Лі', 'twitter:SophiaLee', 1, 'вул. Березова 654, Село',
        'Спеціалізується на ручних ремеслах та кераміці.', '678-901-2345'),
       (9, 'Оксана Тар', 'instagram:MaximTaylor', 1, 'вул. Кленова 876, Ліс',
        'Пристрасний поціновувач класичних автомобілів.', '789-012-3456'),
       (10, 'Дмитро Дмитрович', 'twitter:OlgaBilaus', 2, 'вул. Дубова 543, Гори',
        'Збирає та продає вінтажні вінілові платівки.', '890-123-4567'),
       (11, 'Віталій Кларк', 'instagram:VitaliyClark', 3, 'вул. Ялинкова 234, Долина',
        'Пристрасний колекціонер рідкісних монет та валюти.', '901-234-5678'),
       (12, 'Віталік Бакер', 'twitter:HannaBaker', 3, 'вул. Соснова 789, Каньйон',
        'Спеціалізується на реставрації антикварних меблів.', '012-345-6789'),
       (13, 'Богдан', 'instagram:Bohdan', 1, 'вул. Ялинкова 100, Селище', 'Пристрасний колекціонер вінтажних іграшок.',
        '345-678-9012');

-- Тестові адміни
INSERT INTO admins(login, password, user_id, secure_code)
VALUES ('admin', '$2b$13$bePi.8fnLfVCWxCXlza3jeK59BVJwtPIOKSBRGkFj/5a4WTF5Wbuq', 1,
        '$2b$13$GDajnJPNLmvJHr1khAia5eZeCPGITVcIc3LMqi5D3kWZsQn4pnN/S');

-- Тестові аукціони
INSERT INTO auctions (name, description, seller_id, status_id, img_id)
VALUES ('Чарівний Світ Ведмедів: Аукціон Дружніх Гігантів',
        'Аукціон з продажу величних бурих ведмедів та чарівних великих панд.', 3, 1, 2);

INSERT INTO lots (name, description, seller_id, auction_id, status_id, amount, bank_card_number, monobank_link)
VALUES ('Величний Бурий Ведмідь',
        'Величний Бурий Ведмідь з Карпатських гір. Його могутня статура та густе коричневе хутро роблять його справжнім королем лісу. Ідеальний для любителів природи та тих, хто бажає додати частинку дикої природи до своєї колекції. Вік - 5 років, вага - 350 кг. Цей ведмідь має спокійний характер і любить мед.',
        3, 1, 1, 12000, '5375 4141 0552 0125', 'https://send.monobank.ua/jar/dzBdJ3737'),
       ('Чарівна Велика Панда',
        'Чарівна Велика Панда, яка прибула до нас з гірських лісів Китаю. Її чорне та біле хутро створює унікальний контраст, а грайливий характер зробить її улюбленицею будь-якої родини. Вік - 3 роки, вага - 120 кг. Панда любить бамбук та гратися на свіжому повітрі.',
        3, 1, 2, 67000, '5375 4141 0552 0125', 'https://send.monobank.ua/jar/dzBdJ3737');

INSERT INTO lot_images(lot_id, img_id)
VALUES (1, 3),
       (1, 4),
       (1, 5),
       (2, 6),
       (2, 7),
       (2, 8);

INSERT INTO auctions (name, description, seller_id, status_id, img_id)
VALUES ('Футуристичний Авто-Аукціон: Машини Майбутнього',
        'Аукціон з продажу сучасних машин: зі здоровими колесами, літаючих машин та кіберпанк машин.', 4, 1, 9);

INSERT INTO lots (name, description, seller_id, auction_id, status_id, amount, bank_card_number, monobank_link)
VALUES ('Машина зі Здоровими Колесами',
        'Надійна та потужна машина зі здоровими колесами, готова до будь-яких доріг. Ідеально підходить для подорожей та щоденного використання. Машина оснащена сучасними технологіями для забезпечення безпеки та комфорту. Вік - 2 роки, пробіг - 30,000 км. Відмінний стан, жодних механічних пошкоджень.',
        4, 2, 1, 190000, '5375 4141 0552 0125', 'https://send.monobank.ua/jar/dzBdJ3737'),
       ('Літаюча Машина SkyRider',
        'Літаюча Машина SkyRider - втілення футуристичних мрій. Ця машина здатна піднятися в повітря та оминути затори на дорогах. Оснащена потужними двигунами та сучасною системою навігації. Вік - 1 рік, пробіг - 10,000 км (включаючи польоти). Відмінний стан, повний технічний огляд пройдено.',
        4, 2, 3, 350000, '5375 4141 0552 0125', 'https://send.monobank.ua/jar/dzBdJ3737'),
       ('Кіберпанк Машина NeonBlade',
        'Кіберпанк Машина NeonBlade - стильний автомобіль для любителів кіберпанк-культури. Оригінальний дизайн, яскраві неонові вогні та потужний двигун роблять цю машину унікальною. Вік - 3 роки, пробіг - 50,000 км. Відмінний стан, повністю функціональна електроніка та механіка.',
        4, 2, 1, 1500000, '5375 4141 0552 0125', 'https://send.monobank.ua/jar/dzBdJ3737');

INSERT INTO lot_images(lot_id, img_id)
VALUES (3, 10),
       (3, 11),
       (3, 12),
       (4, 13),
       (4, 14),
       (4, 15),
       (5, 16),
       (5, 17),
       (5, 18)
;

INSERT INTO auctions (name, description, seller_id, status_id, img_id)
VALUES ('Небесні Дива: Аукціон Рідкісних Птахів',
        'Аукціон з продажу рідкісних птахів, включаючи синю чарівну птицю та орла золотого.', 8, 1, 19);

INSERT INTO lots (name, description, seller_id, auction_id, status_id, amount, bank_card_number, monobank_link)
VALUES ('Синя Чарівна Птиця Azurea',
        'Синя Чарівна Птиця Azurea - рідкісний вид з тропічних лісів Південної Америки. Її яскраве синє пір`я та мелодійний спів зачаровують усіх, хто її бачить і чує. Птиця має миролюбний характер і легко приручається. Вік - 2 роки. Підходить для тримання вдома або в спеціальних умовах зоологічних садів.',
        8, 3, 1, 52000, '5375 4141 0552 0125', 'https://send.monobank.ua/jar/dzBdJ3737'),
       ('Орел Золотий',
        'Орел Золотий - могутній хижак з величними крилами та гострим зором. Його золотисте пір`я виблискує на сонці, надаючи йому царського вигляду. Орел Золотий - символ сили та свободи, ідеально підходить для шанувальників дикої природи. Вік - 5 років. Потребує простору для польотів та спеціальних умов утримання.',
        8, 3, 1, 90000, '5375 4141 0552 0125', 'https://send.monobank.ua/jar/dzBdJ3737');

INSERT INTO lot_images(lot_id, img_id)
VALUES (6, 20),
       (6, 21),
       (6, 22),
       (7, 23),
       (7, 24),
       (7, 25);

INSERT INTO auctions (name, description, seller_id, status_id, img_id)
VALUES ('Смакові Дива: Аукціон Гурманів',
        'Аукціон з продажу чарівного різнокольорового морозива та соковитого бургера.', 8, 1, 26);

INSERT INTO lots (name, description, seller_id, auction_id, status_id, amount, bank_card_number, monobank_link)
VALUES ('Чарівне Різнокольорове Морозиво',
        'Чарівне Різнокольорове Морозиво - неймовірна насолода для всіх поціновувачів солодощів. Це морозиво вражає своєю яскравістю та різноманіттям смаків. Кожен шар має свій унікальний смак: від класичного ванільного до екзотичного манго. Ідеальне для свят та особливих подій. Подається в красивому скляному посуді, який підкреслює його кольори.',
        8, 4, 1, 700, '5375 4141 0552 0125', 'https://send.monobank.ua/jar/dzBdJ3737'),
       ('Соковитий Бургер Deluxe',
        'Соковитий Бургер Deluxe - справжнє задоволення для м`ясних гурманів. Свіжа булочка, соковита яловича котлета, хрусткі овочі та секретний соус роблять цей бургер незабутнім. Всі інгредієнти - найвищої якості, ретельно відібрані для створення ідеального смаку. Ідеальний вибір для барбекю-вечірок або просто для задоволення голоду.',
        8, 4, 1, 1200, '5375 4141 0552 0125', 'https://send.monobank.ua/jar/dzBdJ3737');

INSERT INTO lot_images(lot_id, img_id)
VALUES (8, 27),
       (8, 28),
       (8, 29),
       (9, 30),
       (9, 31),
       (9, 32);

INSERT INTO auctions (name, description, seller_id, status_id, img_id)
VALUES ('Магічні Смаколики: Аукціон Чудес Природи', 'Аукціон з продажу магічних фруктів та магічного червоного чаю.', 4,
        1, 33);

INSERT INTO lots (name, description, seller_id, auction_id, status_id, amount, bank_card_number, monobank_link)
VALUES ('Магічні Фрукти Енчантра',
        'Магічні Фрукти Енчантра - унікальні плоди, що володіють чарівними властивостями. Вони не тільки мають незвичайні смаки, але й надають енергії та покращують настрій. Кожен фрукт має свій особливий колір та смак, наповнений магією природи. Ідеальні для особливих моментів або як подарунок. Вік - свіжі, зібрані цього сезону.',
        4, 5, 3, 888, '5375 4141 0552 0125', 'https://send.monobank.ua/jar/dzBdJ3737'),
       ('Магічний Червоний Чай Рубі',
        'Магічний Червоний Чай Рубі - еліксир, що дарує бадьорість та спокій одночасно. Цей чай має насичений рубіновий колір та унікальний аромат, який зачаровує з першого ковтка. Виготовлений за стародавнім рецептом з використанням чарівних трав та квітів. Ідеальний для медитації та релаксації. Пакування - елегантна скляна банка.',
        4, 5, 1, 777, '5375 4141 0552 0125', 'https://send.monobank.ua/jar/dzBdJ3737');

INSERT INTO lot_images(lot_id, img_id)
VALUES (10, 34),
       (10, 35),
       (10, 36),
       (11, 37),
       (11, 38),
       (11, 39);

INSERT INTO lot_bet(lot_id, user_id, amount)
VALUES (10, 5, 888),
       (10, null, 900),
       (10, 9, 2222)
;

-- END DATA
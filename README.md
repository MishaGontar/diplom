# Вебзастосунок для менеджменту офлайн-аукціонів

#### (Дипломний проєкт)

### Відео огляд:

[![Огляд проєкту на YouTube](https://img.youtube.com/vi/LwDmhNnPdqQ/0.jpg)](https://www.youtube.com/watch?v=LwDmhNnPdqQ)

## Опис проєкту

Цей проєкт був створений для управління офлайн-аукціонами. Він дозволяє користувачам організовувати та брати участь в
аукціонах, здійснювати ставки в режимі реального часу, а також надає функціонал для адміністрування аукціонів, таких як
додавання нових лотів, керування учасниками та перегляд історії ставок.

## Особливості:

- ⚙️ **Керування аукціонами та лотами**
- 🔐 **Можливість реєстрації та входу користувачів**
- 🛠️ **Створення та редагування аукціонів для адміністратора**
- 💸 **Ставки в режимі реального часу**
- 📊 **Перегляд історії ставок для кожного лота**
- 🏆 **Повідомлення про завершення аукціону та переможця**

## Технології:

- **Back-End:** NestJS, Prisma, Socket.IO
- **Front-End:** React, NextUI, Tailwind
- **База даних:** PostgreSQL
- **Аутентифікація:** JWT

## Запуск проекту локально

### Вимоги

- Node.js v16+

### Інструкція

1. Клонуйте репозиторій:
   ```bash
   git clone https://github.com/MishaGontar/auction-front

2. Встановіть залежності:
   ```bash
   npm install

3. Налаштуйте .env файл з усіма необхідними змінними середовища:
    - `VITE_SERVER_URL`: URL [серверної](https://github.com/MishaGontar/auction-back) частини, який використовується для
      взаємодії з API. (Перед початком налаштуйте [сервер](https://github.com/MishaGontar/auction-back))
    - `CYPRESS_BASE_URL`: Базовий URL для тестів Cypress. Це має бути URL, на якому працює ваш фронтенд.
    - `CYPRESS_MAILOSAUR_API_KEY`: API ключ для Mailosaur, який використовується для тестування електронної пошти.
    - `CYPRESS_MAILOSAUR_SERVER_ID`: Ідентифікатор сервера Mailosaur.
    - `CYPRESS_EMAIL`: Електронна адреса, яка використовується для тестування.
    - `CYPRESS_USERNAME`: Ім'я користувача для авторизації під час тестування.
    - `CYPRESS_PASSWORD`: Пароль користувача для авторизації під час тестування.
    - `CYPRESS_AUTH_TOKEN`: Токен авторизації для автоматизованих тестів.
    - `CYPRESS_ADMIN_TOKEN`: Токен адміністратора для тестування функціоналу, що потребує прав адміністратора.

4. Запустіть сервер:
   ```bash
   npm run start

## Можливі покращення

- Зробити систему рейтингів для учасників.
- Додати можливість спілкування між учасниками через чат.
- Додати можливість оплачувати на сайті.

## Скріншоти

| Назва                                         | Зображення                                                                                                                                    |
|-----------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| Авторизація                                   | ![Авторизація](./auction-front/documentation/Авторизація.png)                                                                                 |
| Вся інформація про аукціон                    | ![Вся інформація про аукціон](./auction-front/documentation/Вся%20інформація%20про%20аукціон.jpg)                                             |
| Вся інформація про лот                        | ![Вся інформація про лот](./auction-front/documentation/Вся%20інформація%20про%20лот.jpg)                                                     |
| Всі заяви, щоб стати продавцем                | ![Всі заяви, щоб стати продавцем](./auction-front/documentation/Всі%20заяви%20щоб%20стати%20продавцем.jpg)                                    |
| Модальна форма створення лоту                 | ![Модальна форма створення лоту](./auction-front/documentation/Модальної%20форма%20створення%20лоту.jpg)                                      |
| Особистий профіль користувача                 | ![Особистий профіль користувача](./auction-front/documentation/Особистий%20профіль%20користувача.jpg)                                         |
| Редагування особистого профілю користувача    | ![Редагування особистого профілю користувача](./auction-front/documentation/Редагування%20особистого%20профілю%20користувача.jpg)             |
| Реєстрація                                    | ![Реєстрація](./auction-front/documentation/Реєстрація.png)                                                                                   |
| Список аукціонів                              | ![Список аукціонів](./auction-front/documentation/Список%20аукціонів.jpg)                                                                     |
| Список заблокованих користувачів для продавця | ![Список заблокованих користувачів для продавця](./auction-front/documentation/Список%20заблокованих%20користувачів%20для%20продавця.jpg)     |
| Сторінка лота для переможця лоту              | ![Сторінка лота для переможця лоту](./auction-front/documentation/Сторінка%20лота%20для%20переможця%20лоту.jpg)                               |
| Сторінка лота після натискання дії для ставки | ![Сторінка лота після натискання дії для ставки](./auction-front/documentation/Сторінка%20лота%20після%20натискання%20дії%20для%20ставки.jpg) |
| Сторінка лота після ставки за користувача     | ![Сторінка лота після ставки за користувача](./auction-front/documentation/Сторінка%20лота%20після%20ставки%20за%20користувача.jpg)           |
| Сторінка лота після ставки за продавця        | ![Сторінка лота після ставки за продавця](./auction-front/documentation/Сторінка%20лота%20після%20ставки%20за%20продавця.jpg)                 |
| Сторінка списку всіх користувачів             | ![Сторінка списку всіх користувачів](./auction-front/documentation/Сторінка%20списку%20всіх%20користувачів.jpg)                               |
| Сторінка списку всіх лотів та аукціонів       | ![Сторінка списку всіх лотів та аукціонів](./auction-front/documentation/Сторінка%20списку%20всіх%20лотів%20та%20аукціонів.jpg)               |
| Форма двофакторної автентифікації             | ![Форма двофакторної автентифікації](./auction-front/documentation/Форма%20двофакторної%20автентифікації.jpg)                                 |
| Форма для редагування лоту                    | ![Форма для редагування лоту](./auction-front/documentation/Форма%20для%20редагування%20лоту.jpg)                                             |
| Форма редагування аукціону                    | ![Форма редагування аукціону](./auction-front/documentation/форма%20редагування%20ауціону.png)                                                |
| Форма створення аукціону                      | ![Форма створення аукціону](./auction-front/documentation/форма%20створення%20ауціону.png)                                                    |
| Інформація про аукціон за продавця            | ![Інформація про аукціон за продавця](./auction-front/documentation/інформацію%20про%20аукціон%20за%20продавця.png)                           |
| Інформація заяви нового продавця              | ![Інформація заяви нового продавця](./auction-front/documentation/Інформація%20заяви%20нового%20продавця.jpg)                                 |
| Інформація про аукціон                        | ![Інформація про аукціон](./auction-front/documentation/Інформація%20про%20аукціон.jpg)                                                       |
| Інформація про продавця за власника           | ![Інформація про продавця за власника](./auction-front/documentation/Інформація%20про%20продавця%20за%20власника..jpg)                        |
| Інформація про продавця за користувача        | ![Інформація про продавця за користувача](./auction-front/documentation/Інформація%20про%20продавця%20за%20користувача.jpg)                   |
| Інформації про лот за власника                | ![Інформації про лот за власника](./auction-front/documentation/Інформації%20про%20лот%20за%20власника.jpg)                                   |
| Інформації про лот за гостя                   | ![Інформації про лот за гостя](./auction-front/documentation/Інформації%20про%20лот%20за%20гостя.jpg)                                         |
| Інформації про лот за користувача             | ![Інформації про лот за користувача](./auction-front/documentation/Інформації%20про%20лот%20за%20користувача.jpg)                             |

# Налаштування проекту для бекенду

Додайте документ `.env` , що описує змінні середовища. Ці змінні використовуються для автентифікації, конфігурації
проєкту, налаштування електронної пошти та підключення до бази даних.

## Автентифікація

- `TOKEN_SECRET`: Секретний ключ для генерації та перевірки токенів.
- `TOKEN_ADMIN_SECRET`: Секретний ключ спеціально для генерації та перевірки адмінських токенів.

## Конфігурація Проєкту

- `AUTH_SALT_ROUND`: Кількість раундів соління для хешування паролів. Більше число означає більш безпечне хешування, але
  повільнішу роботу. За замовчуванням значення 10.

## Налаштування Frontend

- `PRODUCT_NAME`: Назва продукту.

## Налаштування Gmail

- `GMAIL_APP_EMAIL`: Email акаунту Gmail, який використовується для відправки листів з додатку.
- `GMAIL_APP_PASSWORD`: Пароль для додатку Gmail. Це не звичайний пароль акаунту, а специфічний пароль для додатку,
  згенерований у налаштуваннях Google Account.

## Налаштування Бази Даних

- `POSTGRES_USER`: Ім'я користувача для підключення до PostgreSQL бази даних.
- `POSTGRES_HOST`: Ім'я хоста, де запущена база даних PostgreSQL. За замовчуванням 'localhost'.
- `POSTGRES_DB`: Назва бази даних PostgreSQL.
- `POSTGRES_PASSWORD`: Пароль для користувача PostgreSQL.
- `POSTGRES_PORT`: Порт, на якому слухає база даних PostgreSQL. За замовчуванням 5432.
- `SET_UP_SQL_SCRIPT`: Булевий прапор для вказівки на необхідність налаштування SQL скрипту під час ініціалізації. За
  замовчуванням true.

### Опціонально - високий пріоритет

- `POSTGRES_URL`: Повний URL для підключення до бази даних PostgreSQL. Це може бути використано як альтернатива для
  окремого вказання кожного компонента (користувач, хост, база даних, пароль, порт). Приклад:
  `postgres://username:password@host:port/database`.

Переконайтеся, що ці облікові дані захищені, і не публікуйте цей файл у відкритих репозиторіях. Використовуйте значення,
специфічні для середовища, у ваших розробницьких, тестових та виробничих середовищах для забезпечення безпеки та
правильної конфігурації.

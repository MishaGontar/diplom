# Використовуємо офіційний образ Node.js для збірки
FROM node:18

# Встановлюємо робочу директорію в контейнері
WORKDIR /app

# Копіюємо файли package.json та package-lock.json
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо решту файлів
COPY . .

# Встановлюємо bcrypt під час побудови контейнера
RUN npm rebuild bcrypt --build-from-source

# Вказуємо порт, на якому працює наш сервер Express.js
EXPOSE 4000

# Команда для запуску сервера
CMD ["npm", "start"]

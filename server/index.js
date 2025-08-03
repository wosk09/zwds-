const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Путь к собранному фронтенду (например, Vite)
app.use(express.static(path.join(__dirname, '..', 'dist')));

// Фоллбэк — всегда отдавать index.html для SPA
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

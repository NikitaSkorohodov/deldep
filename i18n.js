const i18n = require('i18n');
const path = require('path');

i18n.configure({
  locales: ['en', 'ru'], // Список поддерживаемых языков
  directory: path.join(__dirname, 'locales'), // Папка для файлов перевода
  defaultLocale: 'en', // Язык по умолчанию
  cookie: 'locale', // Имя cookie для хранения выбранного языка
  queryParameter: 'lang', // Параметр URL для смены языка
  autoReload: true,
  updateFiles: false,
  syncFiles: true
});

module.exports = i18n;

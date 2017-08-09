// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();
const schedule = require('node-schedule');
const keystone = require('keystone');
// const i18n = require('i18n');
// const cons = require('consolidate');
const mongoose = require('mongoose');

keystone.init({
  name: 'toirus-cp',
  brand: 'ТОИРУС',
  back: '/me',

  port: '3000',
  host: '127.0.0.1',
  mongo: 'mongodb://localhost/toir-dev',
  'mongo options': { server: { keepAlive: 1 }},
  sass: 'public',
  static: 'public',
  favicon: 'public/favicon.ico',
  'signin logo': '../images/toir.png',
  title: 'Панель управления услугами системы ТОиРУС',

  emails: 'templates/emails',

  'role model': 'Role',
  'permission model': 'Permission',

  views: 'templates/views',
  'view engine': 'pug',
// 'custom engine': require('pug').__express,
// 'custom engine': cons.nunjucks,

  'auto update': true,
  session: true,
  'session store': 'mongo',
  'cookie secret': process.env.COOKIE_SECRET,
  'mandrill api key': process.env.MANDRILL_KEY,
  'mandrill username': process.env.MANDRILL_USERNAME,
  auth: true,
  'user model': 'User',
});

keystone.import('models');

keystone.set('locals', {
  _: require('lodash'),
  env: keystone.get('env'),
  utils: keystone.utils,
  editable: keystone.content.editable,
});

keystone.set('routes', require('./routes'));

keystone.set('nav', {
  Пользователи: 'users',
  Клиенты: 'clients',
  Запросы: 'tickets',
  Журнал: 'logs',
  Услуги: 'services',
  Базы: 'databases',
  Хосты: 'hosts',
  Транзакции: 'payments',
  Бэкапы: 'backups',
  Настройки: { Методы: 'methods' },
});

keystone.set('email locals', {
  utils: keystone.utils,
  host: (function () {
    if (keystone.get('env') === 'staging') return 'http://127.0.0.1';
    if (keystone.get('env') === 'production') return 'http://cp.toirus.ru';
    return (keystone.get('host') || 'http://localhost:') + (keystone.get('port') || '3000');
  }()),
});

let tools = require('./routes/tools/communicate');
var j = schedule.scheduleJob('0 * * * *', function(){
  tools.updateServices();  
});

keystone.start();

module.exports = keystone;

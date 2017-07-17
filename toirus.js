// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();
// 
// Require keystone
var keystone = require('keystone'),
    i18n = require('i18n');
var cons = require('consolidate');
var nunjucks = require('nunjucks');

keystone.init({
	'name': 'toirus-cp',
	'brand': 'ТОИРУС',
	'port': '3000',
	'host': '127.0.0.1',
	'mongo': 'mongodb://localhost/toir-dev',

	'sass': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'signin logo': '../images/toir.png',
	'title': 'Панель управления услугами системы ТОиРУС',

	'role model': 'Role',				// use whatever name for the role model
	'permission model': 'Permission',        // use whatever name for the permission model

	'views': 'templates/views',
	'view engine': 'pug',
//	'custom engine': require('pug').__express,
//	'custom engine': cons.nunjucks,

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
});
keystone.import('models');
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

// Configure i18n
/*
i18n.configure({
    locales:['en', 'ru'],
    defaultLocale: 'ru',
    directory: __dirname + '/locales'
});*/


keystone.set('routes', require('./routes'));

keystone.set('nav', {
	Пользователи: 'users',
	Клиенты: 'clients',
	Запросы: 'enquiries',
	Журнал: 'logs',
	Услуги: 'services',
	Базы: 'databases',
	Хосты: 'hosts',
	Транзакции: 'payments',
	Бэкапы: 'backups',
	Настройки:  { 	Методы: 'methods', }
});

keystone.set('email locals', {
	utils: keystone.utils,
	host: (function() {
		if (keystone.get('env') === 'staging') return 'http://127.0.0.1';
		if (keystone.get('env') === 'production') return 'http://cp.toirus.ru';
		return (keystone.get('host') || 'http://localhost:') + (keystone.get('port') || '3000');
	})()
});

keystone.start();

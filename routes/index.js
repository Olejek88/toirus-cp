//var keystone = require('keystone');
//var middleware = require('./middleware');
//var importRoutes = keystone.importer(__dirname);

var _= require('underscore'),
    keystone = require('keystone'),
    middleware = require('./middleware'),
    importRoutes = keystone.importer(__dirname);

// Add-in i18n support
//keystone.pre('routes', i18n.init);
//keystone.pre('routes', middleware.detectLang);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.get('/', routes.views.index);
	app.all('/contact', routes.views.contact);
//	app.all('/signin', routes.views.signin);
//	app.get('/signin', routes.views.signin);
};
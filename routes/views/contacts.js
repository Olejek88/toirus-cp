const keystone = require('keystone');

exports = module.exports = function (req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;

	// Set locals
	locals.section = 'contact';

	view.render('site/contacts');
};

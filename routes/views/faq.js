const keystone = require('keystone');

module.exports = function a(req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;

	// Set locals
	locals.section = 'faq';
	view.render('site/faq');
};
exports = module.exports;

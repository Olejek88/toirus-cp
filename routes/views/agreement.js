const keystone = require('keystone');

module.exports = function a(req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;

	// Set locals
	locals.section = 'agreement';
	view.render('site/agreement');
};
exports = module.exports;

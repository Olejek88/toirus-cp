const keystone = require('keystone');

exports = module.exports = function (req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;

	// Set locals
	locals.section = 'agreement';
	view.render('site/agreement');
};

const keystone = require('keystone');

module.exports = function a(req, res) {
	const locals = res.locals;

	locals.section = 'session';

	keystone.session.signout(req, res, () => {
		res.redirect('/');
	});
};
exports = module.exports;

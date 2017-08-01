const keystone = require('keystone');

exports = module.exports = function (req, res) {
	let view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'session';

	keystone.session.signout(req, res, () => {
		res.redirect('/');
	});
};

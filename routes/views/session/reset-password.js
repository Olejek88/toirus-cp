const keystone = require('keystone');

const User = keystone.list('User');

module.exports = function a(req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;

	view.on('init', (next) => {
		User.model.findOne().where('resetPasswordKey', req.params.key).exec((err, user) => {
			if (err) return next(err);
			if (!user) {
				req.flash('error', "Sorry, that reset password key isn't valid.");
				return res.redirect('/forgot-password');
			}
			locals.found = user;
			return next();
		});
	});

	view.on('post', { action: 'reset-password' }, (next) => {
		if (!req.body.password || !req.body.password_confirm) {
			req.flash('error', 'Пожалйуста, введите и подтвердите свой пароль.');
			return next();
		}

		if (req.body.password !== req.body.password_confirm) {
			req.flash('error', 'Пожалуйста проверьте, что оба пароля совпадают.');
			return next();
		}

		locals.found.password = req.body.password;
		locals.found.resetPasswordKey = '';
		locals.found.save((err) => {
			if (err) return next(err);
			req.flash('success', 'Ваш пароль сброшен, пожалуйста залогиньтесь.');
			res.redirect('/signin');
			return next();
		});
		return next();
	});

	view.render('session/reset-password');
};
exports = module.exports;

const keystone = require('keystone');

const User = keystone.list('User');

module.exports = function a(req, res) {
	const view = new keystone.View(req, res);

	view.on('post', { action: 'forgot-password' }, (next) => {
		if (!req.body.email) {
			req.flash('error', 'Пожалуйста введите е-мэйл адрес.');
			return next();
		}

		User.model.findOne().where('email', req.body.email).exec((err, user) => {
			if (err) return next(err);
			if (!user) {
				req.flash('error', 'Извините, но мы не можем найти данный адрес.');
				return next();
			}
			user.resetPassword((err2) => {
				// if (err) return next(err);
				if (err2) {
					console.error('===== ERROR sending reset password email =====');
					console.error(err);
					req.flash('error', 'Error sending reset password email. Please let us know about this error');
					return next();
				}
				req.flash('success', 'We have emailed you a link to reset your password');
				return res.redirect('/signin');
			});
			return next();
		});
		return next();
	});

	return view.render('session/forgot-password');
};
exports = module.exports;

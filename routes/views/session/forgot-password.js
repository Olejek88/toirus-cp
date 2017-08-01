const keystone = require('keystone');

const User = keystone.list('User');

exports = module.exports = function (req, res) {
	let view = new keystone.View(req, res),
		locals = res.locals;

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
			user.resetPassword((err) => {
				// if (err) return next(err);
				if (err) {
					console.error('===== ERROR sending reset password email =====');
					console.error(err);
					req.flash('error', 'Error sending reset password email. Please <a href="https://github.com/JedWatson/sydjs-site/issues" class="alert-link">let&nbsp;us&nbsp;know</a> about this error');
					next();
				} else {
					req.flash('success', 'We have emailed you a link to reset your password');
					res.redirect('/signin');
				}
			});
		});
	});

	view.render('session/forgot-password');
};

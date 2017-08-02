const keystone = require('keystone');

module.exports = function a(req, res) {
	if (req.user) {
		return res.redirect(req.cookies.target || '/me');
	}

	const view = new keystone.View(req, res);
	const locals = res.locals;

	locals.section = 'session';
	locals.form = req.body;

	view.on('post', { action: 'signin' }, (next) => {
		if (!req.body.email || !req.body.password) {
			req.flash('error', 'Пожалуйста введите е-мэйл и пароль.');
			return next();
		}

		const onSuccess = function os() {
			if (req.body.target && !/join|signin/.test(req.body.target)) {
				console.log(`[signin] - Set target as [${req.body.target}].`);
				return res.redirect(req.body.target);
			}
			return res.redirect('/me');
		};

		const onFail = function of() {
			req.flash('error', 'Имя пользователя или пароль не найдены, попробуйте еще раз.');
			return next();
		};

		keystone.session.signin({
			email: req.body.email,
			password: req.body.password,
		}, req, res, onSuccess, onFail);
	});

	return view.render('session/signin');
};
exports = module.exports;

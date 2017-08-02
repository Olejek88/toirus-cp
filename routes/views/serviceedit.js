const keystone = require('keystone');

module.exports = function a(req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;

	locals.section = 'serviceedit';
	locals.page.title = 'ТОиРУС настройки сервиса';

	view.on('post', { action: 'service.details' }, (next) => {
		req.user.getUpdateHandler(req).process(req.body, {
			fields: 'name, description, users_num, tags_num',
			flashErrors: true,
		}, (err) => {
			if (err) {
				return next();
			}
			req.flash('success', 'Изменения сохранены');
			return next();
		});
	});

	view.render('site/serviceedit');
};
exports = module.exports;

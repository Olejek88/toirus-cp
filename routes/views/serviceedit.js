const keystone = require('keystone');
const _ = require('lodash');
const moment = require('moment');

exports = module.exports = function (req, res) {
	let view = new keystone.View(req, res),
		locals = res.locals;

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

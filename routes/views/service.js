const keystone = require('keystone');
// const _ = require('lodash');
// const moment = require('moment');

const Service = keystone.list('Service');
const Log = keystone.list('Log');
const ObjectID = require('mongodb').ObjectID;

module.exports = function a(req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;

	locals.section = 'service';
	locals.page.title = 'ТОиРУС настройки сервиса';

	// load the service

	view.on('init', (next) => {
		console.log('init');
		Service.model.findOne()
			.where('_id', new ObjectID(req.params.service))
			.exec((err, service) => {
				if (err) return res.err(err);
				if (!service) return res.notfound('Сервис не найден');
				console.log(service.name);
				locals.service = service;
				return next();
			});
	});


	view.on('post', { action: 'service.details' }, (next) => {
		Service.model.findOne()
			.where('_id', new ObjectID(req.params.service))
			.exec((err, service) => {
				if (err) return res.err(err);
				if (!service) return res.notfound('Сервис не найден');
				service.getUpdateHandler(req).process(req.body, {
					fields: 'name, description, users_num, tags_num',
					flashErrors: true,
				}, (err2) => {
					if (err2) {
						return next();
					}
					req.flash('success', 'Изменения сохранены');
					return res.redirect('/me');
				});
				return next();
			});
	});

	view.on('post', { action: 'service.delete' }, () => {
		console.log('post');
		Service.model.findOne()
			.where('_id', new ObjectID(req.params.service))
			.remove((err) => {
				new Log.model({
					description: `Пользователем ${locals.user.name} удалена услуга ${req.body.name}`,
					user: locals.user,
				}).save((err2) => {
					if (err2) { console.log(err); }
				});

				return res.redirect('/services');
			});
	});

	view.render('site/service');
};
exports = module.exports;

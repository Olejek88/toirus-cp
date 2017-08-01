const keystone = require('keystone');
const _ = require('lodash');
const moment = require('moment');

const Service = keystone.list('Service');
const Log = keystone.list('Log');
const ObjectID = require('mongodb').ObjectID;

exports = module.exports = function (req, res) {
	let view = new keystone.View(req, res),
		locals = res.locals;

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
				next();
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
				}, (err) => {
	    			if (err) {
					return next();
	    			}
					req.flash('success', 'Изменения сохранены');
				// return next();
					return res.redirect('/me');
				});
			});
	});

	view.on('post', { action: 'service.delete' }, (next) => {
		console.log('post');
		Service.model.findOne()
			.where('_id', new ObjectID(req.params.service))
			.remove((err) => {
				new Log.model({
					description: `Пользователем ${locals.user.name} удалена услуга `,
					user: locals.user,
				}).save((err) => {
					if (err) { console.log(err); }
				});
				return res.redirect('/services');
			});
	});

	view.render('site/service');
};

const keystone = require('keystone');
// const _ = require('lodash');

const Log = keystone.list('Log');
const Client = keystone.list('Client');
const User = keystone.list('User');

const Method = keystone.list('Method');
const ObjectID = require('mongodb').ObjectID;

module.exports = function a(req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;

	locals.section = 'clientnew';
	locals.page.title = 'Создание клиента ТОиРУС';

	view.on('post', { action: 'client.add' }, (next) => {
		console.log('add');

		const newClient = new Client.model({
			name: req.body.name,
			phone: req.body.phone,
			address: req.body.address,
			description: req.body.description,
			method: req.body.method,
			createdBy: locals.user,
		});

		const updater = newClient.getUpdateHandler(req, res, {
			errorMessage: 'Проблема с добавлением клиента ',
		});

		console.log('updater');
		updater.process(req.body, {
			flashErrors: true,
			logErrors: true,
			fields: 'name,phone,address,description,method',
		}, (err2) => {
			if (err2) {
				locals.validationErrors = err2.errors;
			} else {
				console.log('+log');

				User.model.findOne()
					.where('_id', new ObjectID(locals.user._id))
					.exec((err3, user) => {
						if (err3) return res.err(err3);
						if (user) {
							user.client = newClient;
							user.save((err4, user) => {
								 if (err4) {
									console.log(err4);
								}
								console.log('saved user: ', user);
							});
						}
					});

				const newLog = new Log.model({
					description: `Создан клиент ${req.body.name}`,
					user: locals.user,
				});

				newLog.save((err, user) => {
					if (err) { console.log(err); }
				});

				req.flash('success', 'Изменения сохранены');
				return res.redirect('/client');
			}
			return next();
		});
	});

	view.on('init', (next) => {
		Method.model.find()
		.exec((err, methods) => {
			if (err) return res.err(err);
			// console.log(methods);
			locals.methods = methods;
			return next();
		});
	});

	view.render('site/clientnew');
};
exports = module.exports;

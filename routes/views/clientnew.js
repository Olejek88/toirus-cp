const keystone = require('keystone');
const _ = require('lodash');

const Log = keystone.list('Log');
const Client = keystone.list('Client');
User = keystone.list('User');

const Method = keystone.list('Method');
const ObjectID = require('mongodb').ObjectID;

exports = module.exports = function (req, res) {
	let view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'clientnew';
	locals.page.title = 'Создание клиента ТОиРУС';

	const d = new Date();
	const year = d.getFullYear();
	const month = d.getMonth();
	const day = d.getDate();

	view.on('post', { action: 'client.add' }, (next) => {
		console.log('add');

		let newClient = new Client.model({
				name: req.body.name,
				phone: req.body.phone,
				address: req.body.address,
				description: req.body.description,
				method: req.body.method,
				createdBy: locals.user,
			}),

			updater = newClient.getUpdateHandler(req, res, {
				errorMessage: 'Проблема с добавлением клиента ',
			});

		console.log('updater');
		updater.process(req.body, {
			flashErrors: true,
			logErrors: true,
			fields: 'name,phone,address,description,method',
		}, (err) => {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				console.log('+log');

				User.model.findOne()
					.where('_id', new ObjectID(locals.user._id))
					.exec((err, user) => {
						if (err) return res.err(err);
						if (user) {
							user.client = newClient;
							user.save((err, user) => {
								 if (err) {
									console.log(err);
								}
								console.log('saved user: ', user);
							});
						}
					});

				if (err) {
					return next();
	    			}

				let newLog = new Log.model({
						description: `Создан клиент ${req.body.name}`,
						user: locals.user,
					}),
					updater = newClient.getUpdateHandler(req, res, {
						errorMessage: 'Проблема с добавлением в лог',
					});
				newLog.save((err, user) => {
					if (err) { console.log(err); }
				});

				req.flash('success', 'Изменения сохранены');
				return res.redirect('/client');
			}
			next();
		});
	});

	view.on('init', (next) => {
		Method.model.find()
		.exec((err, methods) => {
			if (err) return res.err(err);
			// console.log(methods);
			locals.methods = methods;
			next();
		});
	});

	view.render('site/clientnew');
};

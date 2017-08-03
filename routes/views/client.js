const keystone = require('keystone');
// const _ = require('lodash');
// const moment = require('moment');

const Client = keystone.list('Client');
const Method = keystone.list('Method');
const ObjectID = require('mongodb').ObjectID;

const Log = keystone.list('Log');

module.exports = function a(req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;

	locals.section = 'client';
	locals.page.title = 'ТОиРУС настройки клиента';

	// load client

	view.on('init', (next) => {
		console.log(locals.user.client);
		Client.model.findOne()
			.where('_id', new ObjectID(req.params.client))
			.exec((err, client) => {
				if (err) return res.err(err);
				console.log(client);
				if (!client) return res.redirect('/clientnew');
				locals.client = client;
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

	view.on('post', { action: 'client.details' }, (next) => {
		console.log(req.body);
		Client.model.findOne()
			.where('_id', new ObjectID(req.params.client))
			.exec((err, client) => {
				if (err) return res.err(err);
				if (!client) return res.notfound('Клиент не найден');
				client.getUpdateHandler(req).process(req.body, {
					fields: 'name, address, phone, description, method',
					flashErrors: true,
				}, (err2) => {
					if (err2) {
						return next();
					}
					req.flash('success', 'Изменения сохранены');
					return res.redirect('/clients');
				});
			});
	});

	view.on('post', { action: 'client.delete' }, () => {
		Client.model.findOne()
			.where('_id', new ObjectID(req.params.client))
			.remove((err) => {
				new Log.model({
					description: `Пользователем ${locals.user.name} удален клиент ${req.body.name}`,
					user: locals.user,
				}).save((err2) => {
					if (err2) { console.log(err); }
				});
				return res.redirect('/clients');
			});
	});

	view.render('site/client');
};
exports = module.exports;

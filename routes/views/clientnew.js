const keystone = require('keystone');
// const _ = require('lodash');

const Log = keystone.list('Log');
const Client = keystone.list('Client');
// const User = keystone.list('User');

const Method = keystone.list('Method');
// const ObjectID = require('mongodb').ObjectID;

module.exports = function a(req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;

	locals.section = 'clientnew';
	locals.page.title = 'Создание клиента ТОиРУС';

	view.on('post', { action: 'client.add' }, (next) => {
		let clientId = 1;
		Client.model.find().sort({ clientId: -1 })
			.exec((err2, data) => {
				if (data[0] && data[0].clientId) { clientId = data[0].clientId + 1; }
				const newClient = new Client.model({
					clientId,
					name: req.body.name,
					phone: req.body.phone,
					address: req.body.address,
					description: req.body.description,
					method: req.body.method,
					createdBy: locals.user,
					user: locals.user,
				});

				newClient.save((err) => {
					if (err) { console.log(err); }
				});

				const newLog = new Log.model({
					description: `Создан клиент ${req.body.name}`,
					user: locals.user,
				});

				newLog.save((err) => {
					if (err) { console.log(err); }
				});

				req.flash('success', 'Изменения сохранены');
				return res.redirect('/clients');
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

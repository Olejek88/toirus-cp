const keystone = require('keystone');
const _ = require('lodash');
const request = require('request');

const Service = keystone.list('Service');
const Payment = keystone.list('Payment');
const Client = keystone.list('Client');
const Log = keystone.list('Log');
// const Method = keystone.list('Method');
const randomip = require('random-ip');
const ObjectID = require('mongodb').ObjectID;

module.exports = function a(req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;
	let method;

	locals.section = 'servicenew';
	locals.page.title = 'Заказ услуги ТОиРУС';

	const d = new Date();
	const year = d.getFullYear();
	const month = d.getMonth();
	const day = d.getDate();

	view.on('post', { action: 'service.add' }, (next) => {
		let serviceId = 1;

		Client.model.findOne()
			.where('_id', new ObjectID(req.body.client))
			.exec((err, client) => {
				if (err) return res.err(err);
				if (client) {
					method = client.method;
				}
			});

		Service.model.find().sort({ serviceId: -1 }).exec((err, data) => {
			if (data[0] && data[0].serviceId) { serviceId = data[0].serviceId + 1; }

			const newService = new Service.model({
				serviceId,
				name: req.body.name,
				ip: randomip('192.168.2.0', 24),
				date_end: new Date(year + 1, month, day),
				dbase: 'db12.toirus.ru',
				username: `root_${serviceId}`,
				users_num: req.body.users_num,
				tags_num: req.body.tags_num,
				client: req.body.client,
				description: req.body.description,
			});
			const updater = newService.getUpdateHandler(req, res, {
				errorMessage: 'Проблема с добавлением сервиса ',
			});

			updater.process(req.body, {
				flashErrors: true,
				logErrors: true,
				fields: 'name,dbase,users_num,tags_num,description',
			}, (err) => {
				if (err) {
					locals.validationErrors = err.errors;
					return next();
				}
				let paymentId = 1;
				Payment.model.find().populate('client').sort({ paymentId: -1 })
						.exec((err2, data) => {
							if (data[0] && data[0].paymentId) { paymentId = data[0].paymentId + 1; }
							console.log(newService);
							new Payment.model({
								paymentId,
								name: `Платеж за ${req.body.name} (годовой)`,
								service: newService,
								client: req.body.client,
								user: locals.user,
								method,
								sum: ((req.body.users_num * 100) + (req.body.tags_num * 10) + 30000),
								status: 'new',
							}).save((err4) => {
								if (err4) { console.log(err4); }
							});

							new Log.model({
								description: `Пользователем ${locals.user.name} заказана услуга ${req.body.name}`,
								user: locals.user,
							}).save((err4) => {
								if (err4) { console.log(err4); }
							});

							request.post(
								'http://saas.toirus.ru/newservice',
								{ json: { idservice: serviceId, clientId: req.body.client._id } },
								(error, response, body) => {
									console.log(error);
									if (!error && response.statusCode === 200) {
										console.log(body);
									}
									Service.model.findOne({ serviceId }, (service_error, service) => {
										if (service_error) return res.err(service_error);
										console.log('new');
										console.log(service);
										// TODO change on real user name and password
										service.password = Math.random().toString(36).substr(2, 7);
										service.save((service_save_err) => {
											if (service_save_err) { console.log(service_save_err); }
										});
									});
								},
							);
							req.flash('success', 'Ваша заявка принята и будет обработана в течении 2х рабочих дней. Спасибо за выбор нашего сервиса!');
							return res.redirect('/servicenew');
						});
			});
		});
	});

	view.on('render', (next) => {
		Client.model.find()
		.where('createdBy', req.user)
		.populate('method')
		.sort('name')
		.exec((err, clients) => {
			if (err) return res.err(err);
			locals.clients = clients;
			return next();
		});
	});

	view.on('init', (next) => {
		if (!_.has(req.query, 'disconnect')) return next();

		const serviceName = '';

		req.user.save((err) => {
			if (err) {
				req.flash('success', 'The service could not be disconnected, please try again.');
				return next();
			}

			req.flash('success', `${serviceName} has been successfully disconnected.`);
			return res.redirect('/me');
		});
		return next();
	});

	view.render('site/servicenew');
};
exports = module.exports;

const keystone = require('keystone');
const _ = require('lodash');

const Service = keystone.list('Service');
const Payment = keystone.list('Payment');
const Client = keystone.list('Client');
const Log = keystone.list('Log');
const randomip = require('random-ip');
const ObjectID = require('mongodb').ObjectID;

exports = module.exports = function (req, res) {
	let view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'servicenew';
	locals.page.title = 'Заказ услуги ТОиРУС';

	const d = new Date();
	const year = d.getFullYear();
	const month = d.getMonth();
	const day = d.getDate();
	let nService;

	view.on('post', { action: 'service.add' }, (next) => {
		// handle form
		let newService = new Service.model({
				name: req.body.name,
				ip: randomip('192.168.2.0', 24),
				date_end: new Date(year + 1, month, day),
				dbase: 'db12.toirus',
				users_num: req.body.users_num,
				tags_num: req.body.tags_num,
				client: locals.user.client,
				description: req.body.description,
			}),

			updater = newService.getUpdateHandler(req, res, {
				errorMessage: 'Проблема с добавлением сервиса ',
			});

		nService = newService;

		updater.process(req.body, {
			flashErrors: true,
			logErrors: true,
			fields: 'name,dbase,users_num,tags_num,description',
		}, (err) => {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				let paymentId = 1;
				Payment.model.find().populate('client').populate('method').sort({ paymentId: -1 })
						.exec((err, data) => {
							if (data[0] && data[0].paymentId) { paymentId = data[0].paymentId + 1; }
							console.log(nService);
							console.log(newService);
							Client.model.findOne().where('_id', ObjectID(locals.user.client)).populate('method').exec((err, client) => {
								if (err) {
									req.flash('error', 'Клиент не сконфигурирован');
									console.log('Клиент не сконфигурирован');
									return next();
								}

								new Payment.model({
									paymentId,
									name: `Платеж за ${req.body.name} (годовой)`,
									service: nService,
								 	client,
									method: client.method,
									sum: req.body.users_num * 100 + req.body.tags_num * 10 + 30000,
									status: 'new',
								}).save((err) => {
									if (err) { console.log(err); }
								});

								new Log.model({
									description: `Пользователем ${locals.user.name} заказана услуга ${req.body.name}`,
									user: locals.user,
								}).save((err) => {
									if (err) { console.log(err); }
								});

								req.flash('success', 'Ваша заявка принята и будет обработана в течении 2х рабочих дней. Спасибо за выбор нашего сервиса!');
								return res.redirect('/servicenew');
							});
						});
			}
			// next();
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
	});

	view.render('site/servicenew');
};

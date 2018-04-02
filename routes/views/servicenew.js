const keystone = require('keystone');
const _ = require('lodash');
const request = require('request');

const Service = keystone.list('Service');
const Payment = keystone.list('Payment');
const Client = keystone.list('Client');
const Log = keystone.list('Log');
// const Method = keystone.list('Method');
const randomip = require('random-ip');
const md5 = require('md5');
const ObjectID = require('mongodb').ObjectID;

let ret=1;

module.exports = function a(req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;
	let pid;
	let method;
	let hash;
	var message;
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
			}, (err2) => {
				if (err2) {
					locals.validationErrors = err2.errors;
					return next();
				}
				let paymentId = 1;
				Payment.model.find().populate('client').sort({ paymentId: -1 })
					.exec((err3, paymentData) => {
						if (paymentData[0] && paymentData[0].paymentId) {
							paymentId = paymentData[0].paymentId + 1;
						}
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
						console.log(process.env.API_SERVER_KEY);
						console.log(serviceId+""+process.env.API_SERVER_KEY);
						message = serviceId+""+process.env.API_SERVER_KEY;
						hash=md5(message);
						console.log(`http://`+process.env.API_SERVER_KEY+`/control-panel/create-service?sid=${serviceId}&hash=${hash}`);
						request({
							url: `http://`+process.env.API_SERVER_KEY+`/control-panel/create-service?sid=${serviceId}&hash=${hash}`,
							method: 'GET',
						}, (error, response, body) => {
							console.log(body);
							if (!error && response) {
								console.log(response.statusCode);
							}
							if (!error && response.statusCode === 200) {
								console.log(body);
							}
								
							const json_obj = JSON.parse(body);
							pid = json_obj.pid;
							pid=pid.replace(/(\r\n|\n|\r)/gm,"");
							console.log("pid="+pid+" pd="+json_obj.pid);
													
							if (pid>0) {
								getResultFromServer(serviceId, pid, req, res, function() {
									console.log("!!!first return");
									if (ret===0) {
										req.flash('success', 'Ваша заявка принята и будет обработана в течении 2х рабочих дней. Спасибо за выбор нашего сервиса!');
										return res.redirect('/servicenew');
									}
									else 
										return res.err("При добавлении сервера возникла ошибка");
								});
							}
						});
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

function getResultFromServer(serId, pId, req, res, next)	{
	let hash;
	var message;
	message = ""+serId+pId+process.env.API_SERVER_KEY;
	hash = md5(message);
	console.log(`http://`+process.env.API_SERVER_KEY+`/control-panel/check-status-migrate?sid=${serId}&pid=${pId}&hash=${hash}`);
	request({
		url: `http://`+process.env.API_SERVER_KEY+`/control-panel/check-status-migrate?sid=${serId}&pid=${pId}&hash=${hash}`,
		method: 'GET',
	}, (error2, response2, body) => {
		console.log(body);
		if (!error2 && response2) {
			//console.log(response2.statusCode);
		}
		if (!error2 && response2.statusCode === 200) {
			//console.log(body);
		}
		if (error2) {
			return next();
		}
		Service.model.where('serviceId',serId).findOne().exec((serviceError, service) => {
			if (serviceError) return next();
			// var result = extractJSON(body);
			try {
				const json_obj = JSON.parse(body);
				if (json_obj.status==='process') {
					getResultFromServer(serId, pId, req, res, function() {
					});
				}
				if (json_obj.status==='complete') {				
					service.password = json_obj.password;
					service.username = json_obj.username;
					service.dbase = 'db.'+serId+'toirus.ru';
					service.save((serviceSaveError) => {
						if (serviceSaveError) { console.log(serviceSaveError); }
						console.log ("Service save success");
						//ret=0;
						req.flash('success', 'Ваша заявка принята и будет обработана в течении 2х рабочих дней. Спасибо за выбор нашего сервиса!');
						return res.redirect('/servicenew');
						//return next();
					});
				}
			}
			catch (e) {
				console.log('['+serId+'] failed: '+e);
				return next();
			}
		});
	});
}

function extractJSON(str) {
	let firstOpen,
		firstClose,
		candidate;
	firstOpen = str.indexOf('{', firstOpen + 1);
	do {
		firstClose = str.lastIndexOf('}');
		console.log(`firstOpen: ${firstOpen}`, `firstClose: ${firstClose}`);
		if (firstClose <= firstOpen) {
			return null;
		}
		do {
			candidate = str.substring(firstOpen, firstClose + 1);
			console.log(`candidate: ${candidate}`);
			try {
				const res = JSON.parse(candidate);
				console.log('...found');
				return [res, firstOpen, firstClose + 1];
			} catch (e) {
				console.log('...failed');
			}
			firstClose = str.substr(0, firstClose).lastIndexOf('}');
		} while (firstClose > firstOpen);
		firstOpen = str.indexOf('{', firstOpen + 1);
	} while (firstOpen != -1);
}

exports = module.exports;

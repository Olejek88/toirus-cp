var keystone = require('keystone'),
	_ = require('lodash'),
	Service = keystone.list('Service'),
	Payment = keystone.list('Payment'),
	Client = keystone.list('Client');
var randomip = require('random-ip');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'servicenew';
	locals.page.title = 'Заказ услуги ТОиРУС';

	var d = new Date();
	var year = d.getFullYear();
	var month = d.getMonth();
	var day = d.getDate();

	view.on('post', { action: 'service.add' }, function(next) {
	
		// handle form
		var newService = new Service.model({
				name: req.body.name,
				ip: randomip('192.168.2.0', 24),
				date_end: new Date(year + 1, month, day),
				dbase: 'db12.toirus',
				users_num: req.body.users_num,
				tags_num: req.body.tags_num,
				client: locals.user.client,
				description: req.body.description
			}),

			updater = newService.getUpdateHandler(req, res, {
				errorMessage: 'Проблема с добавлением сервиса '
			});

		updater.process(req.body, {
			flashErrors: true,
			logErrors: true,
			fields: 'name,dbase,users_num,tags_num,description'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				var paymentId = 1;		
				Payment.model.find().sort({'paymentId':-1})
						.exec(function(err,data){
						console.log(data[0]);
						if(data[0] && data[0].paymentId)
								paymentId = data[0].paymentId+1;
						else
								paymentId = 1;				
						});
				
						var newPayment = new Payment.model({
							name: 'Платеж за ' +  req.body.name + ' (годовой) от ' + Date.now(),
							service: newService,
							client: locals.user.client,
							method: locals.user.client.method,
							sum: req.body.users_num*100+req.body.tags_num*10+30000,
							status: 'new'
						}),
								  
						updater = newPayment.getUpdateHandler(req, res, {
							errorMessage: 'Проблема с оформлением платежа'
						});

						updater.process(req.body, {
							flashErrors: true,
							logErrors: true,
							fields: 'name,method,sum,status'
						}, function(err) {
							if (err) {
								locals.validationErrors = err.errors;
							} else {
								//return res.redirect('/me');
							}
						next();
					});			
				req.flash('success', 'Ваша заявка принята и будет обработана в течении 2х рабочих дней. Спасибо за выбор нашего сервиса!');
				return res.redirect('/me');
			}
			next();
		});		
	});

	view.on('init', function(next) {
	
		if (!_.has(req.query, 'disconnect')) return next();
		
		var serviceName = '';
				
		req.user.save(function(err) {
		
			if (err) {
				req.flash('success', 'The service could not be disconnected, please try again.');
				return next();
			}
			
			req.flash('success', serviceName + ' has been successfully disconnected.');
			return res.redirect('/me');
		
		});
	
	});
	
	view.render('site/servicenew');
	
};

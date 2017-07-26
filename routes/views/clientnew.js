var keystone = require('keystone'),
	_ = require('lodash'),
	Payment = keystone.list('Payment'),
	Log = keystone.list('Log'),
	Client = keystone.list('Client');
var randomip = require('random-ip');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'clientnew';
	locals.page.title = 'Создание клиента ТОиРУС';

	var d = new Date();
	var year = d.getFullYear();
	var month = d.getMonth();
	var day = d.getDate();

	view.on('post', { action: 'client.add' }, function(next) {
	
		var newClient = new Client.model({
				name: req.body.name,
				phone: req.body.phone,
				description: req.body.description,
				status: 'new',
				method: req.body.method,
				createdBy: locals.user
			}),

			updater = newCleint.getUpdateHandler(req, res, {
				errorMessage: 'Проблема с добавлением клиента '
			});

		updater.process(req.body, {
			flashErrors: true,
			logErrors: true,
			fields: 'name,phone,status,method,createdBy,description'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				var newLog = new Log.model({
					description: 'Создан клиент ' +  req.body.name,
					user: locals.user
				}),

				updater = newPayment.getUpdateHandler(req, res, {
					errorMessage: 'Проблема с добавлением в лог'
				});

				updater.process(req.body, {
					flashErrors: true,
					logErrors: true,
					fields: ''
				}, function(err) {
					if (err) {
						locals.validationErrors = err.errors;
					} else {
						return res.redirect('/me');
					}
				next();
				});			
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
	
}

var keystone = require('keystone'),
	_ = require('lodash'),
	moment = require('moment'),
	Service = keystone.list('Service');
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
	
	view.on('post', { action: 'profile.password' }, function(next) {
	
		if (!req.body.password || !req.body.password_confirm) {
			req.flash('error', 'Please enter a password.');
			return next();
		}
	
		req.user.getUpdateHandler(req).process(req.body, {
			fields: 'password',
			flashErrors: true
		}, function(err) {
		
			if (err) {
				return next();
			}
			
			req.flash('success', 'Your changes have been saved.');
			return next();
		
		});
	
	});
	
	view.render('site/servicenew');
	
}

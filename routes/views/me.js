var keystone = require('keystone'),
	_ = require('lodash'),
	moment = require('moment');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
	locals = res.locals;
	
	locals.section = 'me';
	locals.page.title = 'ТОиРУС настройки аккаунта';
			
	view.on('post', { action: 'profile.details' }, function(next) {
	
		req.user.getUpdateHandler(req).process(req.body, {
			fields: 'name, email' ,
			flashErrors: true
		}, function(err) {
		
			if (err) {
				return next();
			}
			
			req.flash('success', 'Your changes have been saved.');
			return next();
		
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
			req.flash('error', 'Пожалуйста введите пароль.');
			return next();
		}
	
		req.user.getUpdateHandler(req).process(req.body, {
			fields: 'password',
			flashErrors: true
		}, function(err) {
		
			if (err) {
				return next();
			}
			
			req.flash('success', 'Ваши изменения сохранены.');
			return next();
		
		});
	
	});
	
	view.render('site/me');
	
}

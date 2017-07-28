var keystone = require('keystone'),
	_ = require('lodash'),
	moment = require('moment');
var Client = keystone.list('Client');
var Service = keystone.list('Service');
var User = keystone.list('User');
var Ticket = keystone.list('Ticket');
var Payment = keystone.list('Payment');

var dateFormat = require('dateformat');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),			  
	locals = res.locals;

	locals.section = 'me';
	locals.page.title = 'ТОиРУС настройки аккаунта';

	view.on('render', function(next) {
		User.model.findOne()
		.where('_id', req.user._id)
		.populate('client')
		.exec(function(err, user) {
			if (err) return res.err(err);
			if (!user) {
				req.flash('info', 'Пользователь не найден, зарегистируйтесь снова');
				return res.redirect('/signin');
			}
			locals.user = user;
			next();
		});
	});

	view.on('render', function(next) {
		Service.model.find()
			.where('client', req.user.client)
			.count(function(err, count) {
				if (err) return res.err(err);
				locals.servicecount = count;
		});
		next();
	});

	view.on('render', function(next) {
		Service.model.find()
			.where('client', req.user.client)
			.where('status',true)
			.count(function(err, count) {
				if (err) return res.err(err);
				locals.serviceactive = count;
		});
		next();
	});

	view.on('render', function(next) {
		Ticket.model.find()
		.where('user', req.user)
//		.where('ticketStatus','open')
		.sort('-createdAt')
		.exec(function(err, tickets) {
			if (err) return res.err(err);
			locals.tickets = tickets;
			//dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
			next();
		});
	});

	view.on('render', function(next) {
		Payment.model.find()
		.where('client', req.user.client)
		.sort('-createdAt')
		.exec(function(err, payments) {
			if (err) return res.err(err);
			locals.payments = payments;
			//dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
			next();
		});
	});

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
		keystone.list('User').model.findOne().populate('client', function (err, doc) {
			console.log(doc.client.name);
			console.log(doc.populated('client'));
		});
		keystone.list('Client').model.findOne( {_id:user.client} , function(err, item) { console.log(item);  });

		User.model.findOne()
		.where('_id', req.user._id)
		.populate('client')
		.exec(function(err, user) {
			if (err) return res.err(err);
			if (!user) {
				req.flash('info', 'Пользователь не найден, зарегистируйтесь снова');
				return res.redirect('/signin')
			}
			locals.user = user;
			next();
		});

		req.user.save(function(err) {		
			console.log ("save");
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
	
};

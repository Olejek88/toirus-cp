var keystone = require('keystone'),
	_ = require('lodash'),
	moment = require('moment');
var Client = keystone.list('Client');
var Method = keystone.list('Method');
var ObjectID = require('mongodb').ObjectID;

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'client';
	locals.page.title = 'ТОиРУС настройки клиента';
		
	// load client
	
	view.on('init', function(next) {
		Client.model.findOne()
			.where("_id", new ObjectID(locals.user.client))
			.exec(function(err, client) {
				if (err) return res.err(err);
				if (!client) return res.notfound('Клиент не найден');
				locals.client = client;
				next();
			});
	});

	view.on('init', function(next) {
		Method.model.find()
		.exec(function(err, methods) {
			if (err) return res.err(err);
			//console.log(methods);
			locals.methods = methods;
			next();
		});
	});

	view.on('post', { action: 'client.details' }, function(next) {
		Client.model.findOne()
			.where("_id", new ObjectID(locals.user.client))
			.exec(function(err, client) {			
				if (err) return res.err(err);
				if (!client) return res.notfound('Клиент не найден');				
				client.getUpdateHandler(req).process(req.body, {
					fields: 'name, address, phone, description, method',
					flashErrors: true
				}, function(err) {	
	    			if (err) {
					return next();
	    			}			
				req.flash('success', 'Изменения сохранены');
				return res.redirect('/client');
				});
			});
	
	});		
	view.render('site/client');
};

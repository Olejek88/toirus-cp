var keystone = require('keystone'),
	_ = require('lodash'),
	moment = require('moment');
var Service = keystone.list('Service');
var ObjectID = require('mongodb').ObjectID;

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'service';
	locals.page.title = 'ТОиРУС настройки сервиса';
		
	// load the service
	
	view.on('init', function(next) {
		console.log ("init");
		console.log (req.params.service);
		Service.model.findOne()
			.where("_id", new ObjectID(req.params.service))
			.exec(function(err, service) {
				
				if (err) return res.err(err);
				if (!service) return res.notfound('Сервис не найден');
				console.log(service.name);
				locals.service = service;
				next();
			});
	});

			
	view.on('post', { action: 'service.details' }, function(next) {
		Service.model.findOne()
			.where("_id", new ObjectID(req.params.service))
			.exec(function(err, service) {			
				if (err) return res.err(err);
				if (!service) return res.notfound('Сервис не найден');
				service.getUpdateHandler(req).process(req.body, {
					fields: 'name, description, users_num, tags_num',
					flashErrors: true
				}, function(err) {		
	    			if (err) {
					return next();
	    			}			
				req.flash('success', 'Изменения сохранены');
				//return next();
				return res.redirect('/me');
				});
			});
	
	});		
	view.render('site/service');	
}

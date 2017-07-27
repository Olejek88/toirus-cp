var keystone = require('keystone'),
	_ = require('lodash'),
	Log = keystone.list('Log'),
	Client = keystone.list('Client'),
	User = keystone.list('User');

var Method = keystone.list('Method');
var ObjectID = require('mongodb').ObjectID;

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
		console.log("add");

		var newClient = new Client.model({
				name: req.body.name,
				phone: req.body.phone,
				address: req.body.address,
				description: req.body.description,
				method: req.body.method,
				createdBy: locals.user
			}),

			updater = newClient.getUpdateHandler(req, res, {
				errorMessage: 'Проблема с добавлением клиента '
			});

		console.log("updater");
		updater.process(req.body, {
			flashErrors: true,
			logErrors: true,
			fields: 'name,phone,address,description,method'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				console.log("+log");
					
				User.model.findOne()
					.where("_id", new ObjectID(locals.user._id))
					.exec(function(err, user) {		
						if (err) return res.err(err);
						if (user) {
							user.client = newClient;
							user.save(function (err, user) {
								 if (err) { console.log(err); 
								}
							console.log('saved user: ', user);
							});
						}
					});
					
				if (err) {
					return next();
	    			}

				var newLog = new Log.model({
					description: 'Создан клиент ' +  req.body.name,
					user: locals.user
				}),
				updater = newClient.getUpdateHandler(req, res, {
					errorMessage: 'Проблема с добавлением в лог'
				});
				newLog.save(function (err, user) {
						if (err) { console.log(err); }
					});

				req.flash('success', 'Изменения сохранены');
				return res.redirect('/client');
			}
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
	
	view.render('site/clientnew');	
};

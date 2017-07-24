var keystone = require('keystone');

var Service = keystone.list('Service');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	//view.query('services', Service.model.find().sort('name'), 'members');
	//view.query('services', Service.model.find().sort('name'));
	view.on('render', function(next) {
		Service.model.find()
		.where('client', req.user.client)
		.populate('client')
		.sort('date')
		.exec(function(err, services) {
			console.log (services.length);
			if (err) return res.err(err);
			locals.services = services;
			next();
		});
	});
	
	view.render('site/services');
	
}

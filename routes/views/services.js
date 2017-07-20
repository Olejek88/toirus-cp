var keystone = require('keystone');

var Service = keystone.list('Service');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	//view.query('services', Service.model.find().sort('name'), 'members');
	view.query('services', Service.model.find().sort('name'));
	
	view.render('site/services');
	
}

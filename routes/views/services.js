const keystone = require('keystone');

const Service = keystone.list('Service');

exports = module.exports = function (req, res) {
	let view = new keystone.View(req, res),
		locals = res.locals;

	// view.query('services', Service.model.find().sort('name'), 'members');
	// view.query('services', Service.model.find().sort('name'));
	view.on('render', (next) => {
		Service.model.find()
		.where('client', req.user.client)
		.populate('client')
		.sort('date')
		.exec((err, services) => {
			console.log(services.length);
			if (err) return res.err(err);
			locals.services = services;
			next();
		});
	});

	view.render('site/services');
};

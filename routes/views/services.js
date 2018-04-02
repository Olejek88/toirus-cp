const keystone = require('keystone');

const Service = keystone.list('Service');

module.exports = function a(req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;
	console.log(req.user.client);
	view.on('render', (next) => {
		Service.model.find()
		.where('client')
		.in(req.user.client)
		.populate('client')
		.sort('-date')
		.exec((err, services) => {
			console.log(services);
			if (!err) {
			    //return res.err(err);
			    if (services)
				locals.services = services;
			}
			return next();
		});
	});

	console.log('render');
	view.render('site/services');
};
exports = module.exports;

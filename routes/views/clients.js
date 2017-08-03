const keystone = require('keystone');

const Client = keystone.list('Client');

module.exports = function a(req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;

	view.on('render', (next) => {
		Client.model.find()
		.where('user', req.user)
		.populate('method')
		.sort('updatedAt')
		.exec((err, clients) => {
			if (err) return res.err(err);
			locals.clients = clients;
			return next();
		});
	});

	view.render('site/clients');
};
exports = module.exports;

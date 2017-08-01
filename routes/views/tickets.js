const keystone = require('keystone');

const Ticket = keystone.list('Ticket');

exports = module.exports = function (req, res) {
	const view = new keystone.View(req, res);

	view.query('tickets', Ticket.model.find().sort('updateAt').where('user', req.user).sort('-createdAt'));

	view.render('site/tickets');
};

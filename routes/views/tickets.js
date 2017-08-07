const keystone = require('keystone');

const Ticket = keystone.list('Ticket');

module.exports = function a(req, res) {
	const view = new keystone.View(req, res);

	view.query('tickets', Ticket.model.find().sort('updateAt').where('user', req.user).where('ticketRef', undefined).sort('-createdAt'));

	view.render('site/tickets');
};
exports = module.exports;

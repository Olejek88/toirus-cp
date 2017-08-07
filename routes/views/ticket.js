const keystone = require('keystone');
const ObjectID = require('mongodb').ObjectID;

const Ticket = keystone.list('Ticket');

module.exports = function a(req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;

	locals.section = 'tickets';
	locals.page.title = 'Запрос';

	// load the service

	view.on('render', (next) => {
		console.log(req.params.ticket);
		Ticket.model.findOne()
			.where('_id', new ObjectID(req.params.ticket))
			.exec((err, ticket) => {
				console.log(ticket.name);
				if (err) return res.err(err);
				if (!ticket) return res.notfound('Запрос не найден');
				locals.ticket = ticket;
				console.log(ticket.name);
				
				Ticket.model.find()
					.where('ticketRef', ticket.ticketId)
					.exec((err, tickets) => {
						console.log(tickets.length);
						  if (err) return res.err(err);
						locals.tickets = tickets;
						return next();
					});
			});
	});

	view.render('site/ticket');
};
exports = module.exports;

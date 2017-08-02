const keystone = require('keystone');
const ObjectID = require('mongodb').ObjectID;

const Ticket = keystone.list('Ticket');

module.exports = function a(req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;

	locals.section = 'tickets';
	locals.page.title = 'Запрос';

	// load the service

	view.on('init', (next) => {
		Ticket.model.findOne()
			.where('_id', new ObjectID(req.params.ticket))
			.exec((err, ticket) => {
				if (err) return res.err(err);
				if (!ticket) return res.notfound('Запрос не найден');
				locals.ticket = ticket;
				return next();
			});
	});


	view.on('post', { action: 'ticket.details' }, (next) => {
		Ticket.model.findOne()
			.where('_id', new ObjectID(req.params.ticket))
			.exec((err, ticket) => {
				if (err) return res.err(err);
				if (!ticket) return res.notfound('Запрос не найден');
				ticket.getUpdateHandler(req).process(req.body, {
					fields: 'name, message',
					flashErrors: true,
				}, (err2) => {
					if (err2) {
						return next();
					}
					req.flash('success', 'Изменения сохранены');
					// return next();
					return res.redirect('/tickets');
				});
			});
	});

	view.on('post', { action: 'ticket.delete' }, (next) => {
		Ticket.model.findOne()
			.where('_id', new ObjectID(req.params.ticket))
			.remove((err) => {
				if (err) return res.err(err);
				// post has been deleted
				res.redirect('/tickets');
				return next();
			});
	});

	view.on('post', { action: 'ticket.close' }, (next) => {
		Ticket.model.findOne()
			.where('_id', new ObjectID(req.params.ticket))
			.exec((err, ticket) => {
				if (err) return res.err(err);
				if (!ticket) return res.notfound('Запрос не найден');
				console.log(req.params.ticket);
				console.log(req.params.ticketStatus);
				ticket.getUpdateHandler(req).process(req.body, {
					fields: 'ticketStatus',
					flashErrors: true,
				}, (err2) => {
					if (err2) {
						return next();
					}
					req.flash('success', 'Изменения сохранены');
					return res.redirect('/tickets');
				});
				return next();
			});
	});

	view.render('site/ticket');
};
exports = module.exports;

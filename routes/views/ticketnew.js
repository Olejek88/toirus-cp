const keystone = require('keystone');
// const _ = require('lodash');
// const moment = require('moment');

const Ticket = keystone.list('Ticket');
const Log = keystone.list('Log');
// const dateFormat = require('dateformat');

exports = module.exports = function (req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;

	locals.section = 'ticketnew';
	locals.page.title = 'Открыть тикет ТОиРУС';

	view.on('render', (next) => {
		next();
	});

	view.on('post', { action: 'ticket.add' }, (next) => {
		let ticketId = 1;
		Ticket.model.find().sort({ ticketId: -1 }).exec((err, data) => {
			if (data[0] && data[0].ticketId) { ticketId = data[0].ticketId + 1; }
			const newTicket = new Ticket.model({
				ticketId,
				name: req.body.name,
				user: locals.user,
				ticketType: req.body.ticketType,
				ticketStatus: 'open',
				message: req.body.message,
			});
			const updater = newTicket.getUpdateHandler(req, res, {
				errorMessage: 'Проблема с открытием запроса',
			});

			updater.process(req.body, {
				flashErrors: true,
				logErrors: true,
				fields: 'name, message',
			}, (err2) => {
				if (err2) {
					locals.validationErrors = err2.errors;
				} else {
					new Log.model({
						description: `Пользователь ${locals.user.name} создал запрос ${req.body.name}`,
						user: locals.user,
					}).save((err2) => {
						if (err2) { console.log(err2); }
					});

					req.flash('success', 'Ваша запрос принят и будет обработан в течении ближайшего времени. Спасибо за выбор нашего сервиса!');
					return res.redirect('/ticketnew');
				}
				next();
			});
		});
	});

	view.on('init', (next) => {
		next();
	});

	view.render('site/ticketnew');
};

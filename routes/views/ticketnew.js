var keystone = require('keystone'),
	_ = require('lodash'),
	moment = require('moment'),
	Ticket = keystone.list('Ticket');
var dateFormat = require('dateformat');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'ticketnew';
	locals.page.title = 'Открыть тикет ТОиРУС';

	var d = new Date();
	var year = d.getFullYear();
	var month = d.getMonth();
	var day = d.getDate();

	view.on('render', function(next) {
		//locals.opts =Ticket.model.ticketType;
		//console.log(locals.opts.length);
		next();
	});

	view.on('post', { action: 'ticket.add' }, function(next) {
		var ticketId = 1;		
		Ticket.model.find().sort({'ticketId':-1})
			.exec(function(err,data){
			if(data[0] && data[0].ticketId)
				ticketId = data[0].ticketId+1;
			var newTicket = new Ticket.model({
				ticketId: ticketId,
				name: req.body.name,
				user: locals.user,
				ticketType: req.body.ticketType,
				ticketStatus: 'open',
				message: req.body.message
			}),
			updater = newTicket.getUpdateHandler(req, res, {
				errorMessage: 'Проблема с открытием запроса'
			});

			updater.process(req.body, {
				flashErrors: true,
				logErrors: true,
				fields: 'name,ticketType,message'
			}, function(err) {
				if (err) {
					locals.validationErrors = err.errors;
				} else {
					req.flash('success', 'Ваша запрос принят и будет обработан в течении ближайшего времени. Спасибо за выбор нашего сервиса!');
					return res.redirect('/me');
			}
			next();
			});	
		});	
	});
	
	view.on('init', function(next) {
	    next();
	});
	
	
	view.render('site/ticketnew');	
};

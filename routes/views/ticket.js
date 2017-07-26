var keystone = require('keystone'),
	_ = require('lodash'),
	moment = require('moment');
var Ticket = keystone.list('Ticket');
var ObjectID = require('mongodb').ObjectID;

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'tickets';
	locals.page.title = 'Запрос';
		
	// load the service
	
	view.on('init', function(next) {
		Ticket.model.findOne()
			.where("_id", new ObjectID(req.params.ticket))
			.exec(function(err, ticket) {				
				if (err) return res.err(err);
				if (!ticket) return res.notfound('Запрос не найден');
				locals.ticket = ticket;
				next();
			});
	});

			
	view.on('post', { action: 'ticket.details' }, function(next) {
		Ticket.model.findOne()
			.where("_id", new ObjectID(req.params.ticket))
			.exec(function(err, ticket) {			
				if (err) return res.err(err);
				if (!ticket) return res.notfound('Запрос не найден');
				ticket.getUpdateHandler(req).process(req.body, {
					fields: 'name, message',
					flashErrors: true
				}, function(err) {		
	    			if (err) {
					return next();
	    			}			
				req.flash('success', 'Изменения сохранены');
				//return next();
				return res.redirect('/tickets');
				});
			});
	
	});		

	view.on('post', { action: 'ticket.delete' }, function(next) {
		Ticket.model.findOne()
			.where("_id", new ObjectID(req.params.ticket))
			.remove(function(err) {
				// post has been deleted
				return res.redirect('/tickets');
			});
	});		

	view.on('post', { action: 'ticket.close' }, function(next) {
		Ticket.model.findOne()
			.where("_id", new ObjectID(req.params.ticket))
			.exec(function(err, ticket) {			
				if (err) return res.err(err);
				if (!ticket) return res.notfound('Запрос не найден');
				console.log(req.params.ticket);
				console.log(req.params.ticketStatus);
				ticket.getUpdateHandler(req).process(req.body, {
					fields: 'ticketStatus',
					flashErrors: true
				}, function(err) {		
	    			if (err) {
					return next();
	    			}			
				req.flash('success', 'Изменения сохранены');
				//return next();
				return res.redirect('/tickets');
				});
			});
	});

	view.render('site/ticket');
};

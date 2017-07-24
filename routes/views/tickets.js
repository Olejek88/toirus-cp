var keystone = require('keystone');

var Ticket = keystone.list('Ticket');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	view.query('tickets', Ticket.model.find().sort('updateAt'));
	
	view.render('site/tickets');
	
}

var keystone = require('keystone'),
	_ = require('lodash'),
	moment = require('moment');
var Payment = keystone.list('Payment');
var Client = keystone.list('Client');
var ObjectID = require('mongodb').ObjectID;

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'payments';
	locals.page.title = 'Платеж';
		
	// load the service
	
	view.on('render', function(next) {
		Payment.model.findOne()
			.where("_id", new ObjectID(req.params.payment))
			.populate('client')
			.exec(function(err, payment) {
				if (err) return res.err(err);
				if (!payment) return res.notfound('Платеж не найден');
				locals.payment = payment;
				next();
			});
	});

			
	view.on('post', { action: 'payment.details' }, function(next) {
		Payment.model.findOne()
			.where("_id", new ObjectID(req.params.payment))
			.exec(function(err, payment) {			
				if (err) return res.err(err);
				if (!payment) return res.notfound('Платеж не найден');
				payment.getUpdateHandler(req).process(req.body, {
					fields: 'name, status, method, sum',
					flashErrors: true
				}, function(err) {		
	    			if (err) {
					return next();
	    			}			
				req.flash('success', 'Изменения сохранены');
				//return next();
				return res.redirect('/payments');
				});
			});
	
	});		
	view.render('site/payment');
}

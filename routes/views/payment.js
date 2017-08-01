const keystone = require('keystone');
const _ = require('lodash');
const moment = require('moment');

const Payment = keystone.list('Payment');
const Client = keystone.list('Client');
const ObjectID = require('mongodb').ObjectID;

exports = module.exports = function (req, res) {
	let view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'payments';
	locals.page.title = 'Платеж';

	// load the service

	view.on('render', (next) => {
		Payment.model.findOne()
			.where('_id', new ObjectID(req.params.payment))
			.populate('client')
			.populate('method')
			.exec((err, payment) => {
				if (err) return res.err(err);
				if (!payment) return res.notfound('Платеж не найден');
				locals.payment = payment;
				next();
			});
	});


	view.on('post', { action: 'payment.details' }, (next) => {
		Payment.model.findOne()
			.where('_id', new ObjectID(req.params.payment))
			.exec((err, payment) => {
				if (err) return res.err(err);
				if (!payment) return res.notfound('Платеж не найден');
				payment.getUpdateHandler(req).process(req.body, {
					fields: 'name, status, method, sum',
					flashErrors: true,
				}, (err) => {
	    			if (err) {
					return next();
	    			}
					req.flash('success', 'Изменения сохранены');
				// return next();
					return res.redirect('/payments');
				});
			});
	});
	view.render('site/payment');
};

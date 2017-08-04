const keystone = require('keystone');

const Payment = keystone.list('Payment');
const ObjectID = require('mongodb').ObjectID;

module.exports = function a(req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;

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
				return next();
			});
	});


	view.on('post', { action: 'payment.details' }, (next) => {
		Payment.model.findOne()
			.where('_id', new ObjectID(req.params.payment))
			.populate('method')
			.exec((err, payment) => {
				if (err) return res.err(err);
				if (!payment) return res.notfound('Платеж не найден');
				payment.getUpdateHandler(req).process(req.body, {
					fields: 'name, status, method, sum',
					flashErrors: true,
				}, (err2) => {
					if (err2) {
						return next();
					}
					req.flash('success', 'Изменения сохранены');
					return res.redirect('/payments');
				});
				return next();
			});
	});
	view.render('site/payment');
};
exports = module.exports;

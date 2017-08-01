const keystone = require('keystone');

const Payment = keystone.list('Payment');

exports = module.exports = function (req, res) {
	let view = new keystone.View(req, res),
		locals = res.locals;
	let paymentscount = 0;
	locals.section = 'payments';
	locals.page.title = 'ТОиРУС платежи';
/*
	view.on('render', function(next) {
		Payment.model.find()
		.where('client', req.user.client)
		.exec(function(err, payments) {
			if (err) return res.err(err);
			locals.payments = payments;
		});
		next();
	}); */

	view.on('render', (next) => {
		Payment.model.find()
		.where('client', req.user.client)
		.count((err, counts) => {
			if (err) return res.err(err);
			locals.ments = counts;
			paymentscount = counts;
			console.log(`count=${locals.ments}`);
		});
		next();
	});

	view.query('payments', Payment.model.find().where('client', req.user.client).populate('method').sort('-createdAt'));

	view.render('site/payments');
};

const keystone = require('keystone');
const _ = require('lodash');
// const moment = require('moment');

// const Client = keystone.list('Client');
const Service = keystone.list('Service');
const User = keystone.list('User');
const Ticket = keystone.list('Ticket');
const Payment = keystone.list('Payment');

// const dateFormat = require('dateformat');

module.exports = function a(req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;

	locals.section = 'me';
	locals.page.title = 'ТОиРУС настройки аккаунта';

	view.on('render', (next) => {
		User.model.findOne()
		.where('_id', req.user._id)
		.populate('client')
		.exec((err, user) => {
			if (err) return res.err(err);
			if (!user) {
				req.flash('info', 'Пользователь не найден, зарегистируйтесь снова');
				return res.redirect('/signin');
			}
			locals.user = user;
			return next();
		});
	});

	view.on('render', (next) => {
		Service.model.find()
			.where('client', req.user.client)
			.count((err, count) => {
				if (err) return res.err(err);
				locals.servicecount = count;
				return next();
			});
	});

	view.on('render', (next) => {
		Service.model.find()
			.where('client', req.user.client)
			.where('status', true)
			.count((err, count) => {
				if (err) return res.err(err);
				locals.serviceactive = count;
				return next();
			});
	});

	view.on('render', (next) => {
		Ticket.model.find()
		.where('user', req.user)
//		.where('ticketStatus','open')
		.sort('-createdAt')
		.exec((err, tickets) => {
			if (err) return res.err(err);
			locals.tickets = tickets;
			// dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
			return next();
		});
	});

	view.on('render', (next) => {
		Ticket.model.find()
		.where('user', req.user)
//		.where('ticketStatus','open')
		.count((err, count) => {
			if (err) return res.err(err);
			locals.ticketscount = count;
			return next();
		});
	});

	view.on('render', (next) => {
		let sum = 0;
		locals.balance = 0;
		Payment.model.find()
		.where('client', req.user.client)
		.where('status', 'new')
		.exec((err, payments) => {
			if (err) return res.err(err);
			if (payments) {
				for (const index in payments) {
					sum += payments[index].sum;
				}
			}
			locals.balance = sum * (-1);
			return next();
		});
	});

	view.on('render', (next) => {
		Payment.model.find()
		.where('client', req.user.client)
		.sort('-createdAt')
		.exec((err, payments) => {
			if (err) return res.err(err);
			locals.payments = payments;
			// dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
			return next();
		});
	});

	view.on('render', (next) => {
		Ticket.model.find()
		.where('user', req.user)
		.where('ticketStatus', 'open')
		.count((err, count) => {
			if (err) return res.err(err);
			locals.ticketsactive = count;
			return next();
		});
	});

	view.on('post', { action: 'profile.details' }, (next) => {
		req.user.getUpdateHandler(req).process(req.body, {
			fields: 'name, email',
			flashErrors: true,
		}, (err) => {
			if (err) {
				return next();
			}
			req.flash('success', 'Your changes have been saved.');
			return next();
		});
	});

	view.on('init', (next) => {
		if (!_.has(req.query, 'disconnect')) return next();

		keystone.list('User').model.findOne().populate('client', (err, doc) => {
			console.log(doc.client.name);
			console.log(doc.populated('client'));
		});
		keystone.list('Client').model.findOne({ _id: req.user.client }, (err, item) => { console.log(item); });

		User.model.findOne()
		.where('_id', req.user._id)
		.populate('client')
		.exec((err, user) => {
			if (err) return res.err(err);
			if (!user) {
				req.flash('info', 'Пользователь не найден, зарегистируйтесь снова');
				return res.redirect('/signin');
			}
			locals.user = user;
//			return next();
		});

		req.user.save((err) => {
			console.log('save');
			if (err) {
				req.flash('success', 'The service could not be disconnected, please try again.');
				return next();
			}
			return next();
		});
	});

	view.on('post', { action: 'profile.password' }, (next) => {
		if (!req.body.password || !req.body.password_confirm) {
			req.flash('error', 'Пожалуйста введите пароль.');
			return next();
		}

		req.user.getUpdateHandler(req).process(req.body, {
			fields: 'password',
			flashErrors: true,
		}, (err) => {
			if (err) {
				return next();
			}

			req.flash('success', 'Ваши изменения сохранены.');
			return next();
		});
	});
	view.render('site/me');
	//return res.redirect('/me');
};
exports = module.exports;

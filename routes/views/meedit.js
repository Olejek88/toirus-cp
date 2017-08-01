const keystone = require('keystone');
const _ = require('lodash');
const moment = require('moment');

exports = module.exports = function (req, res) {
	let view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'meedit';
	locals.page.title = 'ТОиРУС настройки профиль';

	view.on('post', { action: 'profile.details' }, (next) => {
		req.user.getUpdateHandler(req).process(req.body, {
			fields: 'name, email, ',
			flashErrors: true,
		}, (err) => {
			if (err) {
				return next();
			}

			req.flash('success', 'Изменения сохранены');
			return next();
		});
	});

	view.on('init', (next) => {
		if (!_.has(req.query, 'disconnect')) return next();

		const serviceName = '';

		req.user.save((err) => {
			if (err) {
				req.flash('success', 'The service could not be disconnected, please try again.');
				return next();
			}

			req.flash('success', `${serviceName} has been successfully disconnected.`);
			return res.redirect('/me');
		});
	});

	view.on('post', { action: 'profile.password' }, (next) => {
		if (!req.body.password || !req.body.password_confirm) {
			req.flash('error', 'Please enter a password.');
			return next();
		}

		req.user.getUpdateHandler(req).process(req.body, {
			fields: 'password',
			flashErrors: true,
		}, (err) => {
			if (err) {
				return next();
			}

			req.flash('success', 'Your changes have been saved.');
			return next();
		});
	});

	view.render('site/meedit');
};

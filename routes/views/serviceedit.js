var keystone = require('keystone'),
	_ = require('lodash'),
	moment = require('moment');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'serviceedit';
	locals.page.title = 'ТОиРУС настройки сервиса';
			
	view.on('post', { action: 'service.details' }, function(next) {
	
		req.user.getUpdateHandler(req).process(req.body, {
			fields: 'name, description, users_num, tags_num',
			flashErrors: true
		}, function(err) {
		
			if (err) {
				return next();
			}			
			req.flash('success', 'Изменения сохранены');
			return next();
		});
	
	});
		
	view.render('site/serviceedit');
	
}

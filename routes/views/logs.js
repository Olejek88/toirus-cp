var keystone = require('keystone');

var Log = keystone.list('Log');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	view.query('logs', Log.model.find().sort('updateAt').sort('-createdAt'));
	
	view.render('site/logs');
	
}

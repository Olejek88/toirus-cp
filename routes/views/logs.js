const keystone = require('keystone');

const Log = keystone.list('Log');

module.exports = function a(req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;

	locals.data = {
		logs: []
	};

	/*view.on('init', function(next) {
		view.query('logs', Log.model.find().sort('updateAt').sort('-createdAt'));
		Log.find().where('user', locals.user)
		.sort('-createdAt')
		.exec(function(err, logs) {
			//locals.logs = logs;
			locals.data.logs = logs;
			console.log('ready');
			//console.log(locals.data.logs);
			//return view.render('site/logs');
			next(err);
		});
	});*/
	//console.log('render');
	//console.log(locals.data.logs);
	view.query('logs', Log.model.find().sort('updateAt').sort('-createdAt'));
	view.render('site/logs');
};
exports = module.exports;

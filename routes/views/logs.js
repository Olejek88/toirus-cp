const keystone = require('keystone');

const Log = keystone.list('Log');

module.exports = function a(req, res) {
	const view = new keystone.View(req, res);

	view.query('logs', Log.model.find().sort('updateAt').sort('-createdAt'));

	view.render('site/logs');
};
exports = module.exports;

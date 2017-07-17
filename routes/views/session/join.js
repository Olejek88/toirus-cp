var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {
	
	if (req.user) {
		return res.redirect(req.cookies.target || '/me');
	}
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'session';
	locals.form = req.body;
	
	view.on('post', { action: 'join' }, function(next) {

		async.series([
			
			function(cb) {
				if (!req.body.name || !req.body.email || !req.body.password) {
					req.flash('error', 'Пожалуйста введите имя, email и пароль.');
					//console.log('Please enter a name, email and password.');
					return cb(true);
				}
				
				return cb();
				
			},
			
			function(cb) {
				
				keystone.list('User').model.findOne({ email: req.body.email }, function(err, user) {
					console.log('check user');					
					if (err || user) {
						//console.log('User already exists with that email address');
						req.flash('error', 'Пользователь с таким е-мэйл уже существует');
						return cb(true);
					}
					
					return cb();
					
				});
				
			},
			
			function(cb) {
			
				var userData = {
					name:  req.body.name,
					email: req.body.email,
					password: req.body.password,
				};
				
				var User = keystone.list('User').model,
					newUser = new User(userData);
				
				newUser.save(function(err) {
					return cb(err);
				});
			
			}
			
		], function(err){
			
			if (err) return next();
			
			var onSuccess = function() {
				if (req.body.target && !/join|signin/.test(req.body.target)) {
					console.log('[join] - Set target as [' + req.body.target + '].');
					res.redirect(req.body.target);
				} else {
					res.redirect('/me');
				}
			}
			
			var onFail = function(e) {
				req.flash('error', 'Проблема с входом систему, попробуйте еще');
				return next();
			}
			
			keystone.session.signin({ email: req.body.email, password: req.body.password }, req, res, onSuccess, onFail);
			
		});
		
	});
	
	view.render('session/join');
	
}

const keystone = require('keystone');
const request = require('request');

const Service = keystone.list('Service');

module.exports = function a(req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;

	view.on('post', { action: 'user.resetpassword' }, (next) => {
	    request({
		url: 'http://api.toirus.ru/control-panel/change-admin-password?sid=' + req.params.service,
		method: 'GET'
	    }, function(error, response, body){
		console.log(body);
		if (!error && response) {
		    console.log(response.statusCode);
		}
		if (!error && response.statusCode === 200) {
			console.log(body);
			try  {
			    var json_obj = JSON.parse(body);
			    Service.model.findOne()
				.where('_id', new ObjectID(req.params.service))
				.exec((err, service) => {
				    if (err) return res.err(err);
				    if (!service) return res.notfound('Сервис не найден');
				    service.password = json_obj["password"];
				    service.save((serviceError) => {
					if (serviceError) { console.log(serviceError); }
				    });
				    return res.redirect('/services');
				});
			}
			catch(e) {
			    console.log('failed');
			}
		}
	    });
	});
	
	view.render('site/resetpassword');
};

const keystone = require('keystone');
const request = require('request');

const ServiceUser = keystone.list('ServiceUser');

module.exports = function a(req, res) {
	const view = new keystone.View(req, res);

	request({
		url: `http://api.toirus.ru/control-panel/user-list?sid=${req.params.service}`,
		method: 'GET',
	}, (error, response, body) => {
		console.log(body);
		if (!error && response) {
			console.log(response.statusCode);
		}
		if (!error && response.statusCode === 200) {
			console.log(body);
			ServiceUser.model.find.remove({});
			try {
				const json_obj = JSON.parse(body);
				for (var i in json_obj) {
					const key = i;
					const val = json_obj[i];
					let cnt = 0;
					var sub_key;
					const sub_val_user = [];
					const sub_val_status = [];
					for (const j in val) {
						sub_key = j;
						sub_val_user[cnt] = val[j];
						sub_val_status[cnt] = val[j];
						console.log(sub_key);
						if (sub_key.indexOf('status')) {
							sub_val_status[cnt] = val[j];
						}
						if (sub_key.indexOf('user')) {
							sub_val_user[cnt] = val[j];
							cnt += 1;
						}
					}
					for (var i = 0; i < cnt; i += 1) {
						const newServiceUser = new ServiceUser.model({
							name: sub_val_user[i],
							service: req.param.service,
							status: sub_val_status[i],
						});
						newServiceUser.save((userSaveError) => {
							if (userSaveError) { console.log(userSaveError); }
						});
					}
				}
			}			catch (e) {
				console.log('failed');
			}
		}
	});

	view.query('users', ServiceUser.model.find()
				.where('service', req.param.service));

	view.render('site/userlist');
};

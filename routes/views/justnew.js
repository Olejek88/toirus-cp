const keystone = require('keystone');
const _ = require('lodash');
const request = require('request');
const randomip = require('random-ip');
const md5 = require('md5');

let ret=1;

module.exports = function a(req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;
	let pid;
	let hash;
	var message;

	const d = new Date();
	const year = d.getFullYear();
	const month = d.getMonth();
	const day = d.getDate();

	let serviceId = 1;
	message = serviceId+""+process.env.API_SERVER_KEY;
	hash=md5(message);
	console.log(`http://`+process.env.API_SERVER+`/control-panel/create-service?sid=${serviceId}&hash=${hash}`);
	request({
		url: `http://`+process.env.API_SERVER+`/control-panel/create-service?sid=${serviceId}&hash=${hash}`,
		method: 'GET',
	}, (error, response, body) => {
		console.log(body);
		if (!error && response) {
			console.log(response.statusCode);
		}
		if (!error && response.statusCode === 200) {
			console.log(body);
		}
								
		const json_obj = JSON.parse(body);
		pid = json_obj.pid;
		pid=pid.replace(/(\r\n|\n|\r)/gm,"");
		console.log("pid="+pid+" pd="+json_obj.pid);
													
		if (pid>0) {
			getResultFromServer(serviceId, pid, req, res, function() {
				if (ret===0) {
					console.log('request success');
				}
				else 
					return console.log('error when create server');
			});
		}
	});
};

function getResultFromServer(serId, pId, req, res, next)	{
	let hash;
	var message;
	message = ""+serId+pId+process.env.API_SERVER_KEY;
	hash = md5(message);
	console.log(`http://`+process.env.API_SERVER+`/control-panel/check-status-migrate?sid=${serId}&pid=${pId}&hash=${hash}`);
	request({
		url: `http://`+process.env.API_SERVER+`/control-panel/check-status-migrate?sid=${serId}&pid=${pId}&hash=${hash}`,
		method: 'GET',
	}, (error2, response2, body) => {
		console.log(body);
		if (!error2 && response2) {
			//console.log(response2.statusCode);
		}
		if (!error2 && response2.statusCode === 200) {
			//console.log(body);
		}
		if (error2) {
			return next();
		}
		try {
			const json_obj = JSON.parse(body);
			if (json_obj.status==='process') {
				getResultFromServer(serId, pId, req, res, function() {
				});
			}
			if (json_obj.status==='complete') {				
				console.log ("service save success");
				console.log ("db = db."+serId+"toirus.ru");
				console.log ("username ("+json_obj.username+")");
				console.log ("password ("+json_obj.password+" / "+json_obj.username+")");
			}
		}
		catch (e) {
			console.log('['+serId+'] failed: '+e);
				return next();
		}
	});
}

exports = module.exports;

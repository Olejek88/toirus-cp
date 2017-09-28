const keystone = require('keystone');
const request = require('request');

const Service = keystone.list('Service');
let index = 0;

function requestService(service) {
	request({ method: 'GET',
		uri: `http://api.toirus.ru/control-panel/user-list?sid=${service.serviceId}`,
	},
			(error, response, body) => {
				if (error) {
					console.log(error);
					return;
				}
				console.log(`server encoded the data as: ${response.headers['content-encoding'] || 'identity'}`);
				console.log(`the decoded data is: ${body}`);
			}).on('data', (data) => {
				// decompressed data as it is received
				console.log(`decoded chunk: ${data}`);
				// service[index].users_used = ;
				// service[index].tags_used = ;
				service.save((serviceSaveError) => {
					if (serviceSaveError) { console.log(serviceSaveError); }
				});
			}).on('response', (response) => {
			// unmodified http.IncomingMessage object
				response.on('data', (data) => {
			// compressed data as it is received
					console.log(`received ${data.length} bytes of compressed data`);
				});
			});
}

module.exports = { updateServices(done) {
	Service.model.find((serviceError, services) => {
		if (serviceError) return console.log(serviceError);
		for (; index < services.length; index += 1) {
			// requestService(services[index]);
		}
	});
},
};

const keystone = require('keystone');

module.exports = {

	'ticket-notification': function (req, res, callback) {
		const Ticket = keystone.list('Ticket');

		const newTicket = new Ticket.model({
			name: { first: 'Test', last: 'User' },
			email: 'olejek8@yandex.ru',
			phone: '+79227000293',
			enquiryType: 'message',
			message: { md: 'Nice enquiry notification.' },
		});

		callback(null, {
			admin: 'Admin User',
			enquiry: newTicket,
			enquiry_url: '/keystone/tickets/',
		});
	},

};

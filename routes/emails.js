const keystone = require('keystone');

module.exports = {

	/** New Enquiry Notifications */
	'enquiry-notification': function (req, res, callback) {
		const Enquiry = keystone.list('Enquiry');

		const newEnquiry = new Enquiry.model({
			name: { first: 'Test', last: 'User' },
			email: 'contact@my-site.com',
			phone: '+61 2 1234 5678',
			enquiryType: 'message',
			message: { md: 'Nice enquiry notification.' },
		});

		callback(null, {
			admin: 'Admin User',
			enquiry: newEnquiry,
			enquiry_url: '/keystone/enquiries/',
		});
	},

};

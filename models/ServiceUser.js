const keystone = require('keystone');

const Types = keystone.Field.Types;

/**
 * Service User Model
 * ==========
 */
const ServiceUser = new keystone.List('ServiceUser');

ServiceUser.add({
	name: { type: String, required: true, index: true, label: 'Имя' },
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
	service: { type: Types.Relationship, ref: 'Service', many: true },
	status: { type: Types.Boolean, index: true, initial: true, label: 'Статус' },
});

ServiceUser.defaultColumns = 'name, service, status';
ServiceUser.register();

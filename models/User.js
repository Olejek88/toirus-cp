var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User');
var uuid = require('uuid');

User.add({
	name: { type: Types.Name, required: true, index: true, label: 'Имя'},
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
	password: { type: Types.Password, initial: true, required: true, label: 'Пароль' },
	status: { type: Types.Boolean, index: true, initial: true, label: 'Статус' },
	uuid: { 
		type: String, 
		index: { unique: true },
		initial: true,
		default: uuid.v4,
		label: 'Идентификатор'
		}
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Администратор', index: true }
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});


/**
 * Registration
 */
User.defaultColumns = 'name, email, password, status, uuid, isAdmin';
User.register();

var keystone = require('keystone');
var Types = keystone.Field.Types;
var Mongoose = require('mongoose');

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User');
var uuid = require('uuid');

User.add({
	name: { type: String, required: true, index: true, label: 'Имя'},
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
	password: { type: Types.Password, initial: true, required: true, label: 'Пароль' },
	client: { type: Types.Relationship, ref: 'Client', many: false },
	//client: { type: Mongoose.Schema.Types.ObjectId, ref: 'Client' },
	status: { type: Types.Boolean, index: true, initial: true, label: 'Статус' },
	roles: { type: Types.Relationship, ref: 'Role', many: true },
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

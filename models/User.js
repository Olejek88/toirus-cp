const keystone = require('keystone');

const Types = keystone.Field.Types;
// const Mongoose = require('mongoose');

/**
 * User Model
 * ==========
 */
const User = new keystone.List('User');
const uuid = require('uuid');

User.add({
	name: { type: String, required: true, index: true, label: 'Имя' },
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
	password: { type: Types.Password, initial: true, required: true, label: 'Пароль' },
	client: { type: Types.Relationship, ref: 'Client', many: true },
	// client: { type: Mongoose.Schema.Types.ObjectId, ref: 'Client' },
	status: { type: Types.Boolean, index: true, initial: true, label: 'Статус' },
	roles: { type: Types.Relationship, ref: 'Role', many: true },
	uuid: {
		type: String,
		index: { unique: true },
		default: uuid.v4,
		label: 'Идентификатор',
	},
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Администратор', index: true },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function can() {
	return this.isAdmin;
});

User.schema.methods.resetPassword = function cb(callback) {
	const user = this;
	user.resetPasswordKey = keystone.utils.randomString([16, 24]);
	user.save((err) => {
		if (err) return callback(err);
		new keystone.Email('forgotten-password').send({
			user,
			link: `/reset-password/${user.resetPasswordKey}`,
			subject: 'Сбросить пароль доступа к сервису ТОиРУС',
			to: user.email,
//			transport: 'mailgun',
			from: {
				name: 'ТОиРУС облако',
				email: 'service@toirus.ru',
			},
		}, callback);
	});
};

/**
 * Registration
 */
User.defaultColumns = 'name, email, password, status, uuid, isAdmin';
User.register();

// var ClientUser = new keystone.List('ClientUser', { inherits: Clients });
// ClientUser .add({ client: { type: , readonly: true } });
// ChildPage.register();

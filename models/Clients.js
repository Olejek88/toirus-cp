/*
 *  $Id$
 */
const keystone = require('keystone');

const Types = keystone.Field.Types;
// const ObjectId = require('mongodb').ObjectID;

const Client = new keystone.List('Client', {
	autokey: { from: 'name', path: 'slug', unique: true },
});

Client.add({
	clientId: { type: Types.Number, noedit: true, initial: true, label: 'Идентификатор' },
	name: { type: String, initial: true, default: '', required: true, label: 'Имя' },
	phone: { type: String, initial: true, default: '', required: true, label: 'Телефон' },
	address: { type: String, initial: true, default: '', required: true, label: 'Адрес' },
	description: { type: Types.Textarea, initial: true },
	status: { type: Types.Select, options: 'Активен, Отключен, Новый', default: 'Новый' },
	method: { type: Types.Relationship, ref: 'Method', many: false },
	user: { type: Types.Relationship, ref: 'User', many: false },
	balance: { type: Types.Number, default: '0' },
	createdBy: { type: Types.Relationship, ref: 'User', many: true },
	createdAt: { type: Types.Datetime, default: Date.now },
	updatedAt: { type: Types.Datetime, default: Date.now },
});

Client.defaultSort = '-createdAt';
Client.defaultColumns = 'name,description,status';

Client.register();


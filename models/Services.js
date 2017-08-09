/*
 *  $Id$
 */
const keystone = require('keystone');

const Types = keystone.Field.Types;

const Service = new keystone.List('Service', {
	autokey: { from: 'name', path: 'slug', unique: true },
});

Service.add({
	serviceId: { type: Types.Number, noedit: true, initial: true, label: 'Идентификатор' },
	name: { type: String, initial: true, default: 'Новый', required: true },
	dbase: { type: String, initial: true, default: 'toir' },
	ip: { type: String, initial: true, default: '127.0.0.1' },
	users_num: { type: Types.Number, initial: true, default: '0' },
	tags_num: { type: Types.Number, initial: true, default: '0' },
	users_used: { type: Types.Number, initial: true, default: '0' },
	tags_used: { type: Types.Number, initial: true, default: '0' },
	client: { type: Types.Relationship, initial: true, ref: 'Client' },
	username: { type: String, initial: true, default: 'root' },
	password: { type: String, initial: true, default: 'no password' },
	status: { type: Types.Boolean, index: true, initial: true, label: 'Статус' },
	date: { type: Types.Datetime, default: Date.now },
	date_end: { type: Types.Datetime, default: Date.now },
	description: { type: Types.Text, default: 'без описания' },
	createdAt: { type: Types.Datetime, default: Date.now },
	updatedAt: { type: Types.Datetime, default: Date.now },
});

Service.defaultSort = '-createdAt';
Service.defaultColumns = 'name,db,ip,user_num,tags_num,users_used,tags_used,client';
Service.register();


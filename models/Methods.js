/*
 *  $Id$
 */
const keystone = require('keystone');

const Types = keystone.Field.Types;

const Method = new keystone.List('Method', {
	autokey: { from: 'name', path: 'slug', unique: true },
});

Method.add({
	name: { type: String, initial: true, default: '', required: true },
	description: { type: Types.Textarea, initial: true },
	status: { type: Types.Select, initial: true, options: 'Активен, Отключен, Новый', default: 'Новый' },
	createdBy: { type: Types.Relationship, ref: 'User', index: true, many: false },
	createdAt: { type: Types.Datetime, default: Date.now },
	updatedAt: { type: Types.Datetime, default: Date.now },
});

Method.defaultSort = '-createdAt';
Method.defaultColumns = 'name,description,status,createdBy';
Method.register();


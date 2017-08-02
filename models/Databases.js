/*
 *  $Id$
 */
const keystone = require('keystone');

const Types = keystone.Field.Types;


const Database = new keystone.List('Database', {
	autokey: { from: 'name', path: 'slug', unique: true },
});

Database.add({
	name: { type: String, initial: true, default: '', required: true },
	host: { type: Types.Relationship, ref: 'Host', initial: true, many: false },
	createdAt: { type: Types.Datetime, default: Date.now },
	updatedAt: { type: Types.Datetime, default: Date.now },
});

Database.defaultSort = '-createdAt';
Database.defaultColumns = 'name,description,status';
Database.register();


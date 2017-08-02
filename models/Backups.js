/*
 *  $Id$
 */
const keystone = require('keystone');

const Types = keystone.Field.Types;

const Backup = new keystone.List('Backup');
/*
var Backup= new keystone.List('Backup',{
  	autokey: { from: 'name', path: 'slug', unique: true },
 }); */

Backup.add({
	name: { type: String, initial: true, default: '', required: true, label: 'Название' },
	database: { type: Types.Relationship, ref: 'Database', initial: true, many: false, label: 'База данных' },
	createdBy: { type: Types.Relationship, ref: 'User', index: true, many: false, label: 'Автор' },
	createdAt: { type: Types.Datetime, default: Date.now },
	updatedAt: { type: Types.Datetime, default: Date.now },
});

Backup.defaultSort = '-createdAt';
Backup.defaultColumns = 'name,database,createdBy,createdAt';
Backup.register();


/* 
 *  $Id$
 */
var keystone = require('keystone');
var Types = keystone.Field.Types;
var ObjectId = require('mongodb').ObjectID;
var Client = new keystone.List('Client',{
  	autokey: { from: 'name', path: 'slug', unique: true },
 });
  
 Client.add({
	name: { type: String, initial: true, default: '', required: true, label: 'Имя' },  
	phone: { type: String, initial: true, default: '', required: true, label: 'Телефон' },  
	description: { type: Types.Textarea, initial: true }, 
	status: { type: Types.Select, initial: true, options: 'Активен, Отключен, Новый', default: 'Новый' },
	method: { type: Types.Relationship, ref: 'Method', many: false },
	//users: { type: Types.Relationship, ref: 'User', many: true },
	balance: { type: Types.Number, default: '0'},  
	createdBy: { type: Types.Relationship, ref: 'User', index: true, many: false },
	createdAt: { type: Types.Datetime, default: Date.now },
	updatedAt: { type: Types.Datetime, default: Date.now }
});

Client.defaultSort = '-createdAt';      
Client.defaultColumns='name,description,status';

Client.register();



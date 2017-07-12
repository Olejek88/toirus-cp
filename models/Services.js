/* 
 *  $Id$
 */
var keystone = require('keystone');
var Types = keystone.Field.Types;

var Service = new keystone.List('Service',{
  	autokey: { from: 'name', path: 'slug', unique: true },
 });
  
 Service.add({
	name: { type: String, initial: true, default: 'Новый', required: true },  
	dbase: { type: String, initial: true, default: 'toir' },  
	ip: { type: Types.Url, initial: true, default: '127.0.0.1' },  
	users_num: { type: Types.Number, initial: true, default: '0', required: true },  
	tags_num: { type: Types.Number, initial: true, default: '0', required: true },  
	users_used: { type: Types.Number, default: '0' },  
	tags_used: { type: Types.Number, default: '0' },  
	client: { type: Types.Relationship, ref: 'Client', index: true, many: false },
	date: { type: Types.Datetime, default: Date.now },
	createdAt: { type: Types.Datetime, default: Date.now },
	updatedAt: { type: Types.Datetime, default: Date.now }
});

Service.defaultSort = '-createdAt';      
Service.defaultColumns='name,db,ip,user_num,tags_num,users_used,tags_used,client';
Service.register();



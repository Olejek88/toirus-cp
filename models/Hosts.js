/* 
 *  $Id$
 */
var keystone = require('keystone');
var Types = keystone.Field.Types;

var Host= new keystone.List('Host',{
  	autokey: { from: 'name', path: 'slug', unique: true },
 });
  
Host.add({
	name: { type: String, initial: true, default: '', required: true },  
	link: { type: String, initial: true, default: '', required: true },  
	description: { type: Types.Textarea, initial: true }, 
	status: { type: Types.Select, initial: true, options: 'Активен, Отключен', default: 'Активен' },
	cpu: { type: Types.Number, default: '2', initial: true }, 
	hdd: { type: Types.Number, default: '1000', initial: true }, 
       createdAt: { type: Types.Datetime, default: Date.now },
       updatedAt: { type: Types.Datetime, default: Date.now }
});

Host.defaultSort = '-name';      
Host.defaultColumns='name,link,description,status,cpu,hdd';
Host.register();



/* 
 *  $Id$
 */
var keystone = require('keystone');
var Types = keystone.Field.Types;

var Log = new keystone.List('Log',{
  	autokey: { from: 'name', path: 'slug', unique: true },
 });
  
 Log.add({
       date: { type: Types.Datetime, initial: true, default: '', required: true },  
       description: { type: String, initial: true, default: '', required: true },  
       user: { type: Types.Relationship, ref: 'User', index: true, many: false },
       createdAt: { type: Types.Datetime, default: Date.now },
       updatedAt: { type: Types.Datetime, default: Date.now }
});

Log.defaultSort = '-createdAt';      
Log.defaultColumns='name,description,user';
Log.register();



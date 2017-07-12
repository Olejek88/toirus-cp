/* 
 *  $Id$
 */
var keystone = require('keystone');
var Types = keystone.Field.Types;

var Payment = new keystone.List('Payment',{
  	autokey: { from: 'name', path: 'slug', unique: true },
 });
  
 Payment.add({
	name: { type: String, initial: true, default: '', required: true },  
	date: { type: Types.Datetime, default: Date.now },
	client: { type: Types.Relationship, ref: 'Client', index: true, many: false },
	method: { type: Types.Relationship, ref: 'Method', index: true, many: false },
	sum: { type: Types.Money, initial: true, default: '0', required: true },  
	createdAt: { type: Types.Datetime, default: Date.now },
	updatedAt: { type: Types.Datetime, default: Date.now }
});

Payment.defaultSort = '-date';
Payment.defaultColumns='name,date,method,sum';
Payment.register();



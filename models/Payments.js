/*
 *  $Id$
 */
const keystone = require('keystone');

const Types = keystone.Field.Types;

const Payment = new keystone.List('Payment', {
	autokey: { from: 'name', path: 'slug', unique: true },
});

Payment.add({
	paymentId: { type: Types.Number, noedit: true, initial: true },
	name: { type: String, initial: true, default: '', required: true },
	service: { type: Types.Relationship, ref: 'Service', many: false },
	date: { type: Types.Datetime, default: Date.now },
	user: { type: Types.Relationship, ref: 'User', many: false },
	client: { type: Types.Relationship, ref: 'Client', index: true, many: false },
	method: { type: Types.Relationship, ref: 'Method', index: true, many: false },
	sum: { type: Types.Money, initial: true, default: '0', required: true },
	status: { type: Types.Select,
		options: [
		{ value: 'new', label: 'Не оплачен' },
		{ value: 'no verified', label: 'Не подтвержден' },
		{ value: 'verified', label: 'Оплачен' },
		] },
	createdAt: { type: Types.Datetime, default: Date.now },
	updatedAt: { type: Types.Datetime, default: Date.now },
});

Payment.schema.pre('save', function save(next) {
	const payment = this;
	if (!payment.status) {
		payment.status = 'new';
	}
	next();
});

Payment.defaultSort = '-date';
Payment.defaultColumns = 'name,date,method,sum';
Payment.register();


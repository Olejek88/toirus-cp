var keystone = require('keystone');
var Types = keystone.Field.Types;

var Ticket = new keystone.List('Ticket', {
	nocreate: true,
	noedit: true
});

Ticket.add({
	ticketId: { type: Types.Number,  noedit: true, initial: true },
	name: { type: String, required: true, initial:true},
	user: { type: Types.Relationship, ref: 'User', many: false },
	ticketType: { type: Types.Select, options: [
		{ value: 'message', label: 'Сообщение администратору' },
		{ value: 'question', label: 'Вопрос по работе сервиса'},
		{ value: 'other', label: 'Что-то другое...' }
	] },
	ticketStatus: { type: Types.Select, options: [
		{ value: 'open', label: 'Открыт' },
		{ value: 'process', label: 'В процессе' },
		{ value: 'closed', label: 'Закрыт'}
	] },
	message: { type: Types.Text, required: true },
	createdAt: { type: Types.Datetime, default: Date.now },
	updatedAt: { type: Types.Datetime, default: Date.now }
});

Ticket.schema.pre('save', function(next) {
	var ticket = this;
	if (!ticket.ticketStatus) {
		ticket.ticketStatus = 'open';
	}
	
	next();
});

Ticket.defaultSort = '-createdAt';
Ticket.defaultColumns = 'user, ticketType, ticketStatus, createdAt';
Ticket.register();

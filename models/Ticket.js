const keystone = require('keystone');

const Types = keystone.Field.Types;

const Ticket = new keystone.List('Ticket', {
    autokey: { from: 'ticketId', path: 'slug', unique: false },
});

Ticket.add({
	ticketId: { type: Types.Number, noedit: true, initial: true, label: 'Идентификатор' },
	ticketRef: { type: Types.Number, noedit: true, label: 'Ссылка на начальный', default: 0 },
	name: { type: String, required: true, initial: true, label: 'Название' },
	user: { type: Types.Relationship, ref: 'User', many: false, label: 'Пользователь' },
	ticketType: { type: Types.Select,
		options: [
		{ value: 'message', label: 'Сообщение администратору' },
		{ value: 'question', label: 'Вопрос по работе сервиса' },
		{ value: 'other', label: 'Что-то другое...' },
		],
		label: 'Тип запроса' },
	ticketStatus: { type: Types.Select,
		options: [
		{ value: 'open', label: 'Открыт' },
		{ value: 'process', label: 'В процессе' },
		{ value: 'closed', label: 'Закрыт' },
		],
		label: 'Статус запроса' },
	message: { type: Types.Text, required: true, label: 'Сообщение', default: '' },
	createdAt: { type: Types.Datetime, default: Date.now },
	updatedAt: { type: Types.Datetime, default: Date.now },
});

Ticket.schema.pre('save', function save(next) {
	const ticket = this;
	if (!ticket.ticketStatus) {
		ticket.ticketStatus = 'open';
	}

	next();
});

Ticket.defaultSort = '-createdAt';
Ticket.defaultColumns = 'user, ticketType, ticketStatus, createdAt';
Ticket.register();

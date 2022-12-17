const dynamicContent = {
	error: {
		type: 'string',
		default: '',
	},
	status: {
		type: 'boolean',
		default: false,
	},
	type: {
		type: 'string',
		default: 'posts',
	},
	relation: {
		type: 'string',
		default: 'by-id',
	},
	id: {
		type: 'number',
	},
	author: {
		type: 'number',
	},
	show: {
		type: 'string',
		default: 'current',
	},
	field: {
		type: 'string',
	},
	format: {
		type: 'string',
		default: 'd.m.Y t',
	},
	date: {
		type: 'boolean',
		default: false,
	},
	year: {
		type: 'string',
		default: 'numeric',
	},
	month: {
		type: 'string',
		default: 'numeric',
	},
	day: {
		type: 'string',
		default: 'numeric',
	},
	hour: {
		type: 'boolean',
		default: 'numeric',
	},
	hour12: {
		type: 'string',
		default: false,
	},
	minute: {
		type: 'string',
		default: 'numeric',
	},
	second: {
		type: 'string',
		default: 'numeric',
	},
	zone: {
		type: 'string',
		default: 'en',
	},
	timeZone: {
		type: 'string',
		default: 'Europe/London',
	},
	timeZoneName: {
		type: 'string',
		default: 'undefined',
	},
	weekday: {
		type: 'string',
		default: 'undefined',
	},
	era: {
		type: 'string',
		default: 'undefined',
	},
	limit: {
		type: 'number',
		default: 100,
	},
	content: {
		type: 'string',
	},
};

export default dynamicContent;

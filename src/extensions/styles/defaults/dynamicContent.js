const dynamicContent = {
	'dc-error': {
		type: 'string',
		default: '',
	},
	'dc-status': {
		type: 'boolean',
		default: false,
	},
	'dc-type': {
		type: 'string',
		default: 'posts',
	},
	'dc-relation': {
		type: 'string',
		default: 'by-id',
	},
	'dc-id': {
		type: 'number',
	},
	'dc-author': {
		type: 'number',
		default: '',
	},
	'dc-show': {
		type: 'string',
		default: 'current',
	},
	'dc-field': {
		type: 'string',
	},
	'dc-date': {
		type: 'string',
		default: 'toLocaleDateString',
	},
	'dc-date-status': {
		type: 'boolean',
		default: false,
	},
	'dc-date-year': {
		type: 'string',
		default: 'numeric',
	},
	'dc-date-month': {
		type: 'string',
		default: 'numeric',
	},
	'dc-date-day': {
		type: 'string',
		default: 'numeric',
	},
	'dc-date-hour': {
		type: 'string',
		default: 'numeric',
	},
	'dc-date-minute': {
		type: 'string',
		default: 'numeric',
	},
	'dc-date-second': {
		type: 'string',
		default: 'numeric',
	},
	'dc-limit': {
		type: 'number',
		default: 100,
	},
	'dc-content': {
		type: 'string',
	},
};

export default dynamicContent;

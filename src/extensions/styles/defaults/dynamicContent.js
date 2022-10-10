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
	'dc-format': {
		type: 'string',
		default: 'DD MMMM YYYY',
	},
	'dc-date': {
		type: 'boolean',
		default: false,
	},
	'dc-year': {
		type: 'string',
		default: 'numeric',
	},
	'dc-month': {
		type: 'string',
		default: 'numeric',
	},
	'dc-day': {
		type: 'string',
		default: 'numeric',
	},
	'dc-hour': {
		type: 'boolean',
		default: 'numeric',
	},
	'dc-hour12': {
		type: 'string',
		default: false,
	},
	'dc-minute': {
		type: 'string',
		default: 'numeric',
	},
	'dc-second': {
		type: 'string',
		default: 'numeric',
	},
	'dc-zone': {
		type: 'string',
		default: 'en',
	},
	'dc-timezone': {
		type: 'string',
		default: 'Europe/London',
	},
	'dc-timezone-name': {
		type: 'string',
		default: 'undefined',
	},
	'dc-weekday': {
		type: 'string',
		default: 'undefined',
	},
	'dc-era': {
		type: 'string',
		default: 'undefined',
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

const dynamicContent = {
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
	'dc-content': {
		type: 'string',
	},
};

export default dynamicContent;

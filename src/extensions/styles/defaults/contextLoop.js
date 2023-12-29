const contextLoop = {
	'cl-status': {
		type: 'boolean',
	},
	'cl-source': {
		type: 'string',
	},
	'cl-type': {
		type: 'string',
	},
	'cl-relation': {
		type: 'string',
	},
	'cl-id': {
		type: 'number',
	},
	'cl-author': {
		type: 'number',
	},
	'cl-order-by': {
		type: 'string',
	},
	'cl-order': {
		type: 'string',
	},
	'cl-accumulator': {
		type: 'number',
	},
	'cl-grandchild-accumulator': {
		type: 'boolean',
		default: false,
	},
	'cl-acf-group': {
		type: 'number',
	},
};

export default contextLoop;

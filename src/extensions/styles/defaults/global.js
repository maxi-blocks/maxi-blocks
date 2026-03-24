import breakpoints from './breakpoints';

const global = {
	...breakpoints,
	'maxi-version-current': {
		type: 'string',
	},
	'maxi-version-origin': {
		type: 'string',
	},
	blockStyle: {
		type: 'string',
	},
	extraClassName: {
		type: 'string',
	},
	anchorLink: {
		type: 'string',
	},
	isFirstOnHierarchy: {
		type: 'boolean',
		// Default false so nested blocks are not undefined vs false after list updates / parse.
		// Top-level blocks still get true from withAttributes when !getBlockRootClientId(clientId).
		default: false,
	},
	linkSettings: {
		type: 'object',
	},
	uniqueID: {
		type: 'string',
	},
	customLabel: {
		type: 'string',
	},
	relations: {
		type: 'array',
	},
	preview: { type: 'boolean', default: false },
	ariaLabels: {
		type: 'object',
	},
};

export default global;

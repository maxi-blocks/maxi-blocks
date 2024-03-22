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

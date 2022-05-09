import breakpoints from './breakpoints';

const global = {
	...breakpoints,
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
	relations: {
		type: 'array',
		default: [],
	},
};

export default global;

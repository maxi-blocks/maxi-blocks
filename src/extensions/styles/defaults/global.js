import breakpoints from './breakpoints';

const global = {
	...breakpoints,
	parentBlockStyle: {
		type: 'string',
	},
	blockStyle: {
		type: 'string',
	},
	defaultBlockStyle: {
		type: 'string',
		default: 'maxi-def-light',
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
};

export default global;

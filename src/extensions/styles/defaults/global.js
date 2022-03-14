import breakpoints from './breakpoints';

const global = {
	...breakpoints,
	parentBlockStyle: {
		type: 'string',
	},
	blockStyle: {
		type: 'string',
	},
	blockStyleOriginal: {
		type: 'string',
		default: 'maxi-light',
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

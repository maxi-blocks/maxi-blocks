import { breakpoints } from '.';

const global = {
	...breakpoints,
	blockStyle: {
		type: 'string',
		default: 'maxi-light',
	},
	blockStyleBackground: {
		type: 'number',
		default: 1,
	},
	defaultBlockStyle: {
		type: 'string',
		default: 'maxi-def-light',
	},
	extraClassName: {
		type: 'string',
		default: '',
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

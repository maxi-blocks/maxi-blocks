import breakpoints from './breakpoints';

const global = {
	...breakpoints,
	mvc: {
		type: 'string',
		longLabel: 'maxi-version-current',
	},
	mvo: {
		type: 'string',
		longLabel: 'maxi-version-origin',
	},
	bs: {
		type: 'string',
		longLabel: 'blockStyle',
	},
	ecn: {
		type: 'string',
		longLabel: 'extraClassName',
	},
	al: {
		type: 'string',
		longLabel: 'anchorLink',
	},
	ioh: {
		type: 'boolean',
		longLabel: 'isFirstOnHierarchy',
	},
	lse: {
		type: 'object',
		longLabel: 'linkSettings',
	},
	uid: {
		type: 'string',
		longLabel: 'uniqueID',
	},
	cl: {
		type: 'string',
		longLabel: 'customLabel',
	},
	r: {
		type: 'array',
		longLabel: 'relations',
	},
};

export default global;

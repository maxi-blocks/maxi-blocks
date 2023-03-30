import breakpoints from './breakpoints';

const global = {
	...breakpoints,
	_mvc: {
		type: 'string',
		longLabel: 'maxi-version-current',
	},
	_mvo: {
		type: 'string',
		longLabel: 'maxi-version-origin',
	},
	_bs: {
		type: 'string',
		longLabel: 'blockStyle',
	},
	_ecn: {
		type: 'string',
		longLabel: 'extraClassName',
	},
	_al: {
		type: 'string',
		longLabel: 'anchorLink',
	},
	_ioh: {
		type: 'boolean',
		longLabel: 'isFirstOnHierarchy',
	},
	_lse: {
		type: 'object',
		longLabel: 'linkSettings',
	},
	_uid: {
		type: 'string',
		longLabel: 'uniqueID',
	},
	_cl: {
		type: 'string',
		longLabel: 'customLabel',
	},
	_r: {
		type: 'array',
		longLabel: 'relations',
	},
};

export default global;

const accordion = {
	_acl: {
		type: 'string',
		default: 'simple',
		longLabel: 'accordionLayout',
	},
	_apc: {
		type: 'boolean',
		default: true,
		longLabel: 'autoPaneClose',
	},
	_ico: {
		type: 'boolean',
		default: true,
		longLabel: 'isCollapsible',
	},
	_ad: {
		type: 'number',
		default: 0.3,
		longLabel: 'animationDuration',
	},
};

export default accordion;

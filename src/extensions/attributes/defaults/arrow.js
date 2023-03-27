import breakpointAttributesCreator from '../breakpointAttributesCreator';

const rawArrow = {
	'ar.s': {
		type: 'boolean',
		default: false,
		longLabel: 'arrow-status',
	},
	'ar-sid': {
		type: 'string',
		default: 'bottom',
		longLabel: 'arrow-side',
	},
	'ar-pos': {
		type: 'number',
		default: 50,
		longLabel: 'arrow-position',
	},
	'ar-w': {
		type: 'number',
		default: 80,
		longLabel: 'arrow-width',
	},
};

const arrow = {
	...breakpointAttributesCreator({
		obj: rawArrow,
	}),
	swb: {
		type: 'boolean',
		default: true,
		longLabel: 'show-warning-box',
	},
};

export default arrow;

import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';

const rawArrow = {
	'arrow-status': {
		type: 'boolean',
		default: false,
	},
	'arrow-side': {
		type: 'string',
		default: 'bottom',
	},
	'arrow-position': {
		type: 'number',
		default: 50,
	},
	'arrow-width': {
		type: 'number',
		default: 80,
	},
};

const arrow = {
	...breakpointAttributesCreator({
		obj: rawArrow,
	}),
	'show-warning-box': {
		type: 'boolean',
		default: true,
	},
};

export default arrow;

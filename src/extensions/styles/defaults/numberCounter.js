import paletteAttributesCreator from '../paletteAttributesCreator';
import breakpointAttributesCreator from '../breakpointAttributesCreator';

export const numberCounter = {
	'number-counter-status': {
		type: 'boolean',
		default: true,
	},
	'number-counter-preview': {
		type: 'boolean',
		default: true,
	},
	'number-counter-percentage-sign-status': {
		type: 'boolean',
		default: false,
	},
	'number-counter-rounded-status': {
		type: 'boolean',
		default: false,
	},
	'number-counter-circle-status': {
		type: 'boolean',
		default: false,
	},
	'number-counter-start': {
		type: 'number',
		default: 0,
	},
	'number-counter-end': {
		type: 'number',
		default: 100,
	},
	'number-counter-stroke': {
		type: 'number',
		default: 5,
	},
	'number-counter-duration': {
		type: 'number',
		default: 1,
	},
	'number-counter-start-animation': {
		type: 'string',
		default: 'page-load',
	},

	...paletteAttributesCreator({
		prefix: 'number-counter-circle-background-',
		palette: 2,
	}),
	...paletteAttributesCreator({
		prefix: 'number-counter-circle-bar-',
		palette: 4,
	}),

	...breakpointAttributesCreator({
		obj: {
			'number-counter-title-font-size': {
				type: 'number',
				default: 40,
			},
			'number-counter-title-font-family': {
				type: 'string',
				default: 'Roboto',
			},
			...paletteAttributesCreator({
				prefix: 'number-counter-text-',
				palette: 4,
			}),
			...paletteAttributesCreator({
				prefix: 'number-counter-circle-bar-',
				palette: 4,
			}),
		},
	}),
};

export default numberCounter;

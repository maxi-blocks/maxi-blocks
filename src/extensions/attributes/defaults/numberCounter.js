import breakpointAttributesCreator from '../breakpointAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';
import alignment from './alignment';

const numberCounter = {
	...breakpointAttributesCreator({
		obj: {
			'nc-wa': {
				type: 'boolean',
				default: false,
				longLabel: 'number-counter-width-auto',
			},
		},
	}),
	'nc.s': {
		type: 'boolean',
		default: true,
		longLabel: 'number-counter-status',
	},
	'nc-pr': {
		type: 'boolean',
		default: true,
		longLabel: 'number-counter-preview',
	},
	'nc-psi.s': {
		type: 'boolean',
		default: false,
		longLabel: 'number-counter-percentage-sign-status',
	},
	'nc-rou.s': {
		type: 'boolean',
		default: false,
		longLabel: 'number-counter-rounded-status',
	},
	'nc-ci.s': {
		type: 'boolean',
		default: false,
		longLabel: 'number-counter-circle-status',
	},
	'nc-sta': {
		type: 'number',
		default: 0,
		longLabel: 'number-counter-start',
	},
	'nc-e': {
		type: 'number',
		default: 100,
		longLabel: 'number-counter-end',
	},
	'nc-str': {
		type: 'number',
		default: 5,
		longLabel: 'number-counter-stroke',
	},
	'nc-du': {
		type: 'number',
		default: 1,
		longLabel: 'number-counter-duration',
	},
	'nc-san': {
		type: 'string',
		default: 'page-load',
		longLabel: 'number-counter-start-animation',
	},
	'nc-saof': {
		type: 'number',
		default: 100,
		longLabel: 'number-counter-start-animation-offset',
	},

	...paletteAttributesCreator({
		prefix: 'nccb-', // number-counter-circle-background-
		palette: 2,
	}),
	...paletteAttributesCreator({
		prefix: 'nccba-', // number-counter-circle-bar-
		palette: 4,
	}),

	...breakpointAttributesCreator({
		obj: {
			'nc-ti-fs': {
				type: 'number',
				default: 40,
				longLabel: 'number-counter-title-font-size',
			},
			ff: {
				type: 'string',
				default: 'Roboto',
				longLabel: 'font-family',
			},
			fwe: {
				type: 'string',
			},
			...paletteAttributesCreator({
				prefix: 'nct-', // number-counter-text-
				palette: 4,
			}),
			...paletteAttributesCreator({
				prefix: 'nccba-', // number-counter-circle-bar-
				palette: 4,
			}),
		},
	}),
	...alignment,
};

export default numberCounter;

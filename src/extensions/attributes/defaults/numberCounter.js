import breakpointAttributesCreator from '../breakpointAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';
import alignment from './alignment';

const numberCounter = {
	...breakpointAttributesCreator({
		obj: {
			nc_wa: {
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
	nc_pr: {
		type: 'boolean',
		default: true,
		longLabel: 'number-counter-preview',
	},
	'nc_psi.s': {
		type: 'boolean',
		default: false,
		longLabel: 'number-counter-percentage-sign-status',
	},
	'nc_rou.s': {
		type: 'boolean',
		default: false,
		longLabel: 'number-counter-rounded-status',
	},
	'nc_ci.s': {
		type: 'boolean',
		default: false,
		longLabel: 'number-counter-circle-status',
	},
	nc_sta: {
		type: 'number',
		default: 0,
		longLabel: 'number-counter-start',
	},
	nc_e: {
		type: 'number',
		default: 100,
		longLabel: 'number-counter-end',
	},
	'nc-str': {
		type: 'number',
		default: 5,
		longLabel: 'number-counter-stroke',
	},
	nc_du: {
		type: 'number',
		default: 1,
		longLabel: 'number-counter-duration',
	},
	nc_san: {
		type: 'string',
		default: 'page-load',
		longLabel: 'number-counter-start-animation',
	},
	nc_saof: {
		type: 'number',
		default: 100,
		longLabel: 'number-counter-start-animation-offset',
	},

	...paletteAttributesCreator({
		prefix: 'nccb-',
		longPrefix: 'number-counter-circle-background-',
		palette: 2,
	}),
	...paletteAttributesCreator({
		prefix: 'nccba-',
		longPrefix: 'number-counter-circle-bar-',
		palette: 4,
	}),

	...breakpointAttributesCreator({
		obj: {
			'nc-ti_fs': {
				type: 'number',
				default: 40,
				longLabel: 'number-counter-title-font-size',
			},
			_ff: {
				type: 'string',
				default: 'Roboto',
				longLabel: 'font-family',
			},
			_fwe: {
				type: 'string',
				longLabel: 'font-weight',
			},
			...paletteAttributesCreator({
				prefix: 'nct-',
				longPrefix: 'number-counter-text-',
				palette: 4,
			}),
			...paletteAttributesCreator({
				prefix: 'nccba-',
				longPrefix: 'number-counter-circle-bar-',
				palette: 4,
			}),
		},
	}),
	...alignment,
};

export default numberCounter;

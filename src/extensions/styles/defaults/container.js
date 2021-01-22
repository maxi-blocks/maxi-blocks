/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const container = (() => {
	let response = {};
	breakpoints.forEach(breakpoint => {
		response = {
			...response,
			[`container-max-width-unit-${breakpoint}`]: {
				type: 'string',
				default: 'px',
			},
			[`container-max-width-${breakpoint}`]: {
				type: 'number',
				default: '',
			},
			[`container-width-unit-${breakpoint}`]: {
				type: 'string',
				default: '%',
			},
			[`container-width-${breakpoint}`]: {
				type: 'number',
				default: '',
			},
			[`container-min-width-unit-${breakpoint}`]: {
				type: 'string',
				default: 'px',
			},
			[`container-min-width-${breakpoint}`]: {
				type: 'number',
				default: '',
			},
			[`container-max-height-unit-${breakpoint}`]: {
				type: 'string',
				default: 'px',
			},
			[`container-max-height-${breakpoint}`]: {
				type: 'number',
				default: '',
			},
			[`container-height-unit-${breakpoint}`]: {
				type: 'string',
				default: 'px',
			},
			[`container-height-${breakpoint}`]: {
				type: 'number',
				default: '',
			},
			[`container-min-height-unit-${breakpoint}`]: {
				type: 'string',
				default: 'px',
			},
			[`container-min-height-${breakpoint}`]: {
				type: 'number',
				default: '',
			},
		};
	});

	response = {
		...response,
		'container-size-advanced-options': {
			type: 'boolean',
			default: false,
		},
		'container-max-width-general': {
			type: 'number',
			default: 1170,
		},
		'container-max-width-xxl': {
			type: 'number',
			default: 1790,
		},
		'container-max-width-xl': {
			type: 'number',
			default: 1170,
		},
		'container-max-width-l': {
			type: 'number',
			default: 90,
		},
		'container-max-width-unit-l': {
			type: 'number',
			default: '%',
		},
		'container-max-width-m': {
			type: 'number',
			default: 90,
		},
		'container-max-width-unit-m': {
			type: 'number',
			default: '%',
		},
		'container-max-width-s': {
			type: 'number',
			default: 90,
		},
		'container-max-width-unit-s': {
			type: 'number',
			default: '%',
		},
		'container-max-width-xs': {
			type: 'number',
			default: 90,
		},
		'container-max-width-unit-xs': {
			type: 'number',
			default: '%',
		},
		'container-width-l': {
			type: 'number',
			default: 1170,
		},
		'container-width-unit-l': {
			type: 'number',
			default: 'px',
		},
		'container-width-m': {
			type: 'number',
			default: 1000,
		},
		'container-width-unit-m': {
			type: 'number',
			default: 'px',
		},
		'container-width-s': {
			type: 'number',
			default: 700,
		},
		'container-width-unit-s': {
			type: 'number',
			default: 'px',
		},
		'container-width-xs': {
			type: 'number',
			default: 460,
		},
		'container-width-unit-xs': {
			type: 'number',
			default: 'px',
		},
	};

	return response;
})();

export default container;

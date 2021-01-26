/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

export const icon = (() => {
	let response = {};
	breakpoints.forEach(breakpoint => {
		response = {
			...response,
			[`icon-size-${breakpoint}`]: {
				type: 'number',
				default: 0,
			},
			[`icon-size-unit-${breakpoint}`]: {
				type: 'string',
				default: '',
			},
		};
	});
	response = {
		...response,
		'icon-name': {
			type: 'string',
			default: '',
		},
		'icon-spacing': {
			type: 'number',
			default: 0,
		},
		'icon-color': {
			type: 'string',
			default: '#000',
		},
		'icon-background-color': {
			type: 'string',
			default: '',
		},
		'icon-background-active-media': {
			type: 'string',
			default: 'color',
		},
		'icon-background-gradient': {
			type: 'string',
			default: '',
		},
		'icon-background-gradient-opacity': {
			type: 'number',
			default: 1,
		},
		'icon-position': {
			type: 'string',
			default: 'left',
		},
		'icon-size-general': {
			type: 'number',
			default: 21,
		},
		'icon-size-unit-general': {
			type: 'string',
			default: 'px',
		},
		'icon-custom-padding': {
			type: 'boolean',
			default: false,
		},
	};

	return response;
})();

export const iconPadding = (() => {
	let response = {};
	breakpoints.forEach(breakpoint => {
		response = {
			...response,
			[`icon-padding-top-${breakpoint}`]: {
				type: 'string',
				default: '',
			},
			[`icon-padding-right-${breakpoint}`]: {
				type: 'string',
				default: '',
			},
			[`icon-padding-bottom-${breakpoint}`]: {
				type: 'string',
				default: '',
			},
			[`icon-padding-left-${breakpoint}`]: {
				type: 'string',
				default: '',
			},
			[`icon-padding-sync-${breakpoint}`]: {
				type: 'boolean',
				default: '',
			},
			[`icon-padding-unit-${breakpoint}`]: {
				type: 'string',
				default: '',
			},
			[`icon-padding-sync-${breakpoint}`]: {
				type: 'boolean',
				default: '',
			},
			[`icon-padding-unit-${breakpoint}`]: {
				type: 'string',
				default: '',
			},
		};
	});
	response = {
		...response,
		'icon-padding-top-general': {
			type: 'string',
			default: 10,
		},
		'icon-padding-right-general': {
			type: 'string',
			default: 20,
		},
		'icon-padding-bottom-general': {
			type: 'string',
			default: 10,
		},
		'icon-padding-left-general': {
			type: 'string',
			default: 20,
		},
		'icon-padding-sync-general': {
			type: 'boolean',
			default: true,
		},
		'icon-padding-unit-general': {
			type: 'string',
			default: 'px',
		},
	};

	return response;
})();

export const iconBorder = (() => {
	let response = {};
	breakpoints.forEach(breakpoint => {
		response = {
			...response,
			[`icon-border-color-${breakpoint}`]: {
				type: 'string',
				default: '',
			},
			[`icon-border-style-${breakpoint}`]: {
				type: 'string',
				default: '',
			},
		};
	});
	response = {
		...response,
		'icon-border-color-general': {
			type: 'string',
			default: '#ffffff',
		},
		'icon-border-style-general': {
			type: 'string',
			default: 'none',
		},
	};
	return response;
})();

export const iconBorderWidth = (() => {
	let response = {};
	breakpoints.forEach(breakpoint => {
		response = {
			...response,
			[`icon-border-top-width-${breakpoint}`]: {
				type: 'number',
				default: '',
			},
			[`icon-border-right-width-${breakpoint}`]: {
				type: 'number',
				default: '',
			},
			[`icon-border-bottom-width-${breakpoint}`]: {
				type: 'number',
				default: '',
			},
			[`icon-border-left-width-${breakpoint}`]: {
				type: 'number',
				default: '',
			},
			[`icon-border-sync-width-${breakpoint}`]: {
				type: 'boolean',
				default: '',
			},
			[`icon-border-unit-width-${breakpoint}`]: {
				type: 'string',
				default: '',
			},
		};
	});

	response = {
		...response,
		'icon-border-sync-width-general': {
			type: 'boolean',
			default: true,
		},
		'icon-border-unit-width-general': {
			type: 'string',
			default: 'px',
		},
	};

	return response;
})();

import { borderRadius } from './border';

export const iconBorderRadius = (() => {
	const response = {};

	Object.keys(borderRadius).forEach(key => {
		const newKey = `icon-${key}`;
		const value = { ...borderRadius[key] };

		response[newKey] = value;
	});

	return response;
})();

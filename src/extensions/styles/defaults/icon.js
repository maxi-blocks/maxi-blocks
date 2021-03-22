/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

import padding from './padding';
import { border, borderWidth, borderRadius } from './border';

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
			},
		};
	});
	response = {
		...response,
		'icon-name': {
			type: 'string',
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
		},
		'icon-background-active-media': {
			type: 'string',
			default: 'color',
		},
		'icon-background-gradient': {
			type: 'string',
		},
		'icon-background-gradient-opacity': {
			type: 'number',
		},
		'icon-position': {
			type: 'string',
			default: 'right',
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

	Object.keys(padding).forEach(key => {
		const newKey = `icon-${key}`;
		const value = { ...padding[key] };

		response[newKey] = value;
	});

	response = {
		...response,
		'icon-padding-top-general': {
			type: 'string',
			default: 2,
		},
		'icon-padding-right-general': {
			type: 'string',
			default: 2,
		},
		'icon-padding-bottom-general': {
			type: 'string',
			default: 2,
		},
		'icon-padding-left-general': {
			type: 'string',
			default: 2,
		},
	};

	return response;
})();

export const iconBorder = (() => {
	const response = {};

	Object.keys(border).forEach(key => {
		const newKey = `icon-${key}`;
		const value = { ...border[key] };

		response[newKey] = value;
	});

	return response;
})();

export const iconBorderWidth = (() => {
	const response = {};

	Object.keys(borderWidth).forEach(key => {
		const newKey = `icon-${key}`;
		const value = { ...borderWidth[key] };

		response[newKey] = value;
	});

	return response;
})();

export const iconBorderRadius = (() => {
	const response = {};

	Object.keys(borderRadius).forEach(key => {
		const newKey = `icon-${key}`;
		const value = { ...borderRadius[key] };

		response[newKey] = value;
	});

	return response;
})();

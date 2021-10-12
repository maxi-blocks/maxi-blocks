import {
	border as defaultBorder,
	borderWidth as defaultBorderWidth,
	buttonBorder as defaultButtonBorder,
	buttonBorderWidth as defaultButtonBorderWidth,
} from '../../extensions/styles/defaults/border';

import {
	iconBorder as defaultIconBorder,
	iconBorderWidth as defaultIconBorderWidth,
} from '../../extensions/styles/defaults/iconBorder';

export const borderNone = (prefix = '', isHover) => {
	let response = {};

	let currentDefaultBorder;
	let currentDefaultBorderWidth;

	switch (prefix) {
		case 'icon-':
			currentDefaultBorder = defaultIconBorder;
			break;

		case 'button-':
			currentDefaultBorder = defaultButtonBorder;
			break;

		default:
			currentDefaultBorder = defaultBorder;
	}

	switch (prefix) {
		case 'icon-':
			currentDefaultBorderWidth = defaultIconBorderWidth;
			break;

		case 'button-':
			currentDefaultBorderWidth = defaultButtonBorderWidth;
			break;

		default:
			currentDefaultBorderWidth = defaultBorderWidth;
	}

	response = {
		[`${prefix}border-color`]:
			currentDefaultBorder[`${prefix}border-color-general`].default,
		[`${prefix}border-style`]: isHover
			? 'none'
			: currentDefaultBorder[`${prefix}border-style-general`].default,
		[`${prefix}border-top-width`]:
			currentDefaultBorderWidth[`${prefix}border-top-width-general`]
				.default,
		[`${prefix}border-right-width`]:
			currentDefaultBorderWidth[`${prefix}border-right-width-general`]
				.default,
		[`${prefix}border-bottom-width`]:
			currentDefaultBorderWidth[`${prefix}border-bottom-width-general`]
				.default,
		[`${prefix}border-left-width`]:
			currentDefaultBorderWidth[`${prefix}border-left-width-general`]
				.default,
		[`${prefix}border-sync-width`]:
			currentDefaultBorderWidth[`${prefix}border-sync-width-general`]
				.default,
		[`${prefix}border-unit-width`]:
			currentDefaultBorderWidth[`${prefix}border-unit-width-general`]
				.default,
	};
	return response;
};

export const borderSolid = prefix => {
	let response = {};
	response = {
		[`${prefix}border-color`]: '',
		[`${prefix}border-style`]: 'solid',
		[`${prefix}border-top-width`]: 2,
		[`${prefix}border-right-width`]: 2,
		[`${prefix}border-bottom-width`]: 2,
		[`${prefix}border-left-width`]: 2,
		[`${prefix}border-sync-width`]: true,
		[`${prefix}border-unit-width`]: 'px',
	};
	return response;
};

export const borderDashed = prefix => {
	let response = {};
	response = {
		[`${prefix}border-color`]: '',
		[`${prefix}border-style`]: 'dashed',
		[`${prefix}border-top-width`]: 2,
		[`${prefix}border-right-width`]: 2,
		[`${prefix}border-bottom-width`]: 2,
		[`${prefix}border-left-width`]: 2,
		[`${prefix}border-sync-width`]: true,
		[`${prefix}border-unit-width`]: 'px',
	};
	return response;
};

export const borderDotted = prefix => {
	let response = {};
	response = {
		[`${prefix}border-color`]: '',
		[`${prefix}border-style`]: 'dotted',
		[`${prefix}border-top-width`]: 2,
		[`${prefix}border-right-width`]: 2,
		[`${prefix}border-bottom-width`]: 2,
		[`${prefix}border-left-width`]: 2,
		[`${prefix}border-sync-width`]: true,
		[`${prefix}border-unit-width`]: 'px',
	};
	return response;
};

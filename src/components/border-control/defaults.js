import {
	border as defaultBorder,
	borderWidth as defaultBorderWidth,
} from '../../extensions/styles/defaults/border';

export const borderNone = (prefix = '', isHover) => {
	let response = {};

	response = {
		[`${prefix}border-color`]:
			defaultBorder[`${prefix}border-color-general`].default,
		[`${prefix}border-style`]: isHover
			? 'none'
			: defaultBorder[`${prefix}border-style-general`].default,
		[`${prefix}border-top-width`]:
			defaultBorderWidth[`${prefix}border-top-width-general`].default,
		[`${prefix}border-right-width`]:
			defaultBorderWidth[`${prefix}border-right-width-general`].default,
		[`${prefix}border-bottom-width`]:
			defaultBorderWidth[`${prefix}border-bottom-width-general`].default,
		[`${prefix}border-left-width`]:
			defaultBorderWidth[`${prefix}border-left-width-general`].default,
		[`${prefix}border-sync-width`]:
			defaultBorderWidth[`${prefix}border-sync-width-general`].default,
		[`${prefix}border-unit-width`]:
			defaultBorderWidth[`${prefix}border-unit-width-general`].default,
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

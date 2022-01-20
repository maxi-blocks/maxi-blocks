import {
	border as defaultBorder,
	borderWidth as defaultBorderWidth,
} from '../../extensions/styles/defaults/border';

import { prefixAttributesCreator } from '../../extensions/styles';

const getDefaultBorderWidth = (
	prefix,
	{ BorderTopWidth, BorderRightWidth, BorderBottomWidth, BorderLeftWidth }
) => {
	return {
		[`${prefix}border-top-width`]: BorderTopWidth || 2,
		[`${prefix}border-right-width`]: BorderRightWidth || 2,
		[`${prefix}border-bottom-width`]: BorderBottomWidth || 2,
		[`${prefix}border-left-width`]: BorderLeftWidth || 2,
	};
};

export const borderNone = (prefix = '', isHover) => {
	let response = {};

	const currentDefaultBorder = prefix
		? prefixAttributesCreator({ obj: defaultBorder, prefix })
		: defaultBorder;

	const currentDefaultBorderWidth = prefix
		? prefixAttributesCreator({ obj: defaultBorderWidth, prefix })
		: defaultBorderWidth;

	response = {
		[`${prefix}border-palette-status`]:
			currentDefaultBorder[`${prefix}border-palette-status-general`]
				.default,
		[`${prefix}border-palette-color`]:
			currentDefaultBorder[`${prefix}border-palette-color-general`]
				.default,
		[`${prefix}border-palette-opacity`]: 1,
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

export const borderSolid = (prefix, defaultWidthValue) => {
	let response = {};
	response = {
		[`${prefix}border-style`]: 'solid',
		[`${prefix}border-sync-width`]: 'all',
		[`${prefix}border-unit-width`]: 'px',
		...getDefaultBorderWidth(prefix, defaultWidthValue),
	};
	return response;
};

export const borderDashed = (prefix, defaultWidthValue) => {
	let response = {};
	response = {
		[`${prefix}border-style`]: 'dashed',
		[`${prefix}border-sync-width`]: 'all',
		[`${prefix}border-unit-width`]: 'px',
		...getDefaultBorderWidth(prefix, defaultWidthValue),
	};
	return response;
};

export const borderDotted = (prefix, defaultWidthValue) => {
	let response = {};
	response = {
		[`${prefix}border-style`]: 'dotted',
		[`${prefix}border-sync-width`]: 'all',
		[`${prefix}border-unit-width`]: 'px',
		...getDefaultBorderWidth(prefix, defaultWidthValue),
	};
	return response;
};

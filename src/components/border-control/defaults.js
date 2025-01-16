import {
	border as defaultBorder,
	borderWidth as defaultBorderWidth,
} from '@extensions/styles/defaults/border';

import { prefixAttributesCreator } from '@extensions/styles';

const getBorderDefault = (
	prefix,
	{ borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth }
) => {
	return {
		[`${prefix}border-sync-width`]: 'all',
		[`${prefix}border-unit-width`]: 'px',
		[`${prefix}border-top-width`]: borderTopWidth || 2,
		[`${prefix}border-right-width`]: borderRightWidth || 2,
		[`${prefix}border-bottom-width`]: borderBottomWidth || 2,
		[`${prefix}border-left-width`]: borderLeftWidth || 2,
	};
};

export const borderNone = (prefix = '') => {
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
		[`${prefix}border-palette-opacity`]:
			currentDefaultBorder[`${prefix}border-palette-opacity-general`]
				.default,
		[`${prefix}border-color`]:
			currentDefaultBorder[`${prefix}border-color-general`].default,
		[`${prefix}border-style`]:
			currentDefaultBorder[`${prefix}border-style-general`].default,
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
		...getBorderDefault(prefix, defaultWidthValue),
	};
	return response;
};

export const borderDashed = (prefix, defaultWidthValue) => {
	let response = {};
	response = {
		[`${prefix}border-style`]: 'dashed',
		...getBorderDefault(prefix, defaultWidthValue),
	};
	return response;
};

export const borderDotted = (prefix, defaultWidthValue) => {
	let response = {};
	response = {
		[`${prefix}border-style`]: 'dotted',
		...getBorderDefault(prefix, defaultWidthValue),
	};
	return response;
};

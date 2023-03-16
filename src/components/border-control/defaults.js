import {
	border as defaultBorder,
	borderWidth as defaultBorderWidth,
} from '../../extensions/styles/defaults/border';

import {
	getAttributeKey,
	getAttributeValue,
	prefixAttributesCreator,
} from '../../extensions/styles';

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

	const getDefaultAttributeValue = (target, props = currentDefaultBorder) =>
		getAttributeValue({
			target,
			prefix,
			props,
			breakpoint: 'general',
		}).default;

	response = {
		[getAttributeKey('border-palette-status', false, prefix)]:
			getDefaultAttributeValue('border-palette-status'),
		[getAttributeKey('border-palette-color', false, prefix)]:
			getDefaultAttributeValue('border-palette-color'),
		[getAttributeKey('border-palette-opacity', false, prefix)]:
			getDefaultAttributeValue('border-palette-opacity'),
		[getAttributeKey('border-color', false, prefix)]:
			getDefaultAttributeValue('border-color'),
		[getAttributeKey('border-style', false, prefix)]:
			getDefaultAttributeValue('border-style'),
		[getAttributeKey('border-top-width', false, prefix)]:
			getDefaultAttributeValue(
				'border-top-width',
				currentDefaultBorderWidth
			),
		[getAttributeKey('border-right-width', false, prefix)]:
			getDefaultAttributeValue(
				'border-right-width',
				currentDefaultBorderWidth
			),
		[getAttributeKey('border-bottom-width', false, prefix)]:
			getDefaultAttributeValue(
				'border-bottom-width',
				currentDefaultBorderWidth
			),
		[getAttributeKey('border-left-width', false, prefix)]:
			getDefaultAttributeValue(
				'border-left-width',
				currentDefaultBorderWidth
			),
		[getAttributeKey('border-sync-width', false, prefix)]:
			getDefaultAttributeValue('border-sync-width', currentDefaultBorder),
		[getAttributeKey('border-unit-width', false, prefix)]:
			getDefaultAttributeValue('border-unit-width', currentDefaultBorder),
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

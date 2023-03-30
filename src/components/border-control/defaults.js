import {
	border as defaultBorder,
	borderWidth as defaultBorderWidth,
} from '../../extensions/attributes/defaults/border';

import {
	getAttributeKey,
	getAttributesValue,
	prefixAttributesCreator,
} from '../../extensions/attributes';

const getBorderDefault = (
	prefix,
	{ borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth }
) => {
	return {
		[`${prefix}border-width-sync`]: 'all',
		[`${prefix}border-width.u`]: 'px',
		[`${prefix}border-width-top`]: borderTopWidth || 2,
		[`${prefix}border-width-right`]: borderRightWidth || 2,
		[`${prefix}border-width-bottom`]: borderBottomWidth || 2,
		[`${prefix}border-width-left`]: borderLeftWidth || 2,
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
		getAttributesValue({
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
		[getAttributeKey('border-width-top', false, prefix)]:
			getDefaultAttributeValue(
				'border-width-top',
				currentDefaultBorderWidth
			),
		[getAttributeKey('border-width-right', false, prefix)]:
			getDefaultAttributeValue(
				'border-width-right',
				currentDefaultBorderWidth
			),
		[getAttributeKey('border-width-bottom', false, prefix)]:
			getDefaultAttributeValue(
				'border-width-bottom',
				currentDefaultBorderWidth
			),
		[getAttributeKey('border-width-left', false, prefix)]:
			getDefaultAttributeValue(
				'border-width-left',
				currentDefaultBorderWidth
			),
		[getAttributeKey('border-width-sync', false, prefix)]:
			getDefaultAttributeValue('border-width-sync', currentDefaultBorder),
		[getAttributeKey('border-width-unit', false, prefix)]:
			getDefaultAttributeValue('border-width-unit', currentDefaultBorder),
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

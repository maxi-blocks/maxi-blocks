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
		[`${prefix}bo_w.sy`]: 'all',
		[`${prefix}bo_w.u`]: 'px',
		[`${prefix}bo_w.t`]: borderTopWidth || 2,
		[`${prefix}bo_w.r`]: borderRightWidth || 2,
		[`${prefix}bo_w.b`]: borderBottomWidth || 2,
		[`${prefix}bo_w.l`]: borderLeftWidth || 2,
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
			breakpoint: 'g',
		}).default;

	response = {
		[getAttributeKey({ key: 'bo_ps', prefix })]:
			getDefaultAttributeValue('bo_ps'),
		[getAttributeKey({ key: 'bo_pc', prefix })]:
			getDefaultAttributeValue('bo_pc'),
		[getAttributeKey({ key: 'bo_po', prefix })]:
			getDefaultAttributeValue('bo_po'),
		[getAttributeKey({ key: 'bo_cc', prefix })]:
			getDefaultAttributeValue('bo_cc'),
		[getAttributeKey({ key: 'bo_s', prefix })]:
			getDefaultAttributeValue('bo_s'),
		[getAttributeKey({ key: 'bo_w.t', prefix })]: getDefaultAttributeValue(
			'bo_w.t',
			currentDefaultBorderWidth
		),
		[getAttributeKey({ key: 'bo_w.r', prefix })]: getDefaultAttributeValue(
			'bo_w.r',
			currentDefaultBorderWidth
		),
		[getAttributeKey({ key: 'bo_w.b', prefix })]: getDefaultAttributeValue(
			'bo_w.b',
			currentDefaultBorderWidth
		),
		[getAttributeKey({ key: 'bo_w.l', prefix })]: getDefaultAttributeValue(
			'bo_w.l',
			currentDefaultBorderWidth
		),
		[getAttributeKey({ key: 'bo_w.sy', prefix })]: getDefaultAttributeValue(
			'bo_w.sy',
			currentDefaultBorderWidth
		),
		[getAttributeKey({ key: 'bo_w.u', prefix })]: getDefaultAttributeValue(
			'bo_w.u',
			currentDefaultBorderWidth
		),
	};

	return response;
};

export const borderSolid = (prefix, defaultWidthValue) => {
	let response = {};
	response = {
		[`${prefix}bo_s`]: 'solid',
		...getBorderDefault(prefix, defaultWidthValue),
	};
	return response;
};

export const borderDashed = (prefix, defaultWidthValue) => {
	let response = {};
	response = {
		[`${prefix}bo_s`]: 'dashed',
		...getBorderDefault(prefix, defaultWidthValue),
	};
	return response;
};

export const borderDotted = (prefix, defaultWidthValue) => {
	let response = {};
	response = {
		[`${prefix}bo_s`]: 'dotted',
		...getBorderDefault(prefix, defaultWidthValue),
	};
	return response;
};

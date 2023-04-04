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
			breakpoint: 'general',
		}).default;

	response = {
		[getAttributeKey('bo_ps', false, prefix)]:
			getDefaultAttributeValue('bo_ps'),
		[getAttributeKey('bo_pc', false, prefix)]:
			getDefaultAttributeValue('bo_pc'),
		[getAttributeKey('bo_po', false, prefix)]:
			getDefaultAttributeValue('bo_po'),
		[getAttributeKey('bo_cc', false, prefix)]:
			getDefaultAttributeValue('bo_cc'),
		[getAttributeKey('bo_s', false, prefix)]:
			getDefaultAttributeValue('bo_s'),
		[getAttributeKey('bo_w.t', false, prefix)]: getDefaultAttributeValue(
			'bo_w.t',
			currentDefaultBorderWidth
		),
		[getAttributeKey('bo_w.r', false, prefix)]: getDefaultAttributeValue(
			'bo_w.r',
			currentDefaultBorderWidth
		),
		[getAttributeKey('bo_w.b', false, prefix)]: getDefaultAttributeValue(
			'bo_w.b',
			currentDefaultBorderWidth
		),
		[getAttributeKey('bo_w.l', false, prefix)]: getDefaultAttributeValue(
			'bo_w.l',
			currentDefaultBorderWidth
		),
		[getAttributeKey('bo_w.sy', false, prefix)]: getDefaultAttributeValue(
			'bo_w.sy',
			currentDefaultBorder
		),
		[getAttributeKey('bo_w.u', false, prefix)]: getDefaultAttributeValue(
			'bo_w.u',
			currentDefaultBorder
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

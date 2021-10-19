/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults/index';
import { getPrefixedAttributes } from '../../extensions/styles';

/**
 * Attributes
 */
const prefix = 'number-counter-';
const attributes = {
	...attributesData.global,
	customLabel: {
		type: 'string',
		default: __('Number Counter', 'maxi-blocks'),
	},
	blockFullWidth: {
		type: 'string',
		default: 'normal',
	},
	...attributesData.display,
	...getPrefixedAttributes(attributesData.margin, prefix),
	...getPrefixedAttributes(attributesData.padding, prefix),
	...attributesData.margin,
	...attributesData.padding,
	...attributesData.blockBackground,
	...getPrefixedAttributes(attributesData.border, prefix),
	...getPrefixedAttributes(attributesData.borderHover, prefix),
	...getPrefixedAttributes(attributesData.borderRadius, prefix),
	...getPrefixedAttributes(attributesData.borderRadiusHover, prefix),
	...getPrefixedAttributes(attributesData.borderWidth, prefix),
	...getPrefixedAttributes(attributesData.borderWidthHover, prefix),
	...attributesData.border,
	...attributesData.borderHover,
	...attributesData.borderRadius,
	...attributesData.borderRadiusHover,
	...attributesData.borderWidth,
	...attributesData.borderWidthHover,
	...getPrefixedAttributes(attributesData.boxShadow, prefix),
	...getPrefixedAttributes(attributesData.boxShadowHover, prefix),
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...attributesData.numberCounter,
	...attributesData.opacity,
	...attributesData.position,
	...attributesData.size,
	...{
		...getPrefixedAttributes(attributesData.size, prefix),
		[`${prefix}width-general`]: {
			type: 'number',
			default: 250,
		},
		[`${prefix}width-unit-general`]: {
			type: 'string',
			default: 'px',
		},
	},
	...attributesData.transform,
	...attributesData.zIndex,
	...attributesData.overflow,
};

export default attributes;

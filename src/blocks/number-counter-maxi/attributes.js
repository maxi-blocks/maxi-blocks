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

	/**
	 * Block styles
	 */
	...attributesData.numberCounter,
	customLabel: {
		type: 'string',
		default: __('Number Counter', 'maxi-blocks'),
	},
	...getPrefixedAttributes(attributesData.border, prefix),
	...getPrefixedAttributes(attributesData.borderHover, prefix),
	...getPrefixedAttributes(attributesData.borderRadius, prefix),
	...getPrefixedAttributes(attributesData.borderRadiusHover, prefix),
	...getPrefixedAttributes(attributesData.borderWidth, prefix),
	...getPrefixedAttributes(attributesData.borderWidthHover, prefix),
	...getPrefixedAttributes(attributesData.boxShadow, prefix),
	...getPrefixedAttributes(attributesData.boxShadowHover, prefix),
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
	...getPrefixedAttributes(attributesData.margin, prefix),
	...getPrefixedAttributes(attributesData.padding, prefix),

	/**
	 * Canvas styles
	 */
	blockFullWidth: {
		type: 'string',
		default: 'normal',
	},
	...attributesData.blockBackground,
	...attributesData.border,
	...attributesData.borderHover,
	...attributesData.borderRadius,
	...attributesData.borderRadiusHover,
	...attributesData.borderWidth,
	...attributesData.borderWidthHover,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...attributesData.opacity,
	...attributesData.size,
	...attributesData.margin,
	...attributesData.padding,

	/**
	 * Advanced
	 */
	...attributesData.transform,
	...attributesData.display,
	...attributesData.position,
	...attributesData.overflow,
	...attributesData.zIndex,
	...attributesData.customCss,
};

export default attributes;

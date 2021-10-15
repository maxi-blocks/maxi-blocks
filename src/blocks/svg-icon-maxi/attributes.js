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
const prefix = 'svg-';
const attributes = {
	...attributesData.global,
	customLabel: {
		type: 'string',
		default: __('SVG Icon', 'maxi-blocks'),
	},
	openFirstTime: {
		type: 'boolean',
		default: true,
	},
	blockFullWidth: {
		type: 'string',
		default: 'normal',
	},
	svgType: {
		type: 'string',
	},
	content: {
		type: 'string',
		default: '',
	},
	...{
		...attributesData.alignment,
		'alignment-general': {
			type: 'string',
			default: 'center',
		},
	},
	...attributesData.background,
	...attributesData.backgroundColor,
	...attributesData.backgroundColorHover,
	...attributesData.backgroundHover,
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
	...attributesData.display,
	...attributesData.motion,
	...attributesData.opacity,
	...getPrefixedAttributes(attributesData.margin, prefix),
	...getPrefixedAttributes(attributesData.padding, prefix),
	...attributesData.margin,
	...attributesData.padding,
	...attributesData.position,
	...attributesData.size,
	...attributesData.svg,
	...attributesData.transform,
	...attributesData.zIndex,
	...attributesData.overflow,
};

export default attributes;

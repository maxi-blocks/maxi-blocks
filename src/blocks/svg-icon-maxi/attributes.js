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
	...getPrefixedAttributes(attributesData.border, 'svg-'),
	...getPrefixedAttributes(attributesData.borderHover, 'svg-'),
	...getPrefixedAttributes(attributesData.borderRadius, 'svg-'),
	...getPrefixedAttributes(attributesData.borderRadiusHover, 'svg-'),
	...getPrefixedAttributes(attributesData.borderWidth, 'svg-'),
	...getPrefixedAttributes(attributesData.borderWidthHover, 'svg-'),
	...attributesData.border,
	...attributesData.borderHover,
	...attributesData.borderRadius,
	...attributesData.borderRadiusHover,
	...attributesData.borderWidth,
	...attributesData.borderWidthHover,
	...getPrefixedAttributes(attributesData.boxShadow, 'svg-'),
	...getPrefixedAttributes(attributesData.boxShadowHover, 'svg-'),
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...attributesData.display,
	...attributesData.motion,
	...attributesData.opacity,
	...getPrefixedAttributes(attributesData.margin, 'svg-'),
	...getPrefixedAttributes(attributesData.padding, 'svg-'),
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

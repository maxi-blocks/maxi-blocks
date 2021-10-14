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
		default: __('Divider', 'maxi-blocks'),
	},
	blockFullWidth: {
		type: 'string',
		default: 'normal',
	},
	fullWidth: {
		type: 'string',
		default: 'normal',
	},
	lineVertical: {
		type: 'string',
		default: 'center',
	},
	lineHorizontal: {
		type: 'string',
		default: 'center',
	},
	lineOrientation: {
		type: 'string',
		default: 'horizontal',
	},
	lineAlign: {
		type: 'string',
		default: 'row',
	},
	...{
		...attributesData.size,
		'height-general': {
			type: 'number',
			default: 100,
		},
		'height-unit-general': {
			type: 'string',
			default: 'px',
		},
	},
	...getPrefixedAttributes(attributesData.size, 'divider-'),
	...attributesData.background,
	...attributesData.backgroundColor,
	...attributesData.backgroundColorHover,
	...attributesData.backgroundGradient,
	...attributesData.backgroundGradientHover,
	...attributesData.backgroundHover,
	...getPrefixedAttributes(attributesData.boxShadow, 'divider-'),
	...getPrefixedAttributes(attributesData.boxShadowHover, 'divider-'),
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...attributesData.border,
	...attributesData.borderWidth,
	...attributesData.borderRadius,
	...attributesData.display,
	...attributesData.divider,
	...getPrefixedAttributes(attributesData.margin, 'divider-'),
	...getPrefixedAttributes(attributesData.padding, 'divider-'),
	...attributesData.margin,
	...attributesData.padding,
	...attributesData.motion,
	...attributesData.opacity,
	...attributesData.position,
	...attributesData.transform,
	...attributesData.zIndex,
	...attributesData.overflow,
};
export default attributes;

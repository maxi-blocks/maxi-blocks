/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Imports
 */
import * as newAttributes from '../../extensions/styles/defaults/index';
import * as buttonAttributesData from './data';

/**
 * Attributes
 */
const attributes = {
	customLabel: {
		type: 'string',
		default: __('Button', 'maxi-blocks'),
	},
	icon: {
		type: 'object',
		//default: buttonAttributesData.icon,
	},
	iconPadding: {
		type: 'object',
		//default: attributesData.padding,
	},
	iconBorder: {
		type: 'object',
		//default: attributesData.border,
	},
	iconBackground: {
		type: 'object',
		//default: attributesData.background,
	},
	buttonContent: {
		type: 'string',
		default: '',
	},
	...newAttributes.highlight,
	...newAttributes.alignment,
	...newAttributes.textAlignment,
	...newAttributes.typography,
	...newAttributes.typographyHover,
	...newAttributes.background,
	...newAttributes.backgroundColor,
	...newAttributes.backgroundGradient,
	...newAttributes.backgroundHover,
	...newAttributes.backgroundColorHover,
	...newAttributes.backgroundGradientHover,
	...newAttributes.opacity,
	...newAttributes.border,
	...newAttributes.borderWidth,
	...newAttributes.borderRadius,
	...newAttributes.borderHover,
	...newAttributes.size,
	...newAttributes.boxShadow,
	...newAttributes.boxShadowHover,
	...newAttributes.margin,
	...newAttributes.padding,
	...newAttributes.display,
	...newAttributes.position,
	...newAttributes.motion,
	...newAttributes.entrance,
	...newAttributes.transform,
};

export default attributes;

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults/index';

/**
 * Attributes
 */
const attributes = {
	customLabel: {
		type: 'string',
		default: __('Button', 'maxi-blocks'),
	},
	fullWidth: {
		type: 'string',
		default: 'normal',
	},
	buttonContent: {
		type: 'string',
		default: '',
	},
	...attributesData.icon,
	...attributesData.iconHover,
	...attributesData.iconPadding,
	...attributesData.iconBorder,
	...attributesData.iconBorderRadius,
	...attributesData.iconBorderWidth,
	...attributesData.highlight,
	...{
		...attributesData.alignment,
		'alignment-general': {
			type: 'string',
			default: 'center',
		},
	},
	...attributesData.textAlignment,
	...attributesData.typography,
	...attributesData.typographyHover,
	...attributesData.background,
	...attributesData.backgroundColor,
	...attributesData.backgroundGradient,
	...attributesData.backgroundHover,
	...attributesData.backgroundColorHover,
	...attributesData.backgroundGradientHover,
	...attributesData.opacity,
	...attributesData.border,
	...attributesData.borderWidth,
	...{
		...attributesData.borderRadius,
		'border-top-left-radius-general': {
			type: 'number',
			default: 10,
		},
		'border-top-right-radius-general': {
			type: 'number',
			default: 10,
		},
		'border-bottom-left-radius-general': {
			type: 'number',
			default: 10,
		},
		'border-bottom-right-radius-general': {
			type: 'number',
			default: 10,
		},
	},
	...attributesData.borderHover,
	...attributesData.borderWidthHover,
	...attributesData.borderRadiusHover,
	...attributesData.size,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...attributesData.margin,
	...{
		...attributesData.padding,
		'padding-top-general': {
			type: 'number',
			default: 10,
		},
		'padding-right-general': {
			type: 'number',
			default: 20,
		},
		'padding-bottom-general': {
			type: 'number',
			default: 10,
		},
		'padding-left-general': {
			type: 'number',
			default: 20,
		},
	},
	...attributesData.display,
	...attributesData.position,
	...attributesData.motion,
	...attributesData.entrance,
	...attributesData.transform,
	...attributesData.zIndex,
};

export default attributes;

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
	...attributesData.global,
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
	...{
		...attributesData.alignment,
		'alignment-general': {
			type: 'string',
			default: 'center',
		},
	},
	...attributesData.textAlignment,
	...{
		...attributesData.typography,
		'line-height-unit-general': {
			type: 'string',
			default: '%',
		},
		'line-height-general': {
			type: 'number',
			default: '100',
		},
		'palette-color-general': {
			type: 'number',
			default: 1,
		},
	},
	...attributesData.typographyHover,
	...{
		...attributesData.background,
		'background-active-media-general': {
			type: 'string',
			default: 'color',
		},
	},
	...{
		...attributesData.backgroundColor,
		'background-palette-color-general': {
			type: 'number',
			default: 4,
		},
	},
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
	...attributesData.icon,
	...attributesData.iconPadding,
	...attributesData.iconBackgroundColor,
	...attributesData.iconGradient,
	...attributesData.iconBorder,
	...attributesData.iconBorderWidth,
	...attributesData.iconBorderRadius,
	...attributesData.iconHover,
	...attributesData.iconBackgroundColorHover,
	...attributesData.iconGradientHover,
	...attributesData.iconBorderHover,
	...attributesData.iconBorderWidthHover,
	...attributesData.iconBorderRadiusHover,
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
			default: 15,
		},
		'padding-right-general': {
			type: 'number',
			default: 36,
		},
		'padding-bottom-general': {
			type: 'number',
			default: 15,
		},
		'padding-left-general': {
			type: 'number',
			default: 36,
		},
		'padding-top-xxl': {
			type: 'number',
			default: 23,
		},
		'padding-right-xxl': {
			type: 'number',
			default: 55,
		},
		'padding-bottom-xxl': {
			type: 'number',
			default: 23,
		},
		'padding-left-xxl': {
			type: 'number',
			default: 55,
		},
	},
	...attributesData.display,
	...attributesData.position,
	...attributesData.motion,
	...attributesData.transform,
	...attributesData.zIndex,
	...attributesData.transitionDuration,
};

export default attributes;

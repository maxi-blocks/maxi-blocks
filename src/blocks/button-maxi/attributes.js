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
		default: __('Button', 'maxi-blocks'),
	},
	blockFullWidth: {
		type: 'string',
		default: 'normal',
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
		'background-active-media': {
			type: 'string',
			default: 'color',
		},
	},
	...{
		...attributesData.backgroundColor,
		'background-palette-color': {
			type: 'number',
			default: 4,
		},
	},
	...attributesData.backgroundGradient,
	...attributesData.backgroundHover,
	...attributesData.backgroundColorHover,
	...attributesData.backgroundGradientHover,
	...attributesData.opacity,
	...getPrefixedAttributes(attributesData.border, 'button-'),
	...getPrefixedAttributes(attributesData.borderWidth, 'button-'),
	...{
		...getPrefixedAttributes(attributesData.borderRadius, 'button-'),
		'button-border-top-left-radius-general': {
			type: 'number',
			default: 10,
		},
		'button-border-top-right-radius-general': {
			type: 'number',
			default: 10,
		},
		'button-border-bottom-left-radius-general': {
			type: 'number',
			default: 10,
		},
		'button-border-bottom-right-radius-general': {
			type: 'number',
			default: 10,
		},
	},
	...{
		...getPrefixedAttributes(attributesData.borderHover, 'button-'),
		'button-border-status-hover': {
			type: 'boolean',
			default: false,
		},
	},
	...getPrefixedAttributes(attributesData.borderWidthHover, 'button-'),
	...getPrefixedAttributes(attributesData.borderRadiusHover, 'button-'),
	...attributesData.border,
	...attributesData.borderWidth,
	...attributesData.borderRadius,
	...attributesData.borderHover,
	...attributesData.borderWidthHover,
	...attributesData.borderRadiusHover,
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
	...attributesData.size,
	...attributesData.buttonSize,
	...attributesData.buttonBoxShadow,
	...attributesData.buttonBoxShadowHover,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...attributesData.margin,
	...attributesData.padding,
	...attributesData.buttonMargin,
	...{
		...attributesData.buttonPadding,
		'button-padding-top-general': {
			type: 'number',
			default: 15,
		},
		'button-padding-right-general': {
			type: 'number',
			default: 36,
		},
		'button-padding-bottom-general': {
			type: 'number',
			default: 15,
		},
		'button-padding-left-general': {
			type: 'number',
			default: 36,
		},
		'button-padding-top-xxl': {
			type: 'number',
			default: 23,
		},
		'button-padding-right-xxl': {
			type: 'number',
			default: 55,
		},
		'button-padding-bottom-xxl': {
			type: 'number',
			default: 23,
		},
		'button-padding-left-xxl': {
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
	...attributesData.overflow,
};

export default attributes;

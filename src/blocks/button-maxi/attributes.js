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
const prefix = 'button-';
const attributes = {
	...attributesData.global,

	/**
	 * Block styles
	 */
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
	},
	...attributesData.icon,
	...attributesData.iconHover,
	...attributesData.iconPadding,
	...{
		...attributesData.iconBackgroundColor,
		'icon-background-palette-color-status-general': {
			type: 'boolean'
		},
		'icon-background-palette-color-general': {
			type: 'number',
			default: 4,
		},
	},
	...attributesData.iconBackgroundColorHover,
	...attributesData.iconBackgroundGradient,
	...attributesData.iconBackgroundGradientHover,
	...attributesData.iconBorder,
	...attributesData.iconBorderWidth,
	...attributesData.iconBorderRadius,
	...attributesData.iconBorderHover,
	...attributesData.iconBorderWidthHover,
	...attributesData.iconBorderRadiusHover,
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
		...getPrefixedAttributes(attributesData.rawBackground, prefix),
		[`${prefix}background-active-media-general`]: {
			type: 'string',
			default: 'color',
		},
	},
	...{
		...getPrefixedAttributes(attributesData.backgroundColor, prefix),
		[`${prefix}background-palette-color-general`]: {
			type: 'number',
			default: 4,
		},
	},
	...getPrefixedAttributes(attributesData.backgroundGradient, prefix),
	...getPrefixedAttributes(attributesData.backgroundHover, prefix),
	...getPrefixedAttributes(attributesData.backgroundColorHover, prefix),
	...getPrefixedAttributes(attributesData.backgroundGradientHover, prefix),
	...getPrefixedAttributes(attributesData.border, prefix),
	...getPrefixedAttributes(attributesData.borderWidth, prefix),
	...{
		...getPrefixedAttributes(attributesData.borderRadius, prefix),
		[`${prefix}border-top-left-radius-general`]: {
			type: 'number',
			default: 10,
		},
		[`${prefix}border-top-right-radius-general`]: {
			type: 'number',
			default: 10,
		},
		[`${prefix}border-bottom-left-radius-general`]: {
			type: 'number',
			default: 10,
		},
		[`${prefix}border-bottom-right-radius-general`]: {
			type: 'number',
			default: 10,
		},
	},
	...{
		...getPrefixedAttributes(attributesData.borderHover, prefix),
		[`${prefix}border-status-hover`]: {
			type: 'boolean',
			default: false,
		},
	},
	...getPrefixedAttributes(attributesData.borderWidthHover, prefix),
	...getPrefixedAttributes(attributesData.borderRadiusHover, prefix),
	...getPrefixedAttributes(attributesData.boxShadow, prefix),
	...getPrefixedAttributes(attributesData.boxShadowHover, prefix),

	/**
	 * Canvas styles
	 */
	blockFullWidth: {
		type: 'string',
		default: 'normal',
	},
	...attributesData.border,
	...attributesData.borderWidth,
	...attributesData.borderRadius,
	...attributesData.borderHover,
	...attributesData.borderWidthHover,
	...attributesData.borderRadiusHover,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...getPrefixedAttributes(attributesData.opacity, prefix),
	...getPrefixedAttributes(attributesData.size, prefix),
	...getPrefixedAttributes(attributesData.margin, prefix),
	...{
		...getPrefixedAttributes(attributesData.padding, prefix),
		[`${prefix}padding-top-xxl`]: {
			type: 'number',
			default: 23,
		},
		[`${prefix}padding-right-xxl`]: {
			type: 'number',
			default: 55,
		},
		[`${prefix}padding-bottom-xxl`]: {
			type: 'number',
			default: 23,
		},
		[`${prefix}padding-left-xxl`]: {
			type: 'number',
			default: 55,
		},
		[`${prefix}padding-top-xl`]: {
			type: 'number',
			default: 15,
		},
		[`${prefix}padding-right-xl`]: {
			type: 'number',
			default: 36,
		},
		[`${prefix}padding-bottom-xl`]: {
			type: 'number',
			default: 15,
		},
		[`${prefix}padding-left-xl`]: {
			type: 'number',
			default: 36,
		},
	},

	/**
	 * Advanced
	 */
	...attributesData.blockBackground,
	...attributesData.motion,
	...attributesData.transform,
	...attributesData.transitionDuration,
	...attributesData.display,
	...attributesData.position,
	...attributesData.overflow,
	...attributesData.zIndex,
	...attributesData.size,
	...attributesData.margin,
	...attributesData.padding,
	...attributesData.customCss,
};

export default attributes;

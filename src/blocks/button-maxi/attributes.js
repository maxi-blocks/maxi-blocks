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
		...attributesData.backgroundHover,
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
	...attributesData.border,
	...attributesData.borderWidth,
	...attributesData.borderRadius,
	...attributesData.borderHover,
	...attributesData.borderWidthHover,
	...attributesData.borderRadiusHover,
	...attributesData.icon,
	...attributesData.iconPadding,
	...attributesData.iconBackgroundColor,
	...attributesData.iconBackgroundGradient,
	...attributesData.iconBorder,
	...attributesData.iconBorderWidth,
	...attributesData.iconBorderRadius,
	...attributesData.iconBorderHover,
	...attributesData.iconBorderWidthHover,
	...attributesData.iconBorderRadiusHover,
	...attributesData.size,
	...getPrefixedAttributes(attributesData.size, prefix),
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...getPrefixedAttributes(attributesData.boxShadow, prefix),
	...getPrefixedAttributes(attributesData.boxShadowHover, prefix),
	...attributesData.margin,
	...attributesData.padding,
	...getPrefixedAttributes(attributesData.margin, prefix),
	...{
		...getPrefixedAttributes(attributesData.padding, prefix),
		[`${prefix}padding-top-general`]: {
			type: 'number',
			default: 15,
		},
		[`${prefix}padding-right-general`]: {
			type: 'number',
			default: 36,
		},
		[`${prefix}padding-bottom-general`]: {
			type: 'number',
			default: 15,
		},
		[`${prefix}padding-left-general`]: {
			type: 'number',
			default: 36,
		},
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

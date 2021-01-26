/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Imports
 */
import * as newAttributes from '../../extensions/styles/defaults/index';

/**
 * Attributes
 */
const attributes = {
	customLabel: {
		type: 'string',
		default: __('Button', 'maxi-blocks'),
	},
	buttonContent: {
		type: 'string',
		default: '',
	},
	...newAttributes.icon,
	...newAttributes.iconPadding,
	...newAttributes.iconBorder,
	...newAttributes.iconBorderRadius,
	...newAttributes.iconBorderWidth,
	...newAttributes.highlight,
	...{
		...newAttributes.alignment,
		'alignment-general': {
			type: 'string',
			default: 'center',
		},
	},
	...newAttributes.textAlignment,
	...newAttributes.typography,
	...newAttributes.typographyHover,
	...{
		...newAttributes.background,
		'background-active-media': {
			type: 'string',
			default: 'color',
		},
	},
	...{
		...newAttributes.backgroundColor,
		'background-color': {
			type: 'string',
			default: '#ff4a17',
		},
	},
	...newAttributes.backgroundGradient,
	...newAttributes.backgroundHover,
	...newAttributes.backgroundColorHover,
	...newAttributes.backgroundGradientHover,
	...newAttributes.opacity,
	...newAttributes.border,
	...newAttributes.borderWidth,
	...{
		...newAttributes.borderRadius,
		'border-top-left-radius-general': {
			type: 'number',
			default: 25,
		},
		'border-top-right-radius-general': {
			type: 'number',
			default: 25,
		},
		'border-bottom-left-radius-general': {
			type: 'number',
			default: 25,
		},
		'border-bottom-right-radius-general': {
			type: 'number',
			default: 25,
		},
	},
	...newAttributes.borderHover,
	...newAttributes.borderWidthHover,
	...newAttributes.borderRadiusHover,
	...newAttributes.size,
	...newAttributes.boxShadow,
	...newAttributes.boxShadowHover,
	...newAttributes.margin,
	...{
		...newAttributes.padding,
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
	...newAttributes.display,
	...newAttributes.position,
	...newAttributes.motion,
	...newAttributes.entrance,
	...newAttributes.transform,
};

export default attributes;

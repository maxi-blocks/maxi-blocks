/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults/index';
import { getGlobalAttributes } from '../../extensions/attributes/getGlobalAttributes';

/**
 * Attributes
 */
const attributes = {
	...{
		...getGlobalAttributes([
			'background',
			'backgroundColor',
			'backgroundColorHover',
			'backgroundGradient',
			'backgroundGradientHover',
			'backgroundHover',
			'border',
			'borderHover',
			'borderRadiusHover',
			'borderWidth',
			'borderWidthHover',
			'boxShadow',
			'boxShadowHover',
			'display',
			'entrance',
			'highlight',
			'icon',
			'iconBorder',
			'iconBorderRadius',
			'iconBorderWidth',
			'iconHover',
			'iconPadding',
			'margin',
			'motion',
			'opacity',
			'position',
			'size',
			'textAlignment',
			'transform',
			'typography',
			'typographyHover',
			'zIndex',
		]),
	},
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
};

export default attributes;

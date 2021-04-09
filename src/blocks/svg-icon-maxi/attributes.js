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
		default: __('SVG Icon', 'maxi-blocks'),
	},
	fullWidth: {
		type: 'string',
		default: 'normal',
	},
	content: {
		type: 'string',
		default: '',
	},
	svgColorOrange: {
		type: 'string',
		default: '#FF4A17',
	},
	svgColorBlack: {
		type: 'string',
		default: '#081219',
	},
	stroke: {
		type: 'number',
		default: 2.0,
	},
	animation: {
		type: 'string',
		default: 'loop',
	},
	duration: {
		type: 'number',
		default: 3.7,
	},
	width: {
		type: 'number',
		default: 64,
	},
	...{
		...attributesData.alignment,
		'alignment-general': {
			type: 'string',
			default: 'center',
		},
	},
	...attributesData.opacity,
	...attributesData.background,
	...attributesData.backgroundColor,
	...attributesData.backgroundHover,
	...attributesData.backgroundColorHover,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...attributesData.border,
	...attributesData.borderWidth,
	...attributesData.borderRadius,
	...attributesData.borderHover,
	...attributesData.borderWidthHover,
	...attributesData.borderRadiusHover,
	...attributesData.padding,
	...attributesData.margin,
	...attributesData.display,
	...attributesData.position,
	...attributesData.motion,
	...attributesData.entrance,
	...attributesData.transform,
	...attributesData.zIndex,
};

export default attributes;

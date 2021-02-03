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
		default: __('SVG Icon', 'maxi-blocks'),
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
	svgColorWhite: {
		type: 'string',
		default: '#FFF',
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
		...newAttributes.alignment,
		'alignment-general': {
			type: 'string',
			default: 'center',
		},
	},
	...newAttributes.opacity,
	...newAttributes.background,
	...newAttributes.backgroundColor,
	...newAttributes.backgroundHover,
	...newAttributes.backgroundColorHover,
	...newAttributes.boxShadow,
	...newAttributes.boxShadowHover,
	...newAttributes.border,
	...newAttributes.borderWidth,
	...newAttributes.borderRadius,
	...newAttributes.borderHover,
	...newAttributes.borderWidthHover,
	...newAttributes.borderRadiusHover,
	...newAttributes.padding,
	...newAttributes.margin,
	...newAttributes.display,
	...newAttributes.position,
	...newAttributes.motion,
	...newAttributes.entrance,
	...newAttributes.transform,
	...newAttributes.zIndex,
	...newAttributes.highlight,
};

export default attributes;

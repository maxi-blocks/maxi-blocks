/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults';
import * as newAttributes from '../../extensions/styles/defaults/index';

/**
 * Attributes
 */
const attributes = {
	customLabel: {
		type: 'string',
		default: __('Text', 'maxi-blocks'),
	},
	textLevel: {
		type: 'string',
		default: 'p',
	},
	isList: {
		type: 'boolean',
		default: false,
	},
	typeOfList: {
		type: 'string',
		default: 'ul',
	},
	listStart: {
		type: 'number',
		default: 1,
	},
	listReversed: {
		type: 'number',
		default: 0,
	},
	fullWidth: {
		type: 'string',
		default: 'normal',
	},
	hoverPadding: {
		type: 'object',
		default: attributesData.padding,
	},
	content: {
		type: 'string',
		default: '',
	},
	highlight: {
		type: 'object',
		default: attributesData.highlight,
	},
	...newAttributes.container,
	...newAttributes.background,
	...newAttributes.backgroundColor,
	...newAttributes.backgroundImage,
	...newAttributes.backgroundVideo,
	...newAttributes.backgroundGradient,
	...newAttributes.backgroundSVG,
	...newAttributes.backgroundHover,
	...newAttributes.backgroundColorHover,
	...newAttributes.backgroundImageHover,
	...newAttributes.backgroundVideoHover,
	...newAttributes.backgroundGradientHover,
	...newAttributes.backgroundSVGHover,
	...newAttributes.size,
	...newAttributes.opacity,
	...newAttributes.border,
	...newAttributes.borderWidth,
	...newAttributes.borderRadius,
	...newAttributes.borderHover,
	...newAttributes.borderWidthHover,
	...newAttributes.borderRadiusHover,
	...newAttributes.boxShadow,
	...newAttributes.boxShadowHover,
	...newAttributes.margin,
	...newAttributes.padding,
	...newAttributes.motion,
	...newAttributes.entrance,
	...newAttributes.parallax,
	...newAttributes.transform,
	...newAttributes.display,
	...newAttributes.position,
	...newAttributes.typography,
	...newAttributes.typographyHover,
	...newAttributes.textAlignment,
};

export default attributes;

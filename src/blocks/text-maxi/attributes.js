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
	...newAttributes.highlight,
	...newAttributes.background,
	...newAttributes.backgroundColor,
	...newAttributes.backgroundColorHover,
	...newAttributes.backgroundGradient,
	...newAttributes.backgroundGradientHover,
	...newAttributes.backgroundHover,
	...newAttributes.backgroundImage,
	...newAttributes.backgroundImageHover,
	...newAttributes.backgroundSVG,
	...newAttributes.backgroundSVGHover,
	...newAttributes.backgroundVideo,
	...newAttributes.backgroundVideoHover,
	...newAttributes.border,
	...newAttributes.borderHover,
	...newAttributes.borderRadius,
	...newAttributes.borderRadiusHover,
	...newAttributes.borderWidth,
	...newAttributes.borderWidthHover,
	...newAttributes.boxShadow,
	...newAttributes.boxShadowHover,
	...newAttributes.container,
	...newAttributes.display,
	...newAttributes.entrance,
	...newAttributes.highlight,
	...newAttributes.margin,
	...newAttributes.motion,
	...newAttributes.opacity,
	...newAttributes.padding,
	...newAttributes.parallax,
	...newAttributes.position,
	...newAttributes.size,
	...newAttributes.textAlignment,
	...newAttributes.transform,
	...newAttributes.typography,
	...newAttributes.typographyHover,
};

export default attributes;

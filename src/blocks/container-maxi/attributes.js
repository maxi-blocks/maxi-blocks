/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

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
		default: __('Container', 'maxi-blocks'),
	},
	fullWidth: {
		type: 'string',
		default: 'full',
	},
	...attributesData.container,
	...attributesData.background,
	...attributesData.backgroundColor,
	...attributesData.backgroundImage,
	...attributesData.backgroundVideo,
	...attributesData.backgroundGradient,
	...attributesData.backgroundSVG,
	...attributesData.backgroundHover,
	...attributesData.backgroundColorHover,
	...attributesData.backgroundImageHover,
	...attributesData.backgroundVideoHover,
	...attributesData.backgroundGradientHover,
	...attributesData.backgroundSVGHover,
	...attributesData.size,
	...attributesData.opacity,
	...attributesData.border,
	...attributesData.borderWidth,
	...attributesData.borderRadius,
	...attributesData.borderHover,
	...attributesData.borderWidthHover,
	...attributesData.borderRadiusHover,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...attributesData.margin,
	...attributesData.padding,
	...attributesData.arrow,
	...attributesData.shapeDivider,
	...attributesData.motion,
	...attributesData.entrance,
	...attributesData.parallax,
	...attributesData.transform,
	...attributesData.display,
	...attributesData.position,
	...attributesData.zIndex,
};

export default attributes;

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
		default: __('Container', 'maxi-blocks'),
	},
	fullWidth: {
		type: 'string',
		default: 'full',
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
	...newAttributes.arrow,
	...newAttributes.shapeDivider,
	...newAttributes.motion,
	...newAttributes.entrance,
	...newAttributes.parallax,
	...newAttributes.transform,
	...newAttributes.display,
	...newAttributes.position,
};

export default attributes;

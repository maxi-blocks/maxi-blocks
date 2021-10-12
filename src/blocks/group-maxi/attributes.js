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
	...attributesData.global,
	customLabel: {
		type: 'string',
		default: __('Group', 'maxi-blocks'),
	},
	fullWidth: {
		type: 'string',
		default: 'normal',
	},
	...attributesData.arrow,
	...attributesData.background,
	...attributesData.backgroundColor,
	...attributesData.backgroundColorHover,
	...attributesData.backgroundGradient,
	...attributesData.backgroundGradientHover,
	...attributesData.backgroundHover,
	...attributesData.backgroundImage,
	...attributesData.backgroundImageHover,
	...attributesData.backgroundSVG,
	...attributesData.backgroundSVGHover,
	...attributesData.backgroundVideo,
	...attributesData.backgroundVideoHover,
	...attributesData.border,
	...attributesData.borderHover,
	...attributesData.borderRadius,
	...attributesData.borderRadiusHover,
	...attributesData.borderWidth,
	...attributesData.borderWidthHover,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...attributesData.display,
	...attributesData.margin,
	...attributesData.motion,
	...attributesData.opacity,
	...attributesData.padding,
	...attributesData.parallax,
	...attributesData.position,
	...attributesData.size,
	...attributesData.transform,
	...attributesData.zIndex,
	...attributesData.overflow,
};

export default attributes;

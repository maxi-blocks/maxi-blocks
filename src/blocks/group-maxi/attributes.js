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
	...attributesData.highlight,
	...attributesData.margin,
	...attributesData.padding,
	...attributesData.motion,
	...attributesData.entrance,
	...attributesData.parallax,
	...attributesData.transform,
	...attributesData.display,
	...attributesData.position,
	...attributesData.arrow,
};

export default attributes;

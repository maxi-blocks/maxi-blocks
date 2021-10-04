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
		default: __('Container', 'maxi-blocks'),
	},
	fullWidth: {
		type: 'string',
		default: 'full',
	},
	blockStyle: {
		type: 'string',
		default: 'maxi-light',
	},
	updateStyleCard: {
		type: 'number',
		default: 0,
	},
	...attributesData.container,
	...{
		...attributesData.background,
		'background-active-media-general': {
			type: 'string',
			default: 'color',
		},
	},
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
	...{
		...attributesData.padding,
		'padding-top-general': {
			type: 'number',
			default: 20,
		},
		'padding-bottom-general': {
			type: 'number',
			default: 20,
		},
	},
	...attributesData.arrow,
	...attributesData.shapeDivider,
	...attributesData.motion,
	...attributesData.parallax,
	...attributesData.transform,
	...attributesData.display,
	...attributesData.position,
	...attributesData.zIndex,
	...attributesData.overflow,
};

export default attributes;

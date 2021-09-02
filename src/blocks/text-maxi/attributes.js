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
	},
	listReversed: {
		type: 'number',
		default: 0,
	},
	fullWidth: {
		type: 'string',
		default: 'normal',
	},
	content: {
		type: 'string',
		default: '',
	},
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
	...attributesData.container,
	...attributesData.display,
	...attributesData.entrance,
	...attributesData.link,
	...attributesData.margin,
	...attributesData.motion,
	...attributesData.opacity,
	...attributesData.padding,
	...attributesData.parallax,
	...attributesData.position,
	...attributesData.size,
	...attributesData.textAlignment,
	...attributesData.transform,
	...attributesData.typography,
	...attributesData.typographyHover,
	...attributesData.zIndex,
	...attributesData.transitionDuration,
};

export default attributes;

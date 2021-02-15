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
		default: __('Image', 'maxi-blocks'),
	},
	SVGCurrentElement: {
		type: 'number',
	},
	SVGElement: {
		type: 'string',
	},
	SVGData: {
		type: 'object',
	},
	SVGMediaID: {
		type: 'number',
	},
	SVGMediaURL: {
		type: 'string',
	},
	imageSize: {
		type: 'string',
		default: 'full',
	},
	cropOptions: {
		type: 'object',
	},
	captionType: {
		type: 'string',
		default: 'none',
	},
	captionContent: {
		type: 'string',
		default: '',
	},
	fullWidth: {
		type: 'string',
		default: 'normal',
	},
	mediaID: {
		type: 'number',
	},
	mediaURL: {
		type: 'string',
	},
	mediaAlt: {
		type: 'string',
	},
	mediaAltWp: {
		type: 'string',
	},
	mediaAltTitle: {
		type: 'string',
	},
	altSelector: {
		type: 'string',
		default: 'wordpress',
	},
	mediaWidth: {
		type: 'number',
	},
	mediaHeight: {
		type: 'number',
	},
	clipPath: {
		type: 'string',
		default: '',
	},
	...attributesData.alignment,
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
	...attributesData.motion,
	...attributesData.entrance,
	...attributesData.parallax,
	...attributesData.transform,
	...attributesData.display,
	...attributesData.position,
	...attributesData.hover,
	...attributesData.hoverBorder,
	...attributesData.hoverBorderWidth,
	...attributesData.hoverBorderRadius,
	...attributesData.hoverBackground,
	...attributesData.hoverBackgroundColor,
	...attributesData.hoverBackgroundGradient,
	...attributesData.hoverMargin,
	...attributesData.hoverPadding,
	...attributesData.hoverTitleTypography,
	...attributesData.hoverContentTypography,
	...attributesData.typography,
	...attributesData.textAlignment,
	...{
		...attributesData.alignment,
		'alignment-general': {
			type: 'string',
			default: 'center',
		},
	},
	...{
		...attributesData.size,
		'min-width-unit-general': {
			type: 'string',
			default: '%',
		},
		'min-width-xxl': {
			type: 'number',
			default: 100,
		},
		'min-width-s': {
			type: 'number',
			default: 100,
		},
		'min-width-xs': {
			type: 'number',
			default: 100,
		},
	},
};

export default attributes;

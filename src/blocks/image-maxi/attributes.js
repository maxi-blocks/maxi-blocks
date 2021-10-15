/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults/index';
import { getPrefixedAttributes } from '../../extensions/styles';

/**
 * Attributes
 */
const attributes = {
	...attributesData.global,
	customLabel: {
		type: 'string',
		default: __('Image', 'maxi-blocks'),
	},
	imageRatio: {
		type: 'string',
		default: 'original',
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
	blockFullWidth: {
		type: 'string',
		default: 'normal',
	},
	isImageUrl: {
		type: 'boolean',
		default: false,
	},
	externalUrl: {
		type: 'string',
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
	imgWidth: {
		type: 'number',
		default: 100,
	},
	clipPath: {
		type: 'string',
		default: '',
	},
	...attributesData.alignment,
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
	...getPrefixedAttributes(attributesData.border, 'image-'),
	...getPrefixedAttributes(attributesData.borderHover, 'image-'),
	...getPrefixedAttributes(attributesData.borderRadius, 'image-'),
	...getPrefixedAttributes(attributesData.borderRadiusHover, 'image-'),
	...getPrefixedAttributes(attributesData.borderWidth, 'image-'),
	...getPrefixedAttributes(attributesData.borderWidthHover, 'image-'),
	...attributesData.border,
	...attributesData.borderHover,
	...attributesData.borderRadius,
	...attributesData.borderRadiusHover,
	...attributesData.borderWidth,
	...attributesData.borderWidthHover,
	...getPrefixedAttributes(attributesData.boxShadow, 'image-'),
	...getPrefixedAttributes(attributesData.boxShadowHover, 'image-'),
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...attributesData.container,
	...attributesData.display,
	...attributesData.hover,
	...attributesData.hoverBackground,
	...attributesData.hoverBackgroundColor,
	...attributesData.hoverBackgroundGradient,
	...attributesData.hoverBorder,
	...attributesData.hoverBorderRadius,
	...attributesData.hoverBorderWidth,
	...attributesData.hoverContentTypography,
	...attributesData.hoverMargin,
	...attributesData.hoverPadding,
	...attributesData.hoverTitleTypography,
	...attributesData.link,
	...getPrefixedAttributes(attributesData.margin, 'image-'),
	...getPrefixedAttributes(attributesData.padding, 'image-'),
	...attributesData.margin,
	...attributesData.padding,
	...attributesData.motion,
	...attributesData.opacity,
	...attributesData.parallax,
	...attributesData.position,
	...getPrefixedAttributes(attributesData.size, 'image-'),
	...attributesData.size,
	...attributesData.textAlignment,
	...attributesData.transform,
	...attributesData.typography,
	...attributesData.zIndex,
	...{
		...attributesData.alignment,
		'alignment-general': {
			type: 'string',
			default: 'center',
		},
	},
	...attributesData.overflow,
	...attributesData.imageShape,
};

export default attributes;

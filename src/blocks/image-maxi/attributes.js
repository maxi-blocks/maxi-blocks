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
	...newAttributes.alignment,
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
	...newAttributes.position,
	...newAttributes.hover,
	...newAttributes.hoverBorder,
	...newAttributes.hoverBorderWidth,
	...newAttributes.hoverBorderRadius,
	...newAttributes.hoverBackground,
	...newAttributes.hoverBackgroundColor,
	...newAttributes.hoverBackgroundGradient,
	...newAttributes.hoverMargin,
	...newAttributes.hoverPadding,
	...newAttributes.hoverTitleTypography,
	...newAttributes.hoverContentTypography,
	...newAttributes.typography,
	...newAttributes.textAlignment,
	...{
		...newAttributes.alignment,
		'alignment-general': {
			type: 'string',
			default: 'center',
		},
	},
};

export default attributes;

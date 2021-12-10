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
const prefix = 'image-';
const attributes = {
	...attributesData.global,

	/**
	 * Block styles
	 */
	customLabel: {
		type: 'string',
		default: __('Image', 'maxi-blocks'),
	},
	fullWidth: {
		type: 'string',
		default: 'normal',
	},
	...{
		...attributesData.alignment,
		'alignment-general': {
			type: 'string',
			default: 'center',
		},
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
	captionType: {
		type: 'string',
		default: 'none',
	},
	captionContent: {
		type: 'string',
		default: '',
	},
	captionPosition: {
		type: 'string',
		default: 'bottom',
	},
	// TODO: replace with future breakpointObjectCreator
	// https://github.com/yeahcan/maxi-blocks/blob/b384ce2226e0181226817f5eda4723d1733a2f6a/src/extensions/styles/breakpointObjectCreator.js#L7
	...(() => {
		const response = {};

		['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'].forEach(breakpoint => {
			response[`caption-gap-${breakpoint}`] = {
				type: 'number',
				...(breakpoint === 'general' && { default: 1 }),
			};
			response[`caption-gap-unit-${breakpoint}`] = {
				type: 'string',
				...(breakpoint === 'general' && { default: 'em' }),
			};
		});

		return response;
	})(),
	imageSize: {
		type: 'string',
		default: 'full',
	},
	cropOptions: {
		type: 'object',
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
	...attributesData.link,
	...attributesData.textAlignment,
	...attributesData.typography,
	...attributesData.imageShape,
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
	...getPrefixedAttributes(attributesData.border, prefix),
	...getPrefixedAttributes(attributesData.borderHover, prefix),
	...getPrefixedAttributes(attributesData.borderRadius, prefix),
	...getPrefixedAttributes(attributesData.borderRadiusHover, prefix),
	...getPrefixedAttributes(attributesData.borderWidth, prefix),
	...getPrefixedAttributes(attributesData.borderWidthHover, prefix),
	...getPrefixedAttributes(attributesData.boxShadow, prefix),
	...getPrefixedAttributes(attributesData.boxShadowHover, prefix),
	...getPrefixedAttributes(attributesData.size, prefix),
	...getPrefixedAttributes(attributesData.padding, prefix),

	/**
	 * Canvas styles
	 */
	blockFullWidth: {
		type: 'string',
		default: 'normal',
	},
	...attributesData.container,
	...attributesData.blockBackground,
	...attributesData.border,
	...attributesData.borderHover,
	...attributesData.borderRadius,
	...attributesData.borderRadiusHover,
	...attributesData.borderWidth,
	...attributesData.borderWidthHover,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...attributesData.opacity,
	...attributesData.size,
	...attributesData.margin,
	...attributesData.padding,

	/**
	 * Advanced
	 */
	...attributesData.scroll,
	...attributesData.transform,
	...attributesData.display,
	...attributesData.position,
	...attributesData.overflow,
	...attributesData.zIndex,
	...attributesData.customCss,
};

export default attributes;

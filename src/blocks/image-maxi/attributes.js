/**
 * Imports
 */
import * as attributesData from '@extensions/styles/defaults/index';
import {
	breakpointAttributesCreator,
	prefixAttributesCreator,
	transitionAttributesCreator,
} from '@extensions/styles';
import { customCss, transition } from './data';

/**
 * Attributes
 */
const prefix = 'image-';
const attributes = {
	...attributesData.global,

	/**
	 * Block styles
	 */
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
	imageRatioCustom: {
		type: 'string',
		default: '1',
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
	...breakpointAttributesCreator({
		obj: {
			'caption-gap': {
				type: 'number',
				default: 1,
			},
			'caption-gap-unit': {
				type: 'string',
				default: 'em',
			},
		},
	}),
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
	isImageUrlInvalid: {
		type: 'boolean',
		default: false,
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
	...breakpointAttributesCreator({
		obj: {
			'img-width': {
				type: 'number',
				default: 100,
			},
		},
	}),
	imgWidth: {
		type: 'number',
	},
	useInitSize: {
		type: 'boolean',
	},
	fitParentSize: {
		type: 'boolean',
	},
	...breakpointAttributesCreator({
		obj: {
			'object-size': {
				type: 'number',
				default: 1,
			},
			'object-position-horizontal': {
				type: 'number',
				default: 50,
			},
			'object-position-vertical': {
				type: 'number',
				default: 50,
			},
		},
	}),
	...attributesData.clipPath,
	...attributesData.clipPathHover,
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
	...prefixAttributesCreator({ obj: attributesData.border, prefix }),
	...prefixAttributesCreator({ obj: attributesData.borderHover, prefix }),
	...prefixAttributesCreator({ obj: attributesData.borderRadius, prefix }),
	...prefixAttributesCreator({
		obj: attributesData.borderRadiusHover,
		prefix,
	}),
	...prefixAttributesCreator({ obj: attributesData.borderWidth, prefix }),
	...prefixAttributesCreator({
		obj: attributesData.borderWidthHover,
		prefix,
	}),
	...prefixAttributesCreator({ obj: attributesData.boxShadow, prefix }),
	...prefixAttributesCreator({ obj: attributesData.boxShadowHover, prefix }),
	...prefixAttributesCreator({ obj: attributesData.size, prefix }),
	...prefixAttributesCreator({ obj: attributesData.margin, prefix }),
	...prefixAttributesCreator({ obj: attributesData.padding, prefix }),

	/**
	 * Canvas styles
	 */
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
	...attributesData.opacityHover,
	...attributesData.size,
	...attributesData.margin,
	...attributesData.padding,

	/**
	 * Advanced
	 */
	...attributesData.dynamicContent,
	...attributesData.scroll,
	...attributesData.transform,
	...{
		...attributesData.transition,
		...transitionAttributesCreator({
			transition,
			selectors: customCss.selectors,
		}),
	},
	...attributesData.display,
	...attributesData.position,
	...attributesData.overflow,
	...attributesData.zIndex,
	...attributesData.customCss,
	...attributesData.advancedCss,
	...attributesData.flex,
};

export default attributes;

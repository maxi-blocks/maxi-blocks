/**
 * Imports
 */
import * as attributesData from '@extensions/styles/defaults/index';
import {
	prefixAttributesCreator,
	transitionAttributesCreator,
} from '@extensions/styles';
import { customCss, transition } from './data';

/**
 * Attributes
 */
const prefix = 'button-';
const attributes = {
	...attributesData.global,

	/**
	 * Block styles
	 */
	buttonContent: {
		type: 'string',
	},
	...attributesData.icon,
	...attributesData.iconBackground,
	...attributesData.iconHover,
	...attributesData.iconBackgroundHover,
	...attributesData.iconPadding,
	...{
		...attributesData.iconBackgroundColor,
		'icon-background-palette-status-general': {
			type: 'boolean',
			default: true,
		},
		'icon-background-palette-color-general': {
			type: 'number',
			default: 4,
		},
	},
	...attributesData.iconBackgroundColorHover,
	...attributesData.iconBackgroundGradient,
	...attributesData.iconBackgroundGradientHover,
	...attributesData.iconBorder,
	...attributesData.iconBorderWidth,
	...attributesData.iconBorderRadius,
	...attributesData.iconBorderHover,
	...attributesData.iconBorderWidthHover,
	...attributesData.iconBorderRadiusHover,
	...{
		...attributesData.alignment,
		'alignment-general': {
			type: 'string',
			default: 'center',
		},
	},
	...{
		...attributesData.textAlignment,
		'text-alignment-general': { type: 'string', default: 'center' },
	},
	...{
		...attributesData.typography,
		'palette-color-general': {
			type: 'number',
			default: 1,
		},
	},
	...attributesData.typographyHover,
	...prefixAttributesCreator({
		obj: attributesData.background,
		prefix,
		diffValAttr: {
			[`${prefix}background-active-media-general`]: 'color',
		},
	}),
	...prefixAttributesCreator({
		obj: attributesData.backgroundColor,
		prefix,
		diffValAttr: { [`${prefix}background-palette-color-general`]: 4 },
	}),
	...prefixAttributesCreator({
		obj: attributesData.backgroundGradient,
		prefix,
	}),
	...prefixAttributesCreator({ obj: attributesData.backgroundHover, prefix }),
	...prefixAttributesCreator({
		obj: attributesData.backgroundColorHover,
		prefix,
	}),
	...prefixAttributesCreator({
		obj: attributesData.backgroundGradientHover,
		prefix,
	}),
	...{
		...prefixAttributesCreator({ obj: attributesData.border, prefix }),
		[`${prefix}border-palette-color-general`]: {
			type: 'number',
			default: 4,
		},
	},
	...prefixAttributesCreator({ obj: attributesData.borderWidth, prefix }),
	...prefixAttributesCreator({
		obj: attributesData.borderRadius,
		prefix,
		diffValAttr: {
			[`${prefix}border-top-left-radius-general`]: 10,
			[`${prefix}border-top-right-radius-general`]: 10,
			[`${prefix}border-bottom-left-radius-general`]: 10,
			[`${prefix}border-bottom-right-radius-general`]: 10,
		},
	}),
	...prefixAttributesCreator({
		obj: attributesData.borderHover,
		prefix,
		diffValAttr: { [`${prefix}border-status-hover`]: false },
	}),
	...prefixAttributesCreator({
		obj: attributesData.borderWidthHover,
		prefix,
	}),
	...prefixAttributesCreator({
		obj: attributesData.borderRadiusHover,
		prefix,
	}),
	...{
		...prefixAttributesCreator({ obj: attributesData.boxShadow, prefix }),
		[`${prefix}box-shadow-palette-color-general`]: {
			type: 'number',
			default: 4,
		},
	},
	...prefixAttributesCreator({ obj: attributesData.boxShadowHover, prefix }),

	...prefixAttributesCreator({ obj: attributesData.size, prefix }),
	...prefixAttributesCreator({ obj: attributesData.margin, prefix }),
	...prefixAttributesCreator({
		obj: attributesData.padding,
		prefix,
		diffValAttr: {
			'button-padding-sync-general': 'axis',
			'button-padding-top-general': '15',
			'button-padding-right-general': '36',
			'button-padding-bottom-general': '15',
			'button-padding-left-general': '36',
		},
	}),

	/**
	 * Canvas styles
	 */
	...attributesData.blockBackground,
	...attributesData.border,
	...attributesData.borderWidth,
	...attributesData.borderRadius,
	...attributesData.borderHover,
	...attributesData.borderWidthHover,
	...attributesData.borderRadiusHover,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...attributesData.opacity,
	...attributesData.opacityHover,

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
	...attributesData.size,
	...attributesData.margin,
	...attributesData.padding,
	...attributesData.customCss,
	...attributesData.advancedCss,
	...attributesData.flex,
};

export default attributes;

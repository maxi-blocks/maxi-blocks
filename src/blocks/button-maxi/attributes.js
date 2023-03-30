/**
 * Imports
 */
import * as attributesData from '../../extensions/attributes/defaults/index';
import { transitionAttributesCreator } from '../../extensions/attributes/transitions';
import prefixAttributesCreator from '../../extensions/attributes/prefixAttributesCreator';
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
		'icon-background-pa-status-general': {
			type: 'boolean',
			default: true,
		},
		'icon-background-pac-general': {
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
		'ta-general': { type: 'string', default: 'center' },
	},
	...{
		...attributesData.typography,
		'line-height-unit-general': {
			type: 'string',
			default: '%',
		},
		'pac-general': {
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
		diffValAttr: { [`${prefix}background-pac-general`]: 4 },
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
		[`${prefix}border-pac-general`]: {
			type: 'number',
			default: 4,
		},
	},
	...prefixAttributesCreator({ obj: attributesData.borderWidth, prefix }),
	...prefixAttributesCreator({
		obj: attributesData.borderRadius,
		prefix,
		diffValAttr: {
			[`${prefix}border-radius-top-left-general`]: 10,
			[`${prefix}border-radius-top-right-general`]: 10,
			[`${prefix}border-radius-bottom-left-general`]: 10,
			[`${prefix}border-radius-bottom-right-general`]: 10,
		},
	}),
	...prefixAttributesCreator({
		obj: attributesData.borderHover,
		prefix,
		diffValAttr: { [`${prefix}bo.sh`]: false },
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
		[`${prefix}box-shadow-pac-general`]: {
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
	...attributesData.flex,
};

// console.log(attributes);

export default attributes;

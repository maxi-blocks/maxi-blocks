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
const prefix = 'bt-';
const attributes = {
	...attributesData.global,

	/**
	 * Block styles
	 */
	_bc: {
		type: 'string',
	},
	...attributesData.icon,
	...attributesData.iconBackground,
	...attributesData.iconHover,
	...attributesData.iconBackgroundHover,
	...attributesData.iconPadding,
	...{
		...attributesData.iconBackgroundColor,
		'i-bc_ps-g': {
			type: 'boolean',
			default: true,
		},
		'i-bc_pc-g': {
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
		'_a-g': {
			type: 'string',
			default: 'center',
		},
	},
	...{
		...attributesData.textAlignment,
		'ta-g': { type: 'string', default: 'center' },
	},
	...{
		...attributesData.typography,
		'_lhe.u-g': {
			type: 'string',
			default: '%',
		},
		'_pc-g': {
			type: 'number',
			default: 1,
		},
	},
	...attributesData.typographyHover,
	...prefixAttributesCreator({
		obj: attributesData.background,
		prefix,
		diffValAttr: {
			[`${prefix}b_am-g`]: 'color',
		},
	}),
	...prefixAttributesCreator({
		obj: attributesData.backgroundColor,
		prefix,
		diffValAttr: { [`${prefix}bc_pc-g`]: 4 },
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
		[`${prefix}bo_pc-g`]: {
			type: 'number',
			default: 4,
		},
	},
	...prefixAttributesCreator({ obj: attributesData.borderWidth, prefix }),
	...prefixAttributesCreator({
		obj: attributesData.borderRadius,
		prefix,
		diffValAttr: {
			[`${prefix}bo.ra.tl-g`]: 10,
			[`${prefix}bo.ra.tr-g`]: 10,
			[`${prefix}bo.ra.bl-g`]: 10,
			[`${prefix}bo.ra.br-g`]: 10,
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
		[`${prefix}bs-_pc-g`]: {
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
			'bt_p.sy-g': 'axis',
			'bt_p.t-g': '15',
			'bt_p.r-g': '36',
			'bt_p.b-g': '15',
			'bt_p.l-g': '36',
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
	...attributesData.margin,
	...attributesData.padding,

	/**
	 * Advanced
	 */
	...attributesData.dynamicContent,
	...attributesData.opacity,
	...attributesData.opacityHover,
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
	...attributesData.customCss,
	...attributesData.flex,
};

export default attributes;

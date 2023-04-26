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
		'i-bc_ps-general': {
			type: 'boolean',
			default: true,
		},
		'i-bc_pc-general': {
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
		'_a-general': {
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
		'_lhe.u-general': {
			type: 'string',
			default: '%',
		},
		'_pc-general': {
			type: 'number',
			default: 1,
		},
	},
	...attributesData.typographyHover,
	...prefixAttributesCreator({
		obj: attributesData.background,
		prefix,
		diffValAttr: {
			[`${prefix}b_am-general`]: 'color',
		},
	}),
	...prefixAttributesCreator({
		obj: attributesData.backgroundColor,
		prefix,
		diffValAttr: { [`${prefix}bc_pc-general`]: 4 },
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
		[`${prefix}bo_pc-general`]: {
			type: 'number',
			default: 4,
		},
	},
	...prefixAttributesCreator({ obj: attributesData.borderWidth, prefix }),
	...prefixAttributesCreator({
		obj: attributesData.borderRadius,
		prefix,
		diffValAttr: {
			[`${prefix}bo.ra.tl-general`]: 10,
			[`${prefix}bo.ra.tr-general`]: 10,
			[`${prefix}bo.ra.bl-general`]: 10,
			[`${prefix}bo.ra.br-general`]: 10,
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
		[`${prefix}bs-pac-general`]: {
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
			'bt_p.sy-general': 'axis',
			'bt_p.t-general': '15',
			'bt_p.r-general': '36',
			'bt_p.b-general': '15',
			'bt_p.l-general': '36',
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

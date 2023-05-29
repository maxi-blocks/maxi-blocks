/**
 * Imports
 */
import { prefixAttributesCreator } from '../../extensions/attributes';
import * as attributesData from '../../extensions/attributes/defaults/index';
import { transitionAttributesCreator } from '../../extensions/attributes/transitions';
import { customCss, transition } from './data';

/**
 * Attributes
 */
const prefix = 's-';
const attributes = {
	...attributesData.global,

	/**
	 * Block styles
	 */
	_oft: {
		type: 'boolean',
		default: true,
		longLabel: 'openFirstTime',
	},
	_st: {
		type: 'string',
		longLabel: 'svgType',
	},
	_c: {
		type: 'string',
	},
	_ati: { type: 'string', longLabel: 'altTitle' },
	_ade: { type: 'string', longLabel: 'altDescription' },
	...attributesData.svg,
	...attributesData.svgHover,
	...{
		...attributesData.alignment,
		'_a-g': {
			type: 'string',
			default: 'center',
		},
	},
	...prefixAttributesCreator({
		obj: attributesData.background,
		prefix,
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
	...attributesData.scroll,
	...attributesData.transform,
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
	...attributesData.flex,
};

export default attributes;

/**
 * Imports
 */
import * as attributesData from '../../extensions/attributes/defaults/index';
import { prefixAttributesCreator } from '../../extensions/attributes';
import { transitionAttributesCreator } from '../../extensions/attributes/transitions';
import { customCss, transition } from './data';

/**
 * Attributes
 */
const prefix = 'di-';
const attributes = {
	...attributesData.global,

	/**
	 * Block styles
	 */
	...attributesData.divider,
	...prefixAttributesCreator({ obj: attributesData.boxShadow, prefix }),
	...prefixAttributesCreator({ obj: attributesData.boxShadowHover, prefix }),

	/**
	 * Canvas styles
	 */
	...attributesData.blockBackground,
	...attributesData.border,
	...attributesData.borderHover,
	...attributesData.borderWidth,
	...attributesData.borderWidthHover,
	...attributesData.borderRadius,
	...attributesData.borderRadiusHover,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...attributesData.opacity,
	...attributesData.opacityHover,
	...{
		...attributesData.size,
		'_h-g': {
			type: 'string',
			default: '100',
		},
		'_h-unit-g': {
			type: 'string',
			default: 'px',
		},
	},
	...attributesData.margin,
	...attributesData.padding,

	/**
	 * Advanced
	 */
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
	...attributesData.flex,
};

export default attributes;

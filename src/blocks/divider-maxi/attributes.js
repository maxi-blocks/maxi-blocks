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
const prefix = 'divider-';
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
		'height-general': {
			type: 'string',
			default: '100',
		},
		'height-unit-general': {
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
	...attributesData.advancedCss,
	...attributesData.flex,
	...attributesData.dynamicContent,
};

export default attributes;

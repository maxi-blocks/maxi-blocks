/**
 * Imports
 */
import { transitionAttributesCreator } from '@extensions/styles';
import * as attributesData from '@extensions/styles/defaults/index';
import { customCss } from './data';

/**
 * Attributes
 */
const attributes = {
	...attributesData.global,

	/**
	 * Block styles
	 */
	...attributesData.blockBackground,
	...attributesData.border,
	...attributesData.borderHover,
	...attributesData.borderRadius,
	...attributesData.borderWidth,
	...attributesData.borderWidthHover,
	...attributesData.borderRadiusHover,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...attributesData.size,
	...attributesData.margin,
	...attributesData.padding,

	/**
	 * Advanced
	 */
	...attributesData.contextLoop,
	...attributesData.dynamicContentLink,
	...attributesData.transform,
	...{
		...attributesData.transition,
		...transitionAttributesCreator({ selectors: customCss.selectors }),
	},
	...attributesData.display,
	...attributesData.opacity,
	...attributesData.overflow,
	...attributesData.zIndex,
	...attributesData.customCss,
	...attributesData.advancedCss,
	...attributesData.flex,
};

export default attributes;

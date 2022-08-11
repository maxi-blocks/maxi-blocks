/**
 * Imports
 */
import { transitionAttributesCreator } from '../../extensions/styles';
import * as attributesData from '../../extensions/styles/defaults/index';

const attributes = {
	...attributesData.global,

	/**
	 * Block styles
	 */
	selectedMenuId: {
		type: 'string',
	},

	...attributesData.menuItem,
	...attributesData.menuItemEffect,
	...attributesData.border,
	...attributesData.borderHover,
	...attributesData.borderRadius,
	...attributesData.borderWidth,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...attributesData.size,
	...attributesData.margin,
	...attributesData.padding,

	/**
	 * Advanced
	 */
	...attributesData.transform,
	...{
		...attributesData.transition,
		...transitionAttributesCreator(),
	},
	...attributesData.display,
	...attributesData.opacity,
	...attributesData.overflow,
	...attributesData.zIndex,
	...attributesData.customCss,
	...attributesData.flex,
};

export default attributes;

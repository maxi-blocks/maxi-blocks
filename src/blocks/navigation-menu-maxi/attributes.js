/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults/index';

const attributes = {
	...attributesData.global,

	/**
	 * Block styles
	 */
	selectedMenuId: {
		type: 'number',
	},

	...attributesData.menuItem,
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
	...attributesData.display,
	...attributesData.opacity,
	...attributesData.overflow,
	...attributesData.zIndex,
	...attributesData.customCss,
	...attributesData.flex,
};

export default attributes;

/**
 * Imports
 */
import { transitionAttributesCreator } from '../../extensions/attributes/transitions';
import * as attributesData from '../../extensions/attributes/defaults/index';
import { customCss } from './data';

/**
 * Attributes
 */
const attributes = {
	...attributesData.global,

	/**
	 * Block styles
	 */
	...attributesData.slider,
	...attributesData.blockBackground,
	...{
		...attributesData.border,
		'bo_s-general': {
			type: 'string',
			default: 'solid',
		},
		'bo_pc-general': {
			type: 'number',
			default: 3,
		},
		'bo_po-general': {
			type: 'number',
			default: 0.25,
		},
	},
	...{
		...attributesData.borderWidth,
		'bo_w.t-general': {
			type: 'number',
			default: 1,
		},
		'bo_w.r-general': {
			type: 'number',
			default: 1,
		},
		'bo_w.b-general': {
			type: 'number',
			default: 1,
		},
		'bo_w.l-general': {
			type: 'number',
			default: 1,
		},
		'bo_w.sy-general': {
			type: 'string',
			default: 'all',
		},
	},
	...attributesData.borderRadius,
	...attributesData.borderHover,
	...attributesData.borderWidthHover,
	...attributesData.borderRadiusHover,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...attributesData.navigation,
	...attributesData.arrowIcon,
	...attributesData.arrowIconHover,
	...attributesData.dotIcon,
	...attributesData.dotIconHover,
	...attributesData.dotIconActive,

	...attributesData.size,
	...attributesData.margin,
	...attributesData.padding,

	/**
	 * Advanced
	 */
	...attributesData.transform,
	...{
		...attributesData.transition,
		...transitionAttributesCreator({ selectors: customCss.selectors }),
	},
	...attributesData.display,
	...attributesData.opacity,
	...attributesData.position,
	...attributesData.overflow,
	...attributesData.zIndex,
	...attributesData.customCss,
	...attributesData.flex,
};

export default attributes;

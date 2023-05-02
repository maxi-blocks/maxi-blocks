/**
 * Imports
 */
import * as attributesData from '../../extensions/attributes/defaults/index';
import { transitionAttributesCreator } from '../../extensions/attributes/transitions';
import { customCss } from './data';

/**
 * Attributes
 */
const attributes = {
	...attributesData.global,

	/**
	 * Block styles
	 */
	...attributesData.rowPattern,
	...attributesData.blockBackground,
	...attributesData.border,
	...attributesData.borderWidth,
	...attributesData.borderRadius,
	...attributesData.borderHover,
	...attributesData.borderWidthHover,
	...attributesData.borderRadiusHover,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...{
		...attributesData.size,
		_sao: {
			type: 'boolean',
			default: true,
		},
	},
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
	...attributesData.opacityHover,
	...attributesData.position,
	...attributesData.overflow,
	...attributesData.zIndex,
	...attributesData.customCss,
	...{
		...attributesData.flex,
		'_rg-general': {
			type: 'number',
			default: 20,
		},
		'_rg.u-general': {
			type: 'string',
			default: 'px',
		},
		'_cg-general': {
			type: 'number',
			default: 2.5,
		},
		'_cg.u-general': {
			type: 'string',
			default: '%',
		},
	},
	...attributesData.scroll,
};

export default attributes;

/**
 * Internal dependencies
 */
import { transitionAttributesCreator } from '../../extensions/attributes/transitions';

/**
 * Imports
 */
import * as attributesData from '../../extensions/attributes/defaults/index';
import { customCss, transition } from './data';

/**
 * Attributes
 */
const attributes = {
	...attributesData.global,
	...attributesData.dynamicContent,

	/**
	 * Block styles
	 */
	_c: {
		type: 'string',
		default: '',
	},
	...attributesData.text,
	...attributesData.link,
	...attributesData.textAlignment,
	...attributesData.typography,
	...attributesData.typographyHover,
	...attributesData.blockBackground,
	...attributesData.border,
	...attributesData.borderHover,
	...attributesData.borderRadius,
	...attributesData.borderRadiusHover,
	...attributesData.borderWidth,
	...attributesData.borderWidthHover,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...attributesData.size,
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
	...attributesData.opacity,
	...attributesData.opacityHover,
	...attributesData.position,
	...attributesData.overflow,
	...attributesData.zIndex,
	...attributesData.customCss,
	...attributesData.flex,
};

export default attributes;

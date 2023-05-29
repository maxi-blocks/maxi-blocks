/**
 * Imports
 */
import * as attributesData from '../../extensions/attributes/defaults/index';
import transitionAttributesCreator from '../../extensions/attributes/transitions/transitionAttributesCreator';
import { customCss, transition } from './data';
import blockAttributesShorter from '../../extensions/attributes/dictionary/blockAttributesShorter';

/**
 * Attributes
 */

const attributes = {
	...attributesData.global,

	/**
	 * Block styles
	 */
	...attributesData.accordion,
	...attributesData.accordionIcon,
	...attributesData.accordionTitle,
	...attributesData.accordionLine,
	...attributesData.blockBackground,
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
	...{
		...attributesData.flex,
		'_rg-g': {
			type: 'number',
			default: 15,
		},
		'_fd-g': {
			type: 'string',
			default: 'column',
		},
	},
};

export default blockAttributesShorter(attributes);

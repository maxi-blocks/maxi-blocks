/**
 * Imports
 */
import * as attributesData from '@extensions/styles/defaults/index';
import { transitionAttributesCreator } from '@extensions/styles';
import { customCss, transition } from './data';

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
	...attributesData.contextLoop,
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
	...attributesData.advancedCss,
	...{
		...attributesData.flex,
		'row-gap-general': {
			type: 'number',
			default: 15,
		},
		'flex-direction-general': {
			type: 'string',
			default: 'column',
		},
	},
};

export default attributes;

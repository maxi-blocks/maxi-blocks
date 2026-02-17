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
	...attributesData.rowPattern,
	...attributesData.repeater,
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
		'size-advanced-options': {
			type: 'boolean',
			default: true,
		},
	},
	...attributesData.margin,
	...attributesData.padding,

	/**
	 * Advanced
	 */
	...attributesData.contextLoop,
	...attributesData.rowCarousel,
	...attributesData.rowCarouselAlignment,
	...attributesData.navigation,
	...attributesData.arrowIcon,
	...attributesData.arrowIconHover,
	...attributesData.dotIcon,
	...attributesData.dotIconActive,
	...attributesData.dotIconHover,
	...attributesData.dynamicContentLink,
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
			default: 20,
		},
		'row-gap-unit-general': {
			type: 'string',
			default: 'px',
		},
		'column-gap-general': {
			type: 'number',
			default: 2.5,
		},
		'column-gap-unit-general': {
			type: 'string',
			default: '%',
		},
	},
	...attributesData.scroll,
};

export default attributes;

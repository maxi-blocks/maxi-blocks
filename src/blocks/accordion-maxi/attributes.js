/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults/index';
import { transitionAttributesCreator } from '../../extensions/styles';
import transitionObj from './transitionObj';

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
		...transitionAttributesCreator(transitionObj),
	},
	...attributesData.display,
	...attributesData.position,
	...attributesData.overflow,
	...attributesData.zIndex,
	...attributesData.customCss,
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

/**
 * Internal dependencies
 */
import * as attributesData from '../../extensions/styles/defaults/index';
import { transitionAttributesCreator } from '../../extensions/styles';

/**
 * Attributes
 */
const attributes = {
	...attributesData.global,

	/**
	 * Block styles
	 */
	title: { type: 'string' },
	accordionLayout: { type: 'string' },
	titleLevel: { type: 'string', default: 'h6' },

	...attributesData.blockBackground,
	...attributesData.border,
	...attributesData.borderHover,
	...attributesData.borderRadius,
	...attributesData.borderWidth,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...attributesData.size,
	...attributesData.margin,
	...{
		...attributesData.padding,
		'padding-top-general': {
			type: 'string',
			default: '25',
		},
		'padding-bottom-general': {
			type: 'string',
			default: '25',
		},
		'padding-left-general': {
			type: 'string',
			default: '25',
		},
		'padding-right-general': {
			type: 'string',
			default: '25',
		},
	},

	/**
	 * Advanced
	 */
	...attributesData.scroll,
	...attributesData.transform,
	...{
		...attributesData.transition,
		...transitionAttributesCreator(),
	},
	...attributesData.display,
	...attributesData.position,
	...attributesData.overflow,
	...attributesData.zIndex,
	...attributesData.customCss,
	...attributesData.flex,
};

export default attributes;

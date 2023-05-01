/**
 * Internal dependencies
 */
import * as attributesData from '../../extensions/attributes/defaults/index';
import { prefixAttributesCreator } from '../../extensions/attributes';
import { transitionAttributesCreator } from '../../extensions/attributes/transitions';
import { customCss, transition } from './data';

const mutualAttributes = {
	...attributesData.background,
	...attributesData.backgroundColor,
	...attributesData.backgroundGradient,

	...attributesData.backgroundHover,
	...attributesData.backgroundColorHover,
	...attributesData.backgroundGradientHover,
	...attributesData.backgroundActive,
	...attributesData.backgroundColorActive,
	...attributesData.backgroundGradientActive,

	...attributesData.border,
	...attributesData.borderHover,
	...attributesData.borderActive,
	...attributesData.borderRadius,
	...attributesData.borderWidth,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...attributesData.boxShadowActive,
	...attributesData.size,
	...attributesData.padding,
};

/**
 * Attributes
 */
const attributes = {
	...attributesData.global,

	/**
	 * Block styles
	 */
	title: { type: 'string' },
	_acl: { type: 'string', longLabel: 'accordionLayout' },
	titleLevel: { type: 'string', default: 'h6' },
	accordionUniqueId: { type: 'string' },

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
		'_p.t-general': {
			type: 'string',
			default: '25',
		},
		'_p.b-general': {
			type: 'string',
			default: '25',
		},
		'_p.l-general': {
			type: 'string',
			default: '25',
		},
		'_p.r-general': {
			type: 'string',
			default: '25',
		},
	},

	/**
	 * Header
	 */
	...prefixAttributesCreator({
		obj: mutualAttributes,
		prefix: 'he-',
	}),

	/**
	 * Content
	 */
	...prefixAttributesCreator({
		obj: {
			...mutualAttributes,
			'_p.t-general': {
				type: 'string',
				default: '25',
			},
			'_p.b-general': {
				type: 'string',
				default: '25',
			},
			'_p.sy-general': {
				type: 'string',
				default: 'axis',
			},
		},
		prefix: 'c-',
	}),

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

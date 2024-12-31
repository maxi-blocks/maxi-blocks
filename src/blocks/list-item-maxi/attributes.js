/**
 * Internal dependencies
 */
import {
	hoverAttributesCreator,
	linkAttributesCreator,
	transitionAttributesCreator,
	typographyAttributesCreator,
} from '@extensions/styles';

/**
 * Imports
 */
import * as attributesData from '@extensions/styles/defaults/index';
import { customCss, transition } from './data';

/**
 * Attributes
 */
const listItemTypography = typographyAttributesCreator(false, true);

const attributes = {
	...attributesData.global,

	/**
	 * Block styles
	 */
	content: {
		type: 'string',
		default: '',
	},
	...linkAttributesCreator(false),
	...listItemTypography,
	...hoverAttributesCreator({
		obj: listItemTypography,
		sameValAttr: ['palette-status-general'],
		newAttr: {
			'typography-status-hover': {
				type: 'boolean',
			},
		},
	}),
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
	...attributesData.advancedCss,
	...attributesData.flex,
};

export default attributes;

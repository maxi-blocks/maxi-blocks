/**
 * Imports
 */
import { transitionAttributesCreator } from '@extensions/styles';
import * as attributesData from '@extensions/styles/defaults/index';
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
		'border-style-general': {
			type: 'string',
			default: 'solid',
		},
		'border-palette-color-general': {
			type: 'number',
			default: 3,
		},
		'border-palette-opacity-general': {
			type: 'number',
			default: 0.25,
		},
	},
	...{
		...attributesData.borderWidth,
		'border-top-width-general': {
			type: 'number',
			default: 1,
		},
		'border-right-width-general': {
			type: 'number',
			default: 1,
		},
		'border-bottom-width-general': {
			type: 'number',
			default: 1,
		},
		'border-left-width-general': {
			type: 'number',
			default: 1,
		},
		'border-sync-width-general': {
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
	...attributesData.contextLoop,
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
	...attributesData.advancedCss,
	...attributesData.flex,
};

export default attributes;

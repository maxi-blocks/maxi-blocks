/**
 * Imports
 */
import { transitionAttributesCreator } from '../../extensions/attributes/transitions';
import * as attributesData from '../../extensions/attributes/defaults/index';
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
		'border-pac-general': {
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
		'border-width-top-general': {
			type: 'number',
			default: 1,
		},
		'border-width-right-general': {
			type: 'number',
			default: 1,
		},
		'border-width-bottom-general': {
			type: 'number',
			default: 1,
		},
		'border-width-left-general': {
			type: 'number',
			default: 1,
		},
		'border-width-sync-general': {
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
	...attributesData.flex,
};

export default attributes;

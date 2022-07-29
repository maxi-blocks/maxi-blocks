/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults/index';

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
	...attributesData.arrowIconBackground,
	...attributesData.arrowIconBackgroundColor,
	...attributesData.arrowIconBackgroundGradient,
	...attributesData.arrowIconBorder,
	...attributesData.arrowIconBorderRadius,
	...attributesData.arrowIconBorderWidth,
	...attributesData.arrowIconPadding,
	...attributesData.arrowIconBoxShadow,
	...attributesData.arrowIconHover,
	...attributesData.arrowIconBackgroundHover,
	...attributesData.arrowIconBackgroundColorHover,
	...attributesData.arrowIconBackgroundGradientHover,
	...attributesData.arrowIconBorderHover,
	...attributesData.arrowIconBorderRadiusHover,
	...attributesData.arrowIconBorderWidthHover,
	...attributesData.arrowIconBoxShadowHover,
	...attributesData.dotIcon,
	...attributesData.dotIconHover,
	...attributesData.dotIconActive,
	...attributesData.dotIconBackground,
	...attributesData.dotIconBackgroundColor,
	...attributesData.dotIconBackgroundGradient,
	...attributesData.dotIconBorder,
	...attributesData.dotIconBorderRadius,
	...attributesData.dotIconBorderWidth,
	...attributesData.dotIconPadding,
	...attributesData.dotIconBoxShadow,
	...attributesData.dotIconBackgroundHover,
	...attributesData.dotIconBackgroundColorHover,
	...attributesData.dotIconBackgroundGradientHover,
	...attributesData.dotIconBorderHover,
	...attributesData.dotIconBorderRadiusHover,
	...attributesData.dotIconBorderWidthHover,
	...attributesData.dotIconBoxShadowHover,
	...{
		...attributesData.size,
		'max-width-xxl': {
			type: 'number',
			default: 1690,
		},
		'max-width-xl': {
			type: 'number',
			default: 1170,
		},
		'max-width-l': {
			type: 'number',
			default: 90,
		},
		'max-width-unit-xxl': {
			type: 'string',
			default: 'px',
		},
		'max-width-unit-xl': {
			type: 'string',
			default: 'px',
		},
		'max-width-unit-l': {
			type: 'string',
			default: '%',
		},
	},
	...attributesData.margin,
	...attributesData.padding,

	/**
	 * Advanced
	 */
	...attributesData.transform,
	...attributesData.display,
	...attributesData.opacity,
	...attributesData.position,
	...attributesData.overflow,
	...attributesData.zIndex,
	...attributesData.customCss,
	...attributesData.flex,
};

export default attributes;

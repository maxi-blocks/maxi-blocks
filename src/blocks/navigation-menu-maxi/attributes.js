/**
 * Imports
 */
import {
	prefixAttributesCreator,
	transitionAttributesCreator,
} from '../../extensions/styles';
import * as attributesData from '../../extensions/styles/defaults/index';
import { transition, submenuIndicatorPrefix } from './data';

const submenuIndicatorIcon = {
	[`${submenuIndicatorPrefix}svgType`]: {
		type: 'string',
		default: 'Line',
	},
	...prefixAttributesCreator({
		obj: {
			...attributesData.icon,
			...attributesData.iconHover,
			...attributesData.iconBackground,
			...attributesData.iconBackgroundHover,
			...attributesData.iconPadding,
			...attributesData.iconBackgroundColor,
			...attributesData.iconBackgroundColorHover,
			...attributesData.iconBackgroundGradient,
			...attributesData.iconBackgroundGradientHover,
			...attributesData.iconBorder,
			...attributesData.iconBorderWidth,
			...attributesData.iconBorderRadius,
			...attributesData.iconBorderHover,
			...attributesData.iconBorderWidthHover,
			...attributesData.iconBorderRadiusHover,
		},
		prefix: submenuIndicatorPrefix,
		diffValAttr: {
			[`${submenuIndicatorPrefix}icon-inherit`]: false,
			[`${submenuIndicatorPrefix}icon-stroke-palette-color`]: 5,
			[`${submenuIndicatorPrefix}icon-content`]:
				'<svg class="arrow-down-line-maxi-svg" width="64px" height="64px" viewBox="0 0 24 24" fill="none" data-stroke stroke="#081219" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"><path d="M19 15.15l-7 7-7-7m7 7V1.85"/></svg>',
		},
	}),
	...prefixAttributesCreator({
		obj: {
			...attributesData.icon,
			...attributesData.iconBackground,
			...attributesData.iconPadding,
			...attributesData.iconBackgroundColor,
			...attributesData.iconBackgroundGradient,
			...attributesData.iconBorder,
			...attributesData.iconBorderWidth,
			...attributesData.iconBorderRadius,
		},
		prefix: `active-${submenuIndicatorPrefix}`,
		diffValAttr: {
			[`active-${submenuIndicatorPrefix}icon-inherit`]: false,
			[`active-${submenuIndicatorPrefix}icon-stroke-palette-color`]: 5,
		},
	}),
};

const attributes = {
	...attributesData.global,

	/**
	 * Block styles
	 */
	selectedMenuId: {
		type: 'string',
	},

	...attributesData.menuItem,
	...attributesData.menuItemEffect,
	...attributesData.border,
	...attributesData.borderHover,
	...attributesData.borderRadius,
	...attributesData.borderWidth,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...attributesData.size,
	...attributesData.margin,
	...attributesData.padding,

	...submenuIndicatorIcon,

	/**
	 * Advanced
	 */
	...attributesData.transform,
	...{
		...attributesData.transition,
		...transitionAttributesCreator(transition),
	},
	...attributesData.display,
	...attributesData.opacity,
	...attributesData.overflow,
	...attributesData.zIndex,
	...attributesData.customCss,
	...attributesData.flex,
};

export default attributes;

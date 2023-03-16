/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults/index';
import {
	prefixAttributesCreator,
	transitionAttributesCreator,
} from '../../extensions/styles';
import { customCss, transition } from './data';

/**
 * Attributes
 */
const accordionIcon = {
	...prefixAttributesCreator({
		obj: {
			...attributesData.icon,
			...attributesData.iconBackground,
			...attributesData.iconBackgroundColor,
			...attributesData.iconBackgroundGradient,
			...attributesData.iconBorder,
			...attributesData.iconBorderRadius,
			...attributesData.iconBorderWidth,
			...attributesData.iconPadding,
		},
		prefix: 'active-',
		diffValAttr: {
			'active-icon-stroke-palette-color': 5,
			'active-icon-inherit': false,
			'active-icon-content':
				'<svg class="arrow-up-2-line-maxi-svg" width="64px" height="64px" viewBox="0 0 24 24"><path d="M2.9 17.25L12 6.75l9.1 10.5" fill="none" data-stroke="" stroke="#081219" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"></path></svg>',
		},
	}),
	...{
		...attributesData.icon,
		'icon-inherit': {
			type: 'boolean',
			default: false,
		},
	},
	...attributesData.iconBackground,
	...attributesData.iconBackgroundColor,
	...attributesData.iconBackgroundGradient,
	...attributesData.iconBorder,
	...attributesData.iconBorderRadius,
	...attributesData.iconBorderWidth,
	...attributesData.iconPadding,
	...attributesData.iconHover,
	...attributesData.iconBackgroundHover,
	...attributesData.iconBackgroundColorHover,
	...attributesData.iconBackgroundGradientHover,
	...attributesData.iconBorderHover,
	...attributesData.iconBorderRadiusHover,
	...attributesData.iconBorderWidthHover,

	'icon-content': {
		type: 'string',
		default:
			'<svg class="arrow-down-2-line-maxi-svg" width="64px" height="64px" viewBox="0 0 24 24"><path d="M21.1 6.75L12 17.25 2.9 6.75" fill="none" data-stroke="" stroke="#081219" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"></path></svg>',
	},
	'icon-stroke-palette-color': {
		type: 'number',
		default: 5,
	},
};

const attributes = {
	...attributesData.global,

	/**
	 * Block styles
	 */
	...attributesData.accordion,
	...accordionIcon,
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

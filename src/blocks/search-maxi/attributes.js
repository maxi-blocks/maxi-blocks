/**
 * Imports
 */
import * as attributesData from '@extensions/styles/defaults/index';
import {
	prefixAttributesCreator,
	transitionAttributesCreator,
} from '@extensions/styles';
import { customCss, prefixes, transition } from './data';

const { buttonPrefix, closeIconPrefix, inputPrefix } = prefixes;

/**
 * Attributes
 */
const attributes = {
	...attributesData.global,

	/**
	 * Block styles
	 */
	...attributesData.border,
	...attributesData.borderHover,
	...attributesData.borderRadius,
	...attributesData.borderRadiusHover,
	...attributesData.borderWidth,
	...attributesData.borderWidthHover,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...attributesData.margin,
	...attributesData.padding,
	...attributesData.size,

	/**
	 * Input styles
	 */
	skin: {
		type: 'string',
		default: 'boxed',
	},
	...prefixAttributesCreator({
		obj: {
			...attributesData.typography,
			...attributesData.typographyHover,
			...attributesData.border,
			...attributesData.borderHover,
			...attributesData.borderRadius,
			...attributesData.borderRadiusHover,
			...attributesData.borderWidth,
			...attributesData.padding,
			...attributesData.background,
			...attributesData.backgroundColor,
			...attributesData.backgroundHover,
			...attributesData.backgroundColorHover,
		},
		prefix: inputPrefix,
		diffValAttr: {
			[`${inputPrefix}font-size-general`]: '20',
			[`${inputPrefix}border-style-general`]: 'solid',
			[`${inputPrefix}border-top-width-general`]: 4,
			[`${inputPrefix}border-right-width-general`]: 0,
			[`${inputPrefix}border-bottom-width-general`]: 4,
			[`${inputPrefix}border-left-width-general`]: 4,
			[`${inputPrefix}border-top-left-radius-general`]: 0,
			[`${inputPrefix}border-top-right-radius-general`]: 0,
			[`${inputPrefix}border-bottom-left-radius-general`]: 0,
			[`${inputPrefix}border-bottom-right-radius-general`]: 0,
			[`${inputPrefix}border-sync-general`]: 'none',
			[`${inputPrefix}padding-top-general`]: '8',
			[`${inputPrefix}padding-right-general`]: '35',
			[`${inputPrefix}padding-bottom-general`]: '8',
			[`${inputPrefix}padding-left-general`]: '10',
			[`${inputPrefix}padding-sync-general`]: 'axis',
			[`${inputPrefix}background-active-media-general`]: 'color',
		},
	}),

	/**
	 * Button styles
	 */
	...attributesData.searchButton,
	...prefixAttributesCreator({
		obj: {
			...attributesData.typography,
			...attributesData.typographyHover,
			...attributesData.padding,
			...attributesData.margin,
			...attributesData.background,
			...attributesData.backgroundColor,
			...attributesData.backgroundHover,
			...attributesData.backgroundColorHover,
			...attributesData.border,
			...attributesData.borderHover,
			...attributesData.borderRadius,
			...attributesData.borderRadiusHover,
		},
		prefix: buttonPrefix,
		diffValAttr: {
			[`${buttonPrefix}palette-color-general`]: 1,
			[`${buttonPrefix}padding-top-general`]: '12',
			[`${buttonPrefix}padding-right-general`]: '12',
			[`${buttonPrefix}padding-bottom-general`]: '12',
			[`${buttonPrefix}padding-left-general`]: '12',
			[`${buttonPrefix}background-active-media-general`]: 'color',
			[`${buttonPrefix}background-palette-color-general`]: 4,
		},
	}),
	placeholder: {
		type: 'string',
		default: 'Search...',
	},
	...attributesData.placeholderColor,
	...{
		...attributesData.icon,
		svgType: {
			type: 'string',
			default: 'Shape',
		},
		'icon-inherit': {
			type: 'boolean',
			default: false,
		},
		'icon-width-general': {
			type: 'string',
			default: '25',
		},
		'icon-fill-palette-color': {
			type: 'number',
			default: 1,
		},
		'icon-spacing-general': {
			type: 'number',
			default: 0,
		},
		'icon-content': {
			type: 'string',
			default:
				'<svg viewBox="0 0 36.1 36.1" height="64px" width="64px" class="magnifying-glass-41-shape-maxi-svg"><path fill="#081219" d="M35.2 32.1l-7.9-7.9c1.9-2.6 3-5.7 3-8.9 0-8.3-6.8-15-15-15s-15 6.8-15 15 6.8 15 15 15c3.2 0 6.4-1 8.9-3l7.9 7.9c.4.4 1 .7 1.6.7s1.2-.2 1.6-.7.7-1 .7-1.6-.3-1.1-.8-1.5zm-19.9-6.2c-5.8 0-10.6-4.8-10.6-10.6S9.4 4.7 15.3 4.7s10.6 4.8 10.6 10.6-4.8 10.6-10.6 10.6z" data-fill></path></svg>',
		},
	},
	...attributesData.iconHover,
	...prefixAttributesCreator({
		obj: { ...attributesData.icon, ...attributesData.iconHover },
		prefix: closeIconPrefix,
		diffValAttr: {
			[`${closeIconPrefix}svgType`]: 'Shape',
			[`${closeIconPrefix}icon-inherit`]: false,
			[`${closeIconPrefix}icon-width-general`]: '25',
			[`${closeIconPrefix}icon-fill-palette-color`]: 1,
			[`${closeIconPrefix}icon-spacing-general`]: 0,
			[`${closeIconPrefix}icon-content`]:
				'<svg class="cross-29-shape-maxi-svg" width="64px" height="64px" viewBox="0 0 36.1 36.1" data-fill fill="#081219"><path d="M26.1 13l-3-3-5 5-5.1-5-3 3 5 5-5 5.1 3 3 5.1-5 5 5 3-3-5-5.1zm4.5-7.5c-6.9-6.9-18.2-6.9-25.1 0s-6.9 18.2 0 25.1 18.2 6.9 25.1 0 6.9-18.2 0-25.1zm-2.1 23c-5.8 5.8-15.2 5.8-20.9 0-5.8-5.8-5.8-15.2 0-20.9 5.8-5.8 15.2-5.8 20.9 0 5.8 5.8 5.8 15.1 0 20.9z"/></svg>',
		},
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
	...attributesData.advancedCss,
	...attributesData.flex,
};

export default attributes;

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults/index';
import {
	prefixAttributesCreator,
	transitionAttributesCreator,
} from '../../extensions/styles';

/**
 * Attributes
 */
const searchButtonPrefix = 'search-button-';
const searchInputPrefix = 'search-input-';

const attributes = {
	...attributesData.global,

	/**
	 * Block styles
	 */
	customLabel: {
		type: 'string',
		default: __('Search', 'maxi-blocks'),
	},
	content: {
		type: 'string',
	},
	placeholder: {
		type: 'string',
		default: 'Search...',
	},
	svgType: {
		type: 'string',
		default: 'Shape',
	},
	skin: {
		type: 'string',
		default: 'boxed',
	},
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
	...attributesData.searchButton,
	...attributesData.size,

	/**
	 * Input styles
	 */
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
		},
		prefix: searchInputPrefix,
		diffValAttr: {
			[`${searchInputPrefix}font-size-general`]: '20',
			[`${searchInputPrefix}border-style-general`]: 'solid',
			[`${searchInputPrefix}border-top-width-general`]: 4,
			[`${searchInputPrefix}border-right-width-general`]: 0,
			[`${searchInputPrefix}border-bottom-width-general`]: 4,
			[`${searchInputPrefix}border-left-width-general`]: 4,
			[`${searchInputPrefix}padding-top-general`]: '8',
			[`${searchInputPrefix}padding-right-general`]: '10',
			[`${searchInputPrefix}padding-bottom-general`]: '8',
			[`${searchInputPrefix}padding-left-general`]: '10',
			[`${searchInputPrefix}background-active-media-general`]: 'color',
		},
	}),

	/**
	 * Button styles
	 */
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
		prefix: searchButtonPrefix,
		diffValAttr: {
			[`${searchButtonPrefix}palette-color-general`]: 1,
			[`${searchButtonPrefix}padding-top-general`]: '8',
			[`${searchButtonPrefix}padding-right-general`]: '8',
			[`${searchButtonPrefix}padding-bottom-general`]: '8',
			[`${searchButtonPrefix}padding-left-general`]: '8',
			[`${searchButtonPrefix}background-active-media-general`]: 'color',
			[`${searchButtonPrefix}background-palette-color-general`]: 4,
		},
	}),
	...{
		...attributesData.icon,
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
		prefix: 'close-',
		diffValAttr: {
			'close-icon-inherit': false,
			'close-icon-width-general': '25',
			'close-icon-fill-palette-color': 1,
			'close-icon-spacing-general': 0,
			'close-icon-content':
				'<svg class="cross-58-shape-maxi-svg" width="64px" height="64px" viewBox="0 0 36.1 36.1" data-fill fill="#081219"><path d="M18.1.4A17.67 17.67 0 0 0 .4 18.1c0 9.8 7.9 17.6 17.6 17.6s17.6-7.9 17.6-17.6S27.8.4 18.1.4zm16.2 17.7c0 9-7.3 16.3-16.3 16.3S1.7 27.1 1.7 18.1 9.1 1.8 18.1 1.8c8.9 0 16.2 7.3 16.2 16.3zm-9.4-7.3c-.3-.3-.9-.3-1.2 0L18 16.5l-5.7-5.7c-.3-.3-.9-.3-1.2 0s-.3.9 0 1.2l5.7 5.7-5.7 5.7c-.3.3-.3.9 0 1.2.2.2.4.3.6.3s.4-.1.6-.3l5.7-5.7 5.7 5.7c.2.2.4.3.6.3s.4-.1.6-.3c.3-.3.3-.9 0-1.2l-5.7-5.7 5.7-5.7a.75.75 0 0 0 0-1.2z"/></svg>',
		},
	}),

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
	...attributesData.opacity,
	...attributesData.position,
	...attributesData.overflow,
	...attributesData.zIndex,
	...attributesData.customCss,
	...attributesData.flex,
};

export default attributes;

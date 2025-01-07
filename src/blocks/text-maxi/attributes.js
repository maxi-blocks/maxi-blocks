/**
 * Internal dependencies
 */
import {
	breakpointAttributesCreator,
	paletteAttributesCreator,
	transitionAttributesCreator,
} from '@extensions/styles';

/**
 * Imports
 */
import * as attributesData from '@extensions/styles/defaults/index';
import { customCss, transition } from './data';

/**
 * Attributes
 */
const attributes = {
	...attributesData.global,
	...attributesData.dynamicContent,

	/**
	 * Block styles
	 */
	content: {
		type: 'string',
		default: '',
	},
	textLevel: {
		type: 'string',
		default: 'p',
	},
	isList: {
		type: 'boolean',
		default: false,
	},
	typeOfList: {
		type: 'string',
		default: 'ul',
	},
	listStart: {
		type: 'number',
	},
	listReversed: {
		type: 'boolean',
	},
	...breakpointAttributesCreator({
		obj: {
			'list-gap': {
				type: 'number',
				default: 1,
			},
			'list-gap-unit': {
				type: 'string',
				default: 'em',
			},
			'list-paragraph-spacing': {
				type: 'number',
			},
			'list-paragraph-spacing-unit': {
				type: 'string',
				default: 'em',
			},
			'list-indent': {
				type: 'number',
			},
			'list-indent-unit': {
				type: 'string',
				default: 'px',
			},
			'list-marker-size': {
				type: 'number',
				default: 1,
			},
			'list-marker-size-unit': {
				type: 'string',
				default: 'em',
			},
			'list-marker-height': {
				type: 'number',
			},
			'list-marker-height-unit': {
				type: 'string',
				default: 'em',
			},
			'list-marker-indent': {
				type: 'number',
				default: 0.5,
			},
			'list-marker-indent-unit': {
				type: 'string',
				default: 'em',
			},
			'list-marker-line-height': {
				type: 'number',
				default: 0.5,
			},
			'list-marker-line-height-unit': {
				type: 'string',
				default: 'em',
			},
			'list-marker-vertical-offset': {
				type: 'number',
				default: 0,
			},
			'list-marker-vertical-offset-unit': {
				type: 'string',
				default: 'px',
			},
			'list-text-position': {
				type: 'string',
				default: 'middle',
			},
			'list-style-position': {
				type: 'string',
				default: 'outside',
			},
		},
	}),
	listStyle: {
		type: 'string',
	},
	listStyleCustom: {
		type: 'string',
	},
	...paletteAttributesCreator({ prefix: 'list-', palette: 4 }),
	...attributesData.link,
	...attributesData.textAlignment,
	...attributesData.typography,
	...attributesData.typographyHover,
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

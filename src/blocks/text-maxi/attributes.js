/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

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
	customLabel: {
		type: 'string',
		default: __('Text', 'maxi-blocks'),
	},
	blockFullWidth: {
		type: 'string',
		default: 'normal',
	},
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
		type: 'number',
		default: 0,
	},
	listStyle: {
		type: 'string',
	},
	listStyleCustom: {
		type: 'string',
	},
	listPosition: {
		type: 'string',
	},
	listSVGColor: {
		type: 'string',
	},
	listSize: {
		type: 'number',
	},
	listSizeUnit: {
		type: 'string',
	},
	// TODO: replace with future breakpointObjectCreator
	// https://github.com/yeahcan/maxi-blocks/blob/b384ce2226e0181226817f5eda4723d1733a2f6a/src/extensions/styles/breakpointObjectCreator.js#L7
	...(() => {
		const response = {};

		['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'].forEach(breakpoint => {
			response[`list-gap-${breakpoint}`] = {
				type: 'number',
				...(breakpoint === 'general' && { default: 1 }),
			};
			response[`list-gap-unit-${breakpoint}`] = {
				type: 'string',
				...(breakpoint === 'general' && { default: 'em' }),
			};
			response[`list-indent-${breakpoint}`] = {
				type: 'number',
			};
			response[`list-indent-unit-${breakpoint}`] = {
				type: 'string',
				...(breakpoint === 'general' && { default: 'px' }),
			};
		});

		return response;
	})(),
	...attributesData.container,
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
	...attributesData.transitionDuration,
	...attributesData.display,
	...attributesData.opacity,
	...attributesData.position,
	...attributesData.overflow,
	...attributesData.zIndex,
	...attributesData.customCss,
};

export default attributes;

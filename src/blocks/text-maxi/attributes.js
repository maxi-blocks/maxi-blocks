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
	customLabel: {
		type: 'string',
		default: __('Text', 'maxi-blocks'),
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
	blockFullWidth: {
		type: 'string',
		default: 'normal',
	},
	content: {
		type: 'string',
		default: '',
	},
	...attributesData.blockBackground,
	...attributesData.border,
	...attributesData.borderHover,
	...attributesData.borderRadius,
	...attributesData.borderRadiusHover,
	...attributesData.borderWidth,
	...attributesData.borderWidthHover,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...attributesData.container,
	...attributesData.display,
	...attributesData.link,
	...attributesData.margin,
	...attributesData.motion,
	...attributesData.opacity,
	...attributesData.padding,
	...attributesData.position,
	...attributesData.size,
	...attributesData.textAlignment,
	...attributesData.transform,
	...attributesData.typography,
	...attributesData.typographyHover,
	...attributesData.zIndex,
	...attributesData.transitionDuration,
	...attributesData.overflow,
};

export default attributes;

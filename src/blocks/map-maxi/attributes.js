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
		default: __('Map', 'maxi-blocks'),
	},
	blockFullWidth: {
		type: 'string',
		default: 'normal',
	},
	...attributesData.map,
	...{
		...attributesData.size,
		'height-general': {
			type: 'number',
			default: 300,
		},
		'height-unit-general': {
			type: 'string',
			default: 'px',
		},
	},
	...attributesData.margin,
	...attributesData.padding,
	...attributesData.opacity,
	...attributesData.position,
	...attributesData.transform,
	...attributesData.display,
	...attributesData.zIndex,
	...attributesData.overflow,
	...attributesData.border,
	...attributesData.borderHover,
	...attributesData.borderRadius,
	...attributesData.borderRadiusHover,
	...attributesData.borderWidth,
	...attributesData.borderWidthHover,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
};

export default attributes;

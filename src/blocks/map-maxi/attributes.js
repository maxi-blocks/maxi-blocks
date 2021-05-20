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
	...attributesData.map,
	...attributesData.palette,
	...attributesData.margin,
	...attributesData.padding,
	...attributesData.opacity,
	...attributesData.position,
	...attributesData.transform,
	...attributesData.display,
	...attributesData.zIndex,
};

export default attributes;

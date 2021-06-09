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
		default: __('Number Counter', 'maxi-blocks'),
	},
	...attributesData.palette.circle,
	...attributesData.numberCounter,
	...attributesData.margin,
	...attributesData.padding,
	...attributesData.opacity,
	...attributesData.position,
	...attributesData.transform,
	...attributesData.display,
	...attributesData.entrance,
	...attributesData.zIndex,
};

export default attributes;

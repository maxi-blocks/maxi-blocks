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
	fullWidth: {
		type: 'string',
		default: 'normal',
	},
	...attributesData.map,
	...attributesData.palette,
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
};

export default attributes;

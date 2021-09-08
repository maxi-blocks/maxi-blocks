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
	...attributesData.display,
	...attributesData.entrance,
	...attributesData.margin,
	...attributesData.numberCounter,
	...attributesData.opacity,
	...attributesData.padding,
	...attributesData.position,
	...{
		...attributesData.size,
		'width-general': {
			type: 'number',
			default: 250,
		},
		'width-unit-general': {
			type: 'string',
			default: 'px',
		},
	},
	...attributesData.transform,
	...attributesData.zIndex,
};

export default attributes;

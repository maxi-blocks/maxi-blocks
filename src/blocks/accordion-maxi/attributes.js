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
		default: __('Group', 'maxi-blocks'),
	},
	blockFullWidth: {
		type: 'string',
		default: 'normal',
	},
	lastIndex: {
		type: 'number',
		default: 0,
	},
	'icon-content': {
		type: 'string',
		default: '',
	},
	'icon-content-active': {
		type: 'string',
		default: '',
	},
};

export default attributes;

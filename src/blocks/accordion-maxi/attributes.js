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
		default: __('Accordion', 'maxi-blocks'),
	},
	blockFullWidth: {
		type: 'string',
		default: 'normal',
	},
	lastIndex: {
		type: 'number',
		default: 2,
	},
	accordionLayout: { type: 'string', default: 'simple' },
	autoPaneClose: { type: 'boolean', default: true },
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

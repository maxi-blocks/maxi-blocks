/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
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
		default: __('Pane', 'maxi-blocks'),
	},

	title: { type: 'string' },
	accordionLayout: { type: 'string' },
	titleLevel: { type: 'string', default: 'h6' },
};

export default attributes;

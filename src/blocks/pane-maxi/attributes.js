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

	blockFullWidth: {
		type: 'string',
		default: 'normal',
	},
	title: { type: 'string' },
	'icon-content': {
		type: 'string',
		default: '',
	},
};

export default attributes;

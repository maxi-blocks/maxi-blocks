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
	accordionLayout: { type: 'string' },
};

export default attributes;

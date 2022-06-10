/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults/index';
import { paletteAttributesCreator } from '../../extensions/styles';

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
	...attributesData.accordion,
	titleLevel: { type: 'string', default: 'h6' },
	...{
		...paletteAttributesCreator({ prefix: 'title-' }),
		'title-palette-color': { type: 'number', default: 6 },
	},
	...{
		...paletteAttributesCreator({ prefix: 'title-background-' }),
		'title-background-palette-color': { type: 'number', default: 1 },
	},
	...attributesData.accordionIcon,
};

export default attributes;

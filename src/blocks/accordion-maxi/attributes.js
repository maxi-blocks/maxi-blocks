/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults/index';
import {
	breakpointAttributesCreator,
	hoverAttributesCreator,
	paletteAttributesCreator,
} from '../../extensions/styles';

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
	'background-status-hover': { type: 'boolean', default: false },
	'active-background-status-hover': { type: 'boolean', default: false },
	...breakpointAttributesCreator({
		obj: {
			...paletteAttributesCreator({ prefix: 'background-', palette: 1 }),
			...paletteAttributesCreator({
				prefix: 'active-background-',
				palette: 1,
			}),
			...hoverAttributesCreator({
				obj: {
					...paletteAttributesCreator({
						prefix: 'background-',
						palette: 1,
					}),
					...paletteAttributesCreator({
						prefix: 'active-background-',
						palette: 1,
					}),
				},
			}),
		},
	}),
};

export default attributes;

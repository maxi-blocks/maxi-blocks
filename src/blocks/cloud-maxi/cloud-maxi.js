/**
 * BLOCK: GE Library
 * A block to import other blocks or layotus directly from the online library
 */

/**
 * Import dependencies.
 */
import edit from './edit';
import { library } from '../../icons';
import './style.scss';
import './editor.scss';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

/**
 * Register the Layout block
 */
registerBlockType('maxi-blocks/maxi-cloud', {
	title: __('Maxi Cloud Library'),
	description: __('Add a pre-made block or template.'),
	icon: library,
	category: 'maxi-blocks',
	keywords: [__('layout', 'maxi-blocks'), __('block', 'maxi-blocks')],
	attributes: {
		className: {
			type: 'string',
			default: 'maxi-block maxi-block-library',
		},
		content: {
			type: 'string',
			default: '',
		},
	},
	/* Save the block markup. */
	edit,
	save: () => null,
});

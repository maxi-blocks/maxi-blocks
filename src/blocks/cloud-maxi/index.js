/**
 * BLOCK: GE Library
 * A block to import other blocks or layotus directly from the online library
 */

/**
 * Import dependencies.
 */
import edit from './edit';
import { library, librarySmall } from '@maxi-icons';
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
	apiVersion: 3,
	title: __('Cloud library Maxi', 'maxi-blocks'),
	description: __('Find templates or patterns', 'maxi-blocks'),
	icon: librarySmall,
	category: 'maxi-blocks',
	example: {
		attributes: {
			preview: true,
			openFirstTime: false,
		},
	},
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
		openFirstTime: {
			type: 'boolean',
			default: true,
		},
		preview: {
			type: 'boolean',
			default: false,
		},
	},
	editorScript: 'maxi-blocks-block-editor',
	/* Save the block markup. */
	edit,
	save: () => null,
});

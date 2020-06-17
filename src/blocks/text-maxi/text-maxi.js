/**
 * BLOCK: maxi-blocks/text-maxi
 *
 * Registering an text block with Gutenberg.
 * Shows an text and a description. A test block.
 */

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

/**
 * Block dependencies
 */
import attributes from './attributes.js';
import edit from './edit.js';
import save from './save.js';

/**
 * Icons
 */
import { imageBox } from '../../icons';

/**
 * Block
 */
registerBlockType( 'maxi-blocks/text-maxi', {
	title: __('Text Maxi', 'maxi-blocks'),
	icon: imageBox,
	description: 'Insert, modify or style text',
	category: 'maxi-blocks',
	supports: {
		align: true,
		lightBlockWrapper: true
    },
	attributes: {
		...attributes
	},
	getEditWrapperProps(attributes) {
        const {
			uniqueID,
			defaultBlockStyle,
			fullWidth
        } = attributes;

        return {
			'uniqueid': uniqueID,
			'data-gx_initial_block_class': defaultBlockStyle,
			'data-align': fullWidth

        };
    },
	edit,
	save
} );
/**
 * BLOCK: maxi-blocks/block-image-box
 *
 * Registering an image block with Gutenberg.
 * Shows an image and a description. A test block.
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
 * Styles and icons
 */
import './style.scss';
import { imageBox } from '../../icons';

/**
 * Block
 */
registerBlockType( 'maxi-blocks/button-maxi', {
	title: __('Button Maxi', 'maxi-blocks'),
	icon: imageBox,
	description: "Insert, modify or style a button",
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
			uniqueID
        } = attributes;

        return {
			'uniqueid': uniqueID
        };
    },
	edit,
	save
} );
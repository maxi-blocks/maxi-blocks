/**
 * BLOCK: gutenberg-extra/block-text-extra
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
 * Styles and icons
 */
import './style.scss';
import './editor.scss';
import { imageBox } from '../../icons';

/**
 * Block
 */
registerBlockType( 'gutenberg-extra/block-text-extra', {
	title: __('Text Block Extra', 'gutenberg-extra'),
	icon: imageBox,
	description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque sunt hic obcaecati alias rerum fugit, dolore, quis placeat aliquid at natus fugiat, repellendus facilis asperiores illum voluptatum aut officiis delectus?",
	category: 'gutenberg-extra-blocks',
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
/**
 * BLOCK: gutenberg-extra/block-image-box
 *
 * Registering an image block with Gutenberg.
 * Shows an image and a description. A test block.
 */

/**
 * Styles and icons
 */

import './style.scss';
import './editor.scss';
import { imageBox } from '../../icons';
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
 * Block
 */

registerBlockType( 'gutenberg-extra/block-button-extra', {
	title: __('Button Block Extra', 'gutenberg-extra'),
	icon: imageBox,
	description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque sunt hic obcaecati alias rerum fugit, dolore, quis placeat aliquid at natus fugiat, repellendus facilis asperiores illum voluptatum aut officiis delectus?",
	category: 'gutenberg-extra-blocks',
	supports: {
        align: true,
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
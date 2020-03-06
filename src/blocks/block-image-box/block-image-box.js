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
import iconsBlocks from '../../components/icons/icons-blocks.js';
/**
 * WordPress dependencies
 */

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

/**
 * Block dependencies
 */

import attributes from './attributes';
import edit from './edit';
import save from './save';

/**
 * Block
 */

registerBlockType( 'gutenberg-extra/block-image-box', {
	title: __('Image Box Extra', 'gutenberg-extra'),
	icon: iconsBlocks.imageBox,
	description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque sunt hic obcaecati alias rerum fugit, dolore, quis placeat aliquid at natus fugiat, repellendus facilis asperiores illum voluptatum aut officiis delectus?",
	category: 'gutenberg-extra-blocks',
	supports: {
        align: true,
    },
	attributes: {
		...attributes
	},
	edit,
	save
} );
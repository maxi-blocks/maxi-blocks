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
import icon from './icon';

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
// import save from './save';

/**
 * Block
 */


registerBlockType( 'gutenberg-extra/block-title-extra', {
	title: __('GX Title Extra', 'gutenberg-extra'),
	icon: icon,
	category: 'gutenberg-extra-blocks',
	supports: {
        align: true,
    },
	attributes: {
		...attributes,
	},
	edit,
	// save
} );

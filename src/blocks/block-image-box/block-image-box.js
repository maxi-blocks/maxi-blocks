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

import attributes from './attributes';
import edit from './edit';
import save from './save';

/**
 * Block
 */

//let gxPlaceholder = ;

// Declaring placeholder variables because attributes are not async when setting them
let cssResponsive = '';
let textDecorationTitleValue;
let textDecorationTabletValue;
let textDecorationMobileValue;
let textDecorationDesktopValue;
let fontSizeTitleValue;
let fontSizeTitleTabletValue;
let fontSizeTitleMobileValue;
let fontSizeTitleDesktopValue;
let lineHeightDesktopValue;
let lineHeightTitleValue;
let lineHeightTabletValue;
let lineHeightMobileValue;
let letterSpacingTitleValue;
let letterSpacingDesktopValue;
let letterSpacingTabletValue;
let letterSpacingMobileValue;
let fontWeightTitleValue;
let fontWeightTabletValue;
let fontWeightMobileValue;
let fontWeightDesktopValue;
let textTransformTitleValue;
let textTransformDesktopValue;
let textTransformTabletValue;
let textTransformMobileValue;
let fontStyleTitleValue;
let fontStyleDesktopValue;
let fontStyleTabletValue;
let fontStyleMobileValue;
const Divider = () => (
    <hr style={{marginBottom: '15px',}} />
);


registerBlockType( 'gutenberg-extra/block-image-box', {
	title: __('Image Box Extra', 'gutenberg-extra'),
	icon: imageBox,
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

/**
 * BLOCK: single testimonial
 * Base testimonial block
 */
import './style.scss';
import './editor.scss';
import edit from './edit';
import save from './save';
import attributes from './attributes';
import iconsBlocks from '../../components/icons/icons-blocks.js';
import { registerBlockType } from '@wordpress/blocks';

const { __ } = wp.i18n;

registerBlockType("gutenberg-extra/testimonials-slider-block", {
	title: __("Testimonials Extra", 'gutenberg-extra'),
	icon: iconsBlocks.basicGallery,
	category: "gutenberg-extra-blocks",
	keywords: [__("Testimonials Slider", 'gutenberg-extra'), __("gts", 'gutenberg-extra')],
	attributes: {
		...attributes
	},
	getEditWrapperProps( { blockAlignment } ) {
		if ( 'left' === blockAlignment || 'right' === blockAlignment || 'full' === blockAlignment ) {
			return { 'data-align': blockAlignment };
		}
	},
	edit,
	save
});
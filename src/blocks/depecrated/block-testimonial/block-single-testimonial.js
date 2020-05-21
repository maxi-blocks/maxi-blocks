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

registerBlockType("maxi-blocks/testimonials-slider-block", {
	title: __("Testimonials Extra", 'maxi-blocks'),
	icon: iconsBlocks.basicGallery,
	category: "maxi-blocks",
	keywords: [__("Testimonials Slider", 'maxi-blocks'), __("gts", 'maxi-blocks')],
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
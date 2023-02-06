/**
 * BLOCK: maxi-blocks/slide-maxi
 *
 * Slides for Slider Maxi
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

/**
 * Styles and icons
 */
import './style.scss';
import './editor.scss';
import { slideIcon } from '../../icons';

/**
 * Block dependencies
 */
import attributes from './attributes';
import edit from './edit';
import save from './save';

/**
 * Block
 */
registerBlockType('maxi-blocks/slide-maxi', {
	title: __('Slide Maxi', 'maxi-blocks'),
	icon: slideIcon,
	description: 'Stack one or more blocks, top-to-bottom (vertical)',
	category: 'maxi-blocks',
	supports: {
		align: true,
		lightBlockWrapper: true,
	},
	attributes: {
		...attributes,
	},
	parent: ['maxi-blocks/slider-maxi'],
	getEditWrapperProps(attributes) {
		const { uniqueID } = attributes;

		return {
			uniqueid: uniqueID,
		};
	},
	edit,
	save,
});

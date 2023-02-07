/**
 * BLOCK: maxi-blocks/slider-maxi
 *
 * Container for slider
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
import { sliderIcon } from '../../icons';

/**
 * Block dependencies
 */
import attributes from './attributes';
import edit from './edit';
import save from './save';

/**
 * Block
 */
registerBlockType('maxi-blocks/slider-maxi', {
	title: __('Slider Maxi', 'maxi-blocks'),
	icon: sliderIcon,
	description:
		'Position one or more blocks, arranged side-by-side (horizontal)',
	category: 'maxi-blocks',
	supports: {
		align: true,
		lightBlockWrapper: true,
	},
	attributes: {
		...attributes,
	},
	getEditWrapperProps(attributes) {
		const { uniqueID } = attributes;

		return {
			uniqueid: uniqueID,
		};
	},
	edit,
	save,
});

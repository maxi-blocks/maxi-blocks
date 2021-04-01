/**
 * BLOCK: maxi-blocks/divider-maxi
 *
 * Registering an divider block with Gutenberg.
 * Shows an divider and a description. A test block.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
const { registerBlockType } = wp.blocks;

/**
 * Block dependencies
 */
import attributes from './attributes';
import edit from './edit';
import save from './save';

/**
 * Styles and icons
 */
import './style.scss';
import './editor.scss';
import { fontIcon } from '../../icons';

/**
 * Block
 */
registerBlockType('maxi-blocks/font-icon-maxi', {
	title: __('Font Icon Maxi', 'maxi-blocks'),
	icon: fontIcon,
	description: 'Insert, modify or style a font icon',
	category: 'maxi-blocks',
	supports: {
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

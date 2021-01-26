/**
 * BLOCK: maxi-blocks/text-maxi
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
import attributes from './attributes';
import edit from './edit';
import save from './save';

/**
 * Styles and icons
 */
import './style.scss';
import { textIcon } from '../../icons';

/**
 * Block
 */
registerBlockType('maxi-blocks/text-maxi', {
	title: __('Text Maxi', 'maxi-blocks'),
	icon: textIcon,
	description: 'Insert, modify or style text',
	category: 'maxi-blocks',
	supports: {
		align: false,
		lightBlockWrapper: true,
	},
	attributes: {
		...attributes,
	},
	getEditWrapperProps(attributes) {
		const { uniqueID, defaultBlockStyle } = attributes;

		return {
			uniqueid: uniqueID,
			'data-maxi_initial_block_class': defaultBlockStyle,
		};
	},
	edit,
	save,
});

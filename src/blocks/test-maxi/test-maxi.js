/**
 * BLOCK: maxi-blocks/test-maxi
 *
 * Registering an test block with Gutenberg.
 * Shows an test and a description. A test block.
 */

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
 * Styles and icons
 */
import './style.scss';
import { textIcon } from '../../icons';

/**
 * Block
 */
registerBlockType( 'maxi-blocks/test-maxi', {
	title: __('Test Maxi', 'maxi-blocks'),
	icon: textIcon,
	description: 'Insert, modify or style test',
	category: 'maxi-blocks',
	supports: {
		align: false,
		lightBlockWrapper: true
	},
	attributes: {
		...attributes
	},
	getEditWrapperProps(attributes) {
        const {
			uniqueID,
			defaultBlockStyle,
        } = attributes;

        return {
			'uniqueid': uniqueID,
			'data-maxi_initial_block_class': defaultBlockStyle,
        };
    },
	edit,
	save
} );
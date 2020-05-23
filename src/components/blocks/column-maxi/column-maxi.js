/**
 * BLOCK: maxi-blocks/column-maxi
 *
 * Columns for Row block in order to create webpage structures
 */

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

/**
 * Styles and icons
 */
import './editor.scss';
import { imageBox } from '../../icons';

/**
 * Block dependencies
 */
import attributes from './attributes';
import edit from './edit';
import save from './save';

/**
 * Block
 */

registerBlockType( 'maxi-blocks/column-maxi', {
	title: __('Column Maxi', 'maxi-blocks'),
	icon: imageBox,
	description: "Stack one or more blocks, top-to-bottom (vertical)",
	category: 'maxi-blocks',
	supports: {
		align: true,
		lightBlockWrapper: true
    },
	attributes: {
		...attributes
	},
	parent: ['maxi-blocks/row-maxi'],
	getEditWrapperProps(attributes) {
        const {
			uniqueID
		} = attributes;
        return {
			'uniqueid': uniqueID,
        };
    },
	edit,
	save
} );

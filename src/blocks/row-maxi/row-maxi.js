/**
 * BLOCK: maxi-blocks/row-maxi
 *
 * Container for columns in order to create webpage structures
 */

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

/**
 * Styles and icons
 */
import './style.scss';
import './editor.scss';
import { rowIcon } from '../../icons';

/**
 * Block dependencies
 */
import attributes from './attributes';
import edit from './edit';
import save from './save';

/**
 * Block
 */

registerBlockType( 'maxi-blocks/row-maxi', {
	title: __('Row Maxi', 'maxi-blocks'),
	icon: rowIcon,
	description: "Position one or more blocks, arranged side-by-side (horizontal)",
	category: 'maxi-blocks',
	supports: {
		align: true,
		lightBlockWrapper: true
    },
	attributes: {
		...attributes
	},
	getEditWrapperProps(attributes) {
        const {
			uniqueID
        } = attributes;

        return {
			'uniqueid': uniqueID
        };
    },
	edit,
	save
} );

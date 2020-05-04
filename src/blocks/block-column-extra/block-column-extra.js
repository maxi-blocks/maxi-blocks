/**
 * BLOCK: gutenberg-extra/block-column-extra
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

registerBlockType( 'gutenberg-extra/block-column-extra', {
	title: __('Column Extra', 'gutenberg-extra'),
	icon: imageBox,
	description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque sunt hic obcaecati alias rerum fugit, dolore, quis placeat aliquid at natus fugiat, repellendus facilis asperiores illum voluptatum aut officiis delectus?",
	category: 'gutenberg-extra-blocks',
	supports: {
		align: true,
		lightBlockWrapper: true
    },
	attributes: {
		...attributes
	},
	parent: ['gutenberg-extra/block-row-extra'],
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

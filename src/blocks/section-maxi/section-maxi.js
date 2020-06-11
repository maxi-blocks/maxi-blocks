/**
 * BLOCK: maxi-blocks/section-maxi
 *
 * Container for columns in order to create webpage structures
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
import './editor.scss';
import { imageBox } from '../../icons';

/**
 * Block
 */

registerBlockType('maxi-blocks/section-maxi', {
	title: __('Section Maxi', 'maxi-blocks'),
	icon: imageBox,
	description: "Group of blocks composed with a similar style or layout",
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
});

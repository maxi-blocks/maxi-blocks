/**
 * BLOCK: maxi-blocks/shape-maxi
 *
 * Registering an shape block with Gutenberg.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

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
import { shapeIcon } from '../../icons';

/**
 * Block
 */
registerBlockType('maxi-blocks/shape-maxi', {
	title: __('Shape Maxi', 'maxi-blocks'),
	icon: shapeIcon,
	description: __('Insert, modify or style Shapes', 'maxi-blocks'),
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

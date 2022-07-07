/**
 * BLOCK: maxi-blocks/search-maxi
 *
 * Add a search bar with icon
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
import { searchIcon } from '../../icons';

/**
 * Block
 */

registerBlockType('maxi-blocks/search-maxi', {
	title: __('Search Maxi', 'maxi-blocks'),
	icon: searchIcon,
	description: 'Add a search bar with icon',
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

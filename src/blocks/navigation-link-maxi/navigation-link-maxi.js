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
import { containerIcon } from '../../icons';

/**
 * Block
 */

registerBlockType('maxi-blocks/navigation-link-maxi', {
	title: __('Navigation Link Maxi', 'maxi-blocks'),
	icon: containerIcon,
	description: 'Link in menu',
	category: 'maxi-blocks',
	parent: ['maxi-blocks/navigation-menu-maxi'],
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

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

registerBlockType('maxi-blocks/navigation-submenu-maxi', {
	title: __('Submenu Maxi', 'maxi-blocks'),
	icon: containerIcon,
	description: 'Submenu',
	category: 'maxi-blocks',
	parent: [
		'maxi-blocks/navigation-menu-maxi',
		'maxi-blocks/navigation-submenu-maxi',
	],
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

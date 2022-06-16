/**
 * BLOCK: maxi-blocks/group-maxi
 *
 * Combine a set of blocks in a group
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
import { groupIcon } from '../../icons';
import positionMigrator from '../../extensions/styles/migrators/positionMigrator';
import fromFullWidthNonToResponsive from '../../extensions/styles/migrators/fullWidthNonToResponsive';

/**
 * Block
 */

registerBlockType('maxi-blocks/group-maxi', {
	title: __('Group Maxi', 'maxi-blocks'),
	icon: groupIcon,
	description: 'Combine a set of blocks in a group',
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
	deprecated: [
		positionMigrator({ attributes, save }),
		fromFullWidthNonToResponsive({ attributes, save }),
	],
});

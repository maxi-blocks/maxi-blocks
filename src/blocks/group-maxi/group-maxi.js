/**
 * BLOCK: maxi-blocks/group-maxi
 *
 * Group of blocks composed with a similar style or layout
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
import fromNumberToStringMigrator from '../../extensions/styles/migrators/numberToString';

/**
 * Block
 */

registerBlockType('maxi-blocks/group-maxi', {
	title: __('Group Maxi', 'maxi-blocks'),
	icon: groupIcon,
	description: 'Group of blocks composed with a similar style or layout',
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
	deprecated: [fromNumberToStringMigrator({ attributes, save })],
});

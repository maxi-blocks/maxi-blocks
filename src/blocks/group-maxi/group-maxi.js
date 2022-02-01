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

/**
 * Block
 */

const blockContent = {
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
};

registerBlockType('maxi-blocks/group-maxi', blockContent);

export default blockContent;

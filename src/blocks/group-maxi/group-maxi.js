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
import edit from './edit';
import attributes from './attributes';
import save from './save';
import { customCss } from './data';
import withMaxiLoader from '../../extensions/maxi-block/withMaxiLoader';

/**
 * Styles and icons
 */
import './style.scss';
import './editor.scss';
import { groupIcon } from '../../icons';

/**
 * Migrators
 */
import { blockMigrator } from '../../extensions/maxi-block/migrators';
import { getAttributesValue } from '../../extensions/attributes';

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
	attributes,
	getEditWrapperProps(attributes) {
		const uniqueID = getAttributesValue({
			target: '_uid',
			props: attributes,
		});

		return {
			uniqueid: uniqueID,
		};
	},
	edit: withMaxiLoader(edit),
	save,
	deprecated: blockMigrator({
		attributes,
		save,
		selectors: customCss.selectors,
	}),
});

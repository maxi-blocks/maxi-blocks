/**
 * BLOCK: maxi-blocks/column-maxi
 *
 * Columns for Row block in order to create webpage structures
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

/**
 * Styles and icons
 */
import './style.scss';
import './editor.scss';
import { columnIcon } from '../../icons';

/**
 * Block dependencies
 */
import attributes from './attributes';
import edit from './edit';
import save from './save';

/**
 * External dependencies
 */
import fromNumberToStringMigrator from '../../extensions/styles/migrators/numberToString';

/**
 * Block
 */

registerBlockType('maxi-blocks/column-maxi', {
	title: __('Column Maxi', 'maxi-blocks'),
	icon: columnIcon,
	description: 'Stack one or more blocks, top-to-bottom (vertical)',
	category: 'maxi-blocks',
	supports: {
		align: true,
		lightBlockWrapper: true,
	},
	attributes: {
		...attributes,
	},
	parent: ['maxi-blocks/row-maxi'],
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

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
 * Migrators
 */
import v1 from '../../extensions/styles/migrators/v1';

/**
 * Block
 */

registerBlockType('maxi-blocks/column-maxi', {
	title: __('Column Maxi', 'maxi-blocks'),
	icon: columnIcon,
	description: 'Stack blocks vertically inside a column',
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
	deprecated: [v1({ attributes, save })],
});

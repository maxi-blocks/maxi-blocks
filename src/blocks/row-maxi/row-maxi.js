/**
 * BLOCK: maxi-blocks/row-maxi
 *
 * Container for columns in order to create webpage structures
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
import { rowIcon } from '../../icons';

/**
 * Block dependencies
 */
import attributes from './attributes';
import edit from './edit';
import save from './save';
import { selectorsRow } from './custom-css';

/**
 * Migrators
 */
import { blockMigrator } from '../../extensions/styles/migrators';

/**
 * Block
 */

registerBlockType('maxi-blocks/row-maxi', {
	title: __('Row Maxi', 'maxi-blocks'),
	icon: rowIcon,
	description: 'Configure columns inside a row',
	category: 'maxi-blocks',
	parent: ['maxi-blocks/container-maxi'],
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
	deprecated: blockMigrator({ attributes, save, selectors: selectorsRow }),
});

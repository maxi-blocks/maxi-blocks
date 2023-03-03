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
import { lazy } from '@wordpress/element';

/**
 * Styles and icons
 */
import './style.scss';
import './editor.scss';
import { columnIcon } from '../../icons';

/**
 * Block dependencies
 */
const Edit = lazy(() => import('./edit'));
import attributes from './attributes';
import save from './save';
import { customCss } from './data';
import withMaxiSuspense from '../../extensions/maxi-block/withMaxiSuspense';

/**
 * Migrators
 */
import { blockMigrator } from '../../extensions/styles/migrators';

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
	edit: withMaxiSuspense(Edit),
	save,
	deprecated: blockMigrator({
		attributes,
		save,
		selectors: customCss.selectors,
	}),
});

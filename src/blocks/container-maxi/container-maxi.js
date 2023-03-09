/**
 * BLOCK: maxi-blocks/container-maxi
 *
 * Container for columns in order to create webpage structures
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { lazy } from '@wordpress/element';

/**
 * Block dependencies
 */
const Edit = lazy(() => import('./edit'));
import attributes from './attributes';
import save from './save';
import { customCss } from './data';
import withMaxiSuspense from '../../extensions/maxi-block/withMaxiSuspense';

/**
 * Styles and icons
 */
import './style.scss';
import './editor.scss';
import { containerIcon } from '../../icons';

/**
 * Migrators
 */
import { blockMigrator } from '../../extensions/styles/migrators';
import shapeDividerMigrator from '../../extensions/styles/migrators/shapeDividerMigrator';

/**
 * Block
 */

registerBlockType('maxi-blocks/container-maxi', {
	title: __('Container Maxi', 'maxi-blocks'),
	icon: containerIcon,
	description: 'Wrap blocks within a container',
	category: 'maxi-blocks',
	example: {
		attributes: {
			preview: true,
		},
	},
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
	edit: withMaxiSuspense(Edit),
	save,
	deprecated: blockMigrator({
		attributes,
		save,
		isContainer: true,
		selectors: customCss.selectors,
		migrators: [shapeDividerMigrator],
	}),
});

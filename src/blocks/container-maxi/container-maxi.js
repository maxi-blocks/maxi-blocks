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

/**
 * Block dependencies
 */
import attributes from './attributes';
import edit from './edit';
import save from './save';
import { customCss } from './data';

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
	deprecated: blockMigrator({
		attributes,
		save,
		isContainer: true,
		selectors: customCss.selectors,
		migrators: [shapeDividerMigrator],
	}),
});

/**
 * BLOCK: maxi-blocks/map-maxi
 *
 * Create a map with marker and description
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
import withMaxiSuspense from '../../extensions/maxi-block/withMaxiSuspense';
import { customCss } from './data';

/**
 * Styles and icons
 */
import './style.scss';
import './editor.scss';
import { mapIcon } from '../../icons';

/**
 * Migrators
 */
import { blockMigrator } from '../../extensions/styles/migrators';

/**
 * Block
 */

registerBlockType('maxi-blocks/map-maxi', {
	title: __('Map Maxi', 'maxi-blocks'),
	icon: mapIcon,
	description: __('Create a map with marker and description', 'maxi-blocks'),
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
	edit: withMaxiSuspense(edit),
	save,
	deprecated: blockMigrator({
		attributes,
		save,
		selectors: customCss.selectors,
	}),
});

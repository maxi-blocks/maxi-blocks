/**
 * BLOCK: maxi-blocks/group-maxi
 *
 * Insert a map with marker
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
import { mapIcon } from '../../icons';

/**
 * Migrators
 */
import v1 from '../../extensions/styles/migrators/v1';

/**
 * Block
 */

registerBlockType('maxi-blocks/map-maxi', {
	title: __('Map Maxi', 'maxi-blocks'),
	icon: mapIcon,
	description: __('Insert a map with marker', 'maxi-blocks'),
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
	deprecated: [v1({ attributes, save })],
});

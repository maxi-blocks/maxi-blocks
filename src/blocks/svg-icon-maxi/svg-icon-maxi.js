/**
 * BLOCK: maxi-blocks/image-maxi
 *
 * Registering an image block with Gutenberg.
 * Shows an image and a description. A test block.
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
import { selectorsSvgIcon } from './custom-css';

/**
 * Styles and icons
 */
import './style.scss';
import './editor.scss';
import { iconBox } from '../../icons';

/**
 * Migrators
 */
import { blockMigrator } from '../../extensions/styles/migrators';

/**
 * Block
 */
registerBlockType('maxi-blocks/svg-icon-maxi', {
	title: __('Icon Maxi', 'maxi-blocks'),
	icon: iconBox,
	description: 'Add icon or shape and style it',
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
		selectors: selectorsSvgIcon,
	}),
});

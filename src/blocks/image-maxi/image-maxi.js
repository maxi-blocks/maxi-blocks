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
import { imageBox } from '../../icons';

/**
 * Migrators
 */
import { blockMigrator } from '../../extensions/maxi-block/migrators';
import { getAttributesValue } from '../../extensions/attributes';

/**
 * Block
 */
registerBlockType('maxi-blocks/image-maxi', {
	title: __('Image Maxi', 'maxi-blocks'),
	icon: imageBox,
	description: 'Insert, modify or style an image',
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
		prefix: 'im-',
		selectors: customCss.selectors,
	}),
});

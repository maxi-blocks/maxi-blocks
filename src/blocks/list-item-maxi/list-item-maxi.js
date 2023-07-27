/**
 * BLOCK: maxi-blocks/text-maxi
 *
 * Registering an text block with Gutenberg.
 * Shows an text and a description. A test block.
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
import withMaxiLoader from '../../extensions/maxi-block/withMaxiLoader';
import withMaxiPreview from '../../extensions/maxi-block/withMaxiPreview';

/**
 * Styles and icons
 */
import './editor.scss';
import './style.scss';
import { textIcon } from '../../icons';

/**
 * Block
 */
registerBlockType('maxi-blocks/list-item-maxi', {
	title: __('List Item Maxi', 'maxi-blocks'),
	icon: textIcon,
	description: 'Insert, modify or style text',
	category: 'maxi-blocks',
	example: {
		attributes: {
			preview: true,
		},
	},
	supports: {
		align: false,
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
	edit: withMaxiPreview(withMaxiLoader(edit)),
	save,
});

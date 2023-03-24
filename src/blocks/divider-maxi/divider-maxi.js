/**
 * BLOCK: maxi-blocks/divider-maxi
 *
 * Registering an divider block with Gutenberg.
 * Shows an divider and a description. A test block.
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
import { dividerIcon } from '../../icons';

/**
 * Migrators
 */
import { blockMigrator } from '../../extensions/maxi-block/migrators';
import { getAttributesValue } from '../../extensions/attributes';

/**
 * Block
 */
registerBlockType('maxi-blocks/divider-maxi', {
	title: __('Divider Maxi', 'maxi-blocks'),
	icon: dividerIcon,
	description: 'Create a divider between visual elements',
	category: 'maxi-blocks',
	supports: {
		align: true,
		lightBlockWrapper: true,
	},
	attributes,
	getEditWrapperProps(attributes) {
		const uniqueID = getAttributesValue({
			target: 'uniqueID',
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
		selectors: customCss.selectors,
	}),
});

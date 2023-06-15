/**
 * BLOCK: maxi-blocks/group-maxi
 *
 * Create a number counter
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
import withMaxiPreview from '../../extensions/maxi-block/withMaxiPreview';

/**
 * Styles and icons
 */
import './style.scss';
import { numberCounterIcon } from '../../icons';

/**
 * Migrators
 */
import { blockMigrator } from '../../extensions/styles/migrators';
import NCMigrator from '../../extensions/styles/migrators/NCMigrator';

/**
 * Block
 */

registerBlockType('maxi-blocks/number-counter-maxi', {
	title: __('Number Counter Maxi', 'maxi-blocks'),
	icon: numberCounterIcon,
	description: __('Create a number counter', 'maxi-blocks'),
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
	edit: withMaxiPreview(withMaxiLoader(edit)),
	save,
	deprecated: blockMigrator({
		attributes,
		save,
		selectors: customCss.selectors,
		migrators: [NCMigrator],
	}),
});

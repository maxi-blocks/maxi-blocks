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
import attributes from './attributes';
import edit from './edit';
import save from './save';
import { selectorsNumberCounter } from './custom-css';

/**
 * Styles and icons
 */
import './style.scss';
import { numberCounterIcon } from '../../icons';

/**
 * Migrators
 */
import { blockMigrator } from '../../extensions/styles/migrators';

/**
 * Block
 */

registerBlockType('maxi-blocks/number-counter-maxi', {
	title: __('Number Counter Maxi', 'maxi-blocks'),
	icon: numberCounterIcon,
	description: __('Create a number counter', 'maxi-blocks'),
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
		selectors: selectorsNumberCounter,
	}),
});

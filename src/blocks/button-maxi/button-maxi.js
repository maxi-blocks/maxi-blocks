/**
 * BLOCK: maxi-blocks/button-maxi
 *
 * Registering a button block with Gutenberg.
 * Shows a button. A test block.
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
import { buttonIcon } from '../../icons';

/**
 * Migrators
 */
import {
	blockMigrator,
	buttonIconTransitionMigrator,
} from '../../extensions/styles/migrators';

/**
 * Block
 */
registerBlockType('maxi-blocks/button-maxi', {
	title: __('Button Maxi', 'maxi-blocks'),
	icon: buttonIcon,
	description: 'Insert, modify or style a button',
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
		prefix: 'button-',
		selectors: customCss.selectors,
		migrators: [buttonIconTransitionMigrator],
	}),
});

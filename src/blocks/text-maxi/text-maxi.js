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
import attributes from './attributes';
import edit from './edit';
import save from './save';
import transforms from './transforms';
import { customCss } from './data';

/**
 * Styles and icons
 */
import './editor.scss';
import './style.scss';
import { textIcon } from '../../icons';

/**
 * Migrators
 */
import { blockMigrator } from '../../extensions/styles/migrators';

const { serverSideRender: ServerSideRender } = wp;

/**
 * Block
 */
registerBlockType('maxi-blocks/text-maxi', {
	title: __('Text Maxi', 'maxi-blocks'),
	icon: textIcon,
	description: 'Insert, modify or style text',
	category: 'maxi-blocks',
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
	edit: props => {
		return (
			<>
				<p>serverSideRender should appear here:</p>
				<ServerSideRender block='dynamic-content-maxi' />
			</>
		);
	},
	save,
	transforms,
	deprecated: blockMigrator({
		attributes,
		save,
		selectors: customCss.selectors,
	}),
});

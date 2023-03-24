/**
 * BLOCK: maxi-blocks/container-maxi
 *
 * Container for columns in order to create webpage structures
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
import { containerIcon } from '../../icons';

/**
 * Migrators
 */
import { blockMigrator } from '../../extensions/maxi-block/migrators';
import shapeDividerMigrator from '../../extensions/maxi-block/migrators/shapeDividerMigrator';
import { getAttributesValue } from '../../extensions/attributes';

/**
 * Block
 */

registerBlockType('maxi-blocks/container-maxi', {
	title: __('Container Maxi', 'maxi-blocks'),
	icon: containerIcon,
	description: 'Wrap blocks within a container',
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
		isContainer: true,
		selectors: customCss.selectors,
		migrators: [shapeDividerMigrator],
	}),
});

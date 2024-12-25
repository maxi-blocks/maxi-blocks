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
import metadata from './block.json';
import edit from './edit';
import attributes from './attributes';
import save from './save';
import { customCss } from './data';
import withMaxiLoader from '@extensions/maxi-block/withMaxiLoader';
import withMaxiPreview from '@extensions/maxi-block/withMaxiPreview';

/**
 * Styles and icons
 */
import './style.scss';
import './editor.scss';
import { iconBox } from '@maxi-icons';

/**
 * Migrators
 */
import {
	blockMigrator,
	SVGTransitionMigrator,
} from '@extensions/styles/migrators';

/**
 * Block
 */
const { title, description, category, example, parent } = metadata;

registerBlockType(metadata, {
	title: __(title, 'maxi-blocks'),
	icon: iconBox,
	description: __(description, 'maxi-blocks'),
	category,
	example,
	parent,
	attributes,
	edit: withMaxiPreview(withMaxiLoader(edit)),
	save,
	deprecated: blockMigrator({
		attributes,
		save,
		selectors: customCss.selectors,
		migrators: [SVGTransitionMigrator],
	}),
	customCss,
});

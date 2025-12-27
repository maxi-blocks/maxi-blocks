/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

/**
 * Styles and icons
 */
import metadata from './block.json';
import './style.scss';
import './editor.scss';
import { columnIcon } from '@maxi-icons';

/**
 * Block dependencies
 */
import edit from './edit';
import attributes from './attributes';
import save from './save';
import { customCss } from './data';
import withMaxiLoader from '@extensions/maxi-block/withMaxiLoader';
import withMaxiPreview from '@extensions/maxi-block/withMaxiPreview';

/**
 * Migrators
 */
import { blockMigrator } from '@extensions/styles/migrators';

/**
 * Block
 */
const { title, description, category, example } = metadata;

registerBlockType(metadata, {
	title: __(title, 'maxi-blocks'),
	icon: columnIcon,
	description: __(description, 'maxi-blocks'),
	category,
	example,
	attributes,
	edit: withMaxiPreview(withMaxiLoader(edit)),
	save,
	deprecated: blockMigrator({
		attributes,
		save,
		selectors: customCss.selectors,
	}),
	customCss,
});

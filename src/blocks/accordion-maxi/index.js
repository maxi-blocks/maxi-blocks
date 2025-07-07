/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

/**
 * Block dependencies
 */
import metadata from './block.json';
import { customCss } from './data';
import edit from './edit';
import attributes from './attributes';
import save from './save';
import withMaxiLoader from '@extensions/maxi-block/withMaxiLoader';
import withMaxiPreview from '@extensions/maxi-block/withMaxiPreview';
import blockMigrator from '@extensions/styles/migrators/blockMigrator';

/**
 * Styles and icons
 */
import './style.scss';
import './editor.scss';
import { accordionIcon } from '@maxi-icons';

/**
 * Block
 */
const { title, description, category, example } = metadata;

registerBlockType(metadata, {
	title: __(title, 'maxi-blocks'),
	icon: accordionIcon,
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

/**
 * BLOCK: maxi-blocks/list-item-maxi
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
import metadata from './block.json';
import { lazy } from '@wordpress/element';
const edit = lazy(() => import(/* webpackChunkName: "maxi-list-item" */ './edit'));
import attributes from './attributes';
import save from './save';
import { customCss, scProps } from './data';
import withMaxiLoader from '@extensions/maxi-block/withMaxiLoader';
import withMaxiPreview from '@extensions/maxi-block/withMaxiPreview';

/**
 * Styles and icons
 */
// editor.scss moved to edit.js for code splitting
import './style.scss';
import { textIcon } from '@maxi-icons';

/**
 * Migrators
 */
import {
	blockMigrator,
	listItemDoubleLinkMigrator,
} from '@extensions/styles/migrators';

/**
 * Block
 */
const { title, description, category, example, parent } = metadata;

registerBlockType(metadata, {
	title: __(title, 'maxi-blocks'),
	icon: textIcon,
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
		migrators: [listItemDoubleLinkMigrator],
	}),
	customCss,
	scProps,
});

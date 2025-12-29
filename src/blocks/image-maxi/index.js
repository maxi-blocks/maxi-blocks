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
const edit = lazy(() => import(/* webpackChunkName: "maxi-image" */ './edit'));
import attributes from './attributes';
import save from './save';
import { customCss } from './data';
import withMaxiLoader from '@extensions/maxi-block/withMaxiLoader';
import withMaxiPreview from '@extensions/maxi-block/withMaxiPreview';

/**
 * Styles and icons
 */
import './style.scss';
// editor.scss moved to edit.js for code splitting
import { imageBox } from '@maxi-icons';

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
	icon: imageBox,
	description: __(description, 'maxi-blocks'),
	category,
	example,
	attributes,
	edit: withMaxiPreview(withMaxiLoader(edit)),
	save,
	deprecated: blockMigrator({
		attributes,
		save,
		prefix: 'image-',
		selectors: customCss.selectors,
	}),
	customCss,
});


/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

/**
 * Block dependencies
 */
import { lazy } from '@wordpress/element';
import metadata from './block.json';
import { customCss } from './data';
const edit = lazy(() => import('./edit'));
import attributes from './attributes';
import save from './save';
import withMaxiLoader from '@extensions/maxi-block/withMaxiLoader';
import withMaxiPreview from '@extensions/maxi-block/withMaxiPreview';

/**
 * Styles and icons
 */
import './style.scss';
import './editor.scss';
import { sliderIcon } from '@maxi-icons';

/**
 * Block
 */
const { title, description, category, example, parent } = metadata;

registerBlockType(metadata, {
	title: __(title, 'maxi-blocks'),
	icon: sliderIcon,
	description: __(description, 'maxi-blocks'),
	category,
	example,
	parent,
	attributes,
	edit: withMaxiPreview(withMaxiLoader(edit)),
	save,
	customCss,
});

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
import { lazy } from '@wordpress/element';
import metadata from './block.json';
const edit = lazy(() =>
	import(/* webpackChunkName: "maxi-number-counter" */ './edit')
);
import attributes from './attributes';
import save from './save';
import { customCss } from './data';
import withMaxiLoader from '@extensions/maxi-block/withMaxiLoader';
import withMaxiPreview from '@extensions/maxi-block/withMaxiPreview';

/**
 * Styles and icons
 */
import './style.scss';
import { numberCounterIcon } from '@maxi-icons';

/**
 * Migrators
 */
import { blockMigrator } from '@extensions/styles/migrators';
import NCMigrator from '@extensions/styles/migrators/NCMigrator';

/**
 * Block
 */
const { title, description, category, example } = metadata;

registerBlockType(metadata, {
	title: __(title, 'maxi-blocks'),
	icon: numberCounterIcon,
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
		migrators: [NCMigrator],
	}),
	customCss,
});

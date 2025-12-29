/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

/**
 * Block dependencies
 */
import metadata from './block.json';
// import edit from './edit';
import { lazy } from '@wordpress/element';
const edit = lazy(() => import(/* webpackChunkName: "maxi-button" */ './edit'));
import attributes from './attributes';
import save from './save';
import { customCss, scProps } from './data';
import withMaxiLoader from '@extensions/maxi-block/withMaxiLoader';
import withMaxiPreview from '@extensions/maxi-block/withMaxiPreview';

/**
 * Styles and icons
 */
import './style.scss';
// import './editor.scss';
import { buttonIcon } from '@maxi-icons';

/**
 * Migrators
 */
import {
	blockMigrator,
	buttonIconTransitionMigrator,
	buttonAriaLabelMigrator,
	buttonEmailObfuscatedMigrator,
} from '@extensions/styles/migrators';

/**
 * Block
 */
const { title, description, category, example } = metadata;

registerBlockType(metadata, {
	title: __(title, 'maxi-blocks'),
	icon: buttonIcon,
	description: __(description, 'maxi-blocks'),
	category,
	example,
	attributes,
	edit: withMaxiPreview(withMaxiLoader(edit)),
	save,
	deprecated: blockMigrator({
		attributes,
		save,
		prefix: 'button-',
		selectors: customCss.selectors,
		migrators: [
			buttonIconTransitionMigrator,
			buttonAriaLabelMigrator,
			buttonEmailObfuscatedMigrator,
		],
	}),
	customCss,
	scProps,
});

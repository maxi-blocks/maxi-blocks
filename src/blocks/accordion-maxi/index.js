/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

/**
 * Block dependencies
 */
import metadata from './block.json';
import { customCss, transition } from './data';
import edit from './edit';
import attributes from './attributes';
import save from './save';
import withMaxiLoader from '../../extensions/maxi-block/withMaxiLoader';
import withMaxiPreview from '../../extensions/maxi-block/withMaxiPreview';

/**
 * Styles and icons
 */
import './style.scss';
import { accordionIcon } from '../../icons';

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
	customCss,
	transition,
});

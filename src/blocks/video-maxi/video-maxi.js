/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

/**
 * Block dependencies
 */
import attributes from './attributes';
import edit from './edit';
import save from './save';

/**
 * Styles and icons
 */
import './style.scss';
import { videoIcon } from '../../icons';

/**
 * Block
 */

registerBlockType('maxi-blocks/video-maxi', {
	title: __('Video Maxi', 'maxi-blocks'),
	icon: videoIcon,
	description: 'Insert a video with conrols or lightbox',
	category: 'maxi-blocks',
	supports: {
		align: true,
		lightBlockWrapper: true,
	},
	attributes: {
		...attributes,
	},
	edit,
	save,
});

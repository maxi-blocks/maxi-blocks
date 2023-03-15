/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { lazy } from '@wordpress/element';

/**
 * Block dependencies
 */
const Edit = lazy(() => import('./edit'));
import attributes from './attributes';
import save from './save';
import { customCss } from './data';
import withMaxiSuspense from '../../extensions/maxi-block/withMaxiSuspense';

/**
 * Styles and icons
 */
import './style.scss';
import { videoIcon } from '../../icons';

/**
 * Migrators
 */
import { blockMigrator } from '../../extensions/styles/migrators';

/**
 * Block
 */

registerBlockType('maxi-blocks/video-maxi', {
	title: __('Video Maxi', 'maxi-blocks'),
	icon: videoIcon,
	description: 'Insert a video with controls or lightbox',
	category: 'maxi-blocks',
	supports: {
		align: true,
		lightBlockWrapper: true,
	},
	attributes: {
		...attributes,
	},
	getEditWrapperProps(attributes) {
		const { uniqueID } = attributes;

		return {
			uniqueid: uniqueID,
		};
	},
	edit: withMaxiSuspense(Edit),
	save,
	deprecated: blockMigrator({
		attributes,
		save,
		selectors: customCss.selectors,
	}),
});

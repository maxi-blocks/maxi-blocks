/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

/**
 * Block dependencies
 */
import edit from './edit';
import attributes from './attributes';
import save from './save';
import { customCss } from './data';
import withMaxiLoader from '../../extensions/maxi-block/withMaxiLoader';

/**
 * Styles and icons
 */
import './style.scss';
import { videoIcon } from '../../icons';

/**
 * Migrators
 */
import { blockMigrator } from '../../extensions/maxi-block/migrators';
import { getAttributesValue } from '../../extensions/attributes';

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
	attributes,
	getEditWrapperProps(attributes) {
		const uniqueID = getAttributesValue({
			target: 'uniqueID',
			props: attributes,
		});

		return {
			uniqueid: uniqueID,
		};
	},
	edit: withMaxiLoader(edit),
	save,
	deprecated: blockMigrator({
		attributes,
		save,
		selectors: customCss.selectors,
	}),
});

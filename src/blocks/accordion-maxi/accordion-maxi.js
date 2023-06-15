/**
 * BLOCK: maxi-blocks/accordion-maxi
 */

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

registerBlockType('maxi-blocks/accordion-maxi', {
	title: __('Accordion Maxi', 'maxi-blocks'),
	icon: accordionIcon,
	description: 'Expand or collapse content inside of a panel',
	category: 'maxi-blocks',
	example: {
		attributes: {
			preview: true,
		},
	},
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
	edit: withMaxiPreview(withMaxiLoader(edit)),
	save,
});

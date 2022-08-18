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
import attributes from './attributes';
import edit from './edit';
import save from './save';

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
	edit,
	save,
});

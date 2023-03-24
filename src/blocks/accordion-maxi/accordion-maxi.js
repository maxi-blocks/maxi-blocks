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

/**
 * Styles and icons
 */
import './style.scss';
import { accordionIcon } from '../../icons';
import { getAttributesValue } from '../../extensions/attributes';

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
});

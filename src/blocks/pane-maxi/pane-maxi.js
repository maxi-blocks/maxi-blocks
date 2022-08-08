/**
 * BLOCK: maxi-blocks/pane-maxi
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
import { groupIcon } from '../../icons';

/**
 * Block
 */

registerBlockType('maxi-blocks/pane-maxi', {
	title: __('Pane Maxi', 'maxi-blocks'),
	description: __('Hide some content inside of it', 'maxi-blocks'),
	icon: groupIcon,
	category: 'maxi-blocks',
	supports: {
		align: true,
		lightBlockWrapper: true,
	},
	attributes: {
		...attributes,
	},
	parent: ['maxi-blocks/accordion-maxi'],
	getEditWrapperProps(attributes) {
		const { uniqueID } = attributes;

		return {
			uniqueid: uniqueID,
		};
	},
	edit,
	save,
});

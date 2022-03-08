/**
 * BLOCK: maxi-blocks/column-maxi
 *
 * Columns for Row block in order to create webpage structures
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

/**
 * Styles and icons
 */
import './style.scss';
import './editor.scss';
import { imageBox } from '../../icons';

/**
 * Block dependencies
 */
import attributes from './attributes';
import edit from './edit';
import save from './save';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Block
 */

registerBlockType('maxi-blocks/column-maxi', {
	title: __('Column Maxi', 'maxi-blocks'),
	icon: imageBox,
	description: 'Stack one or more blocks, top-to-bottom (vertical)',
	category: 'maxi-blocks',
	supports: {
		align: true,
		lightBlockWrapper: true,
	},
	attributes: {
		...attributes,
	},
	parent: ['maxi-blocks/row-maxi'],
	getEditWrapperProps(attributes) {
		const { uniqueID } = attributes;
		return {
			uniqueid: uniqueID,
		};
	},
	edit,
	save,
	deprecated: [
		{
			isEligible(attributes) {
				const columnSize = getGroupAttributes(attributes, 'columnSize');

				return Object.values(columnSize).some(
					column => typeof column === 'number'
				);
			},

			attributes: {
				...attributes,
				'column-size-general': {
					type: 'number',
				},
				'column-size-xxl': {
					type: 'number',
				},
				'column-size-xl': {
					type: 'number',
				},
				'column-size-l': {
					type: 'number',
				},
				'column-size-m': {
					type: 'number',
				},
				'column-size-s': {
					type: 'number',
				},
				'column-size-xs': {
					type: 'number',
				},
			},

			migrate(oldAttributes) {
				const columnSize = getGroupAttributes(
					oldAttributes,
					'columnSize'
				);

				Object.entries(columnSize).forEach(([key, val]) => {
					if (typeof val === 'number')
						oldAttributes[key] = val.toString();
				});

				return oldAttributes;
			},

			save(props) {
				return save(props);
			},
		},
	],
});

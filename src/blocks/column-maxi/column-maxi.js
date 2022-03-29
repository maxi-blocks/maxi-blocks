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
 * External dependencies
 */
import { isFinite } from 'lodash';

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
	// Onces updated all posts on maxi-dress, this part can be removed
	deprecated: [
		{
			isEligible(attributes) {
				const columnSize = getGroupAttributes(attributes, 'columnSize');

				return Object.values(columnSize).some(
					column => typeof column === 'string'
				);
			},

			attributes: {
				...attributes,
				'column-size-general': {
					type: 'string',
				},
				'column-size-xxl': {
					type: 'string',
				},
				'column-size-xl': {
					type: 'string',
				},
				'column-size-l': {
					type: 'string',
				},
				'column-size-m': {
					type: 'string',
				},
				'column-size-s': {
					type: 'string',
				},
				'column-size-xs': {
					type: 'string',
				},
			},

			migrate(oldAttributes) {
				const columnSize = getGroupAttributes(
					oldAttributes,
					'columnSize'
				);

				Object.entries(columnSize).forEach(([key, val]) => {
					if (isFinite(parseFloat(val)))
						oldAttributes[key] = parseFloat(val);
				});

				return oldAttributes;
			},

			save(props) {
				return save(props);
			},
		},
	],
});

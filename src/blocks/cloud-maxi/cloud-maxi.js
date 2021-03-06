/**
 * BLOCK: GE Library
 * A block to import other blocks or layotus directly from the online library
 */

/**
 * Import dependencies.
 */
import Edit from './edit';
import MaxiProvider from './provider';
import { library } from '../../icons';
import './style.scss';
import './editor.scss';

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

/**
 * Register the Layout block
 */
registerBlockType('maxi-blocks/maxi-cloud', {
	title: __('Maxi Cloud Library'),
	description: __('Add a pre-made block or template.'),
	icon: library,
	category: 'maxi-blocks',
	keywords: [__('layout', 'maxi-blocks'), __('block', 'maxi-blocks')],
	attributes: {
		className: {
			type: 'string',
			default: 'maxi-block maxi-block-library',
		},
	},

	/* Render the block components. */
	edit: props => {
		return (
			<MaxiProvider>
				<Edit {...props} />
			</MaxiProvider>
		);
	},

	/* Save the block markup. */
	save: () => {
		return null;
	},
});

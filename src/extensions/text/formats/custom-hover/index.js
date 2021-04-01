/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Text-custom format
 */
const name = 'maxi-blocks/text-custom';
const title = __('Text custom', 'maxi-blocks');

const custom = {
	name,
	title,
	tagName: 'span',
	className: 'maxi-text-block--has-custom-format',
	attributes: {
		className: 'class',
	},
};

export default custom;

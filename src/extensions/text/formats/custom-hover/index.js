/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Text-custom-hover format
 */
const name = 'maxi-blocks/text-custom-hover';
const title = __('Text custom hover', 'maxi-blocks');

const customHover = {
	name,
	title,
	tagName: 'span',
	className: 'maxi-text-block--has-custom-hover-format',
	attributes: {
		className: 'class',
	},
};

export default customHover;

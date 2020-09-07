/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Text-color format
 */
const name = 'maxi-blocks/text-size';
const title = __('Text size', 'maxi-blocks');

const color = {
	name,
	title,
	tagName: 'span',
	className: 'maxi-text-block--has-custom-font-size',
	attributes: {
		className: 'class',
	},
};

export default color;

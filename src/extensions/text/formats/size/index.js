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
	className: 'maxi-text-block--has-font-size',
	attributes: {
		style: 'style',
		size: 'number',
	},
};

export default color;

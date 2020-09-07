/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Text-color format
 */
const name = 'maxi-blocks/text-color';
const title = __('Text color', 'maxi-blocks');

const color = {
	name,
	title,
	tagName: 'span',
	className: 'maxi-text-block--has-text-color',
	attributes: {
		color: 'color',
		style: 'style',
	},
};

export default color;

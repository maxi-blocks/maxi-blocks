/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Text-underline format
 */
const name = 'maxi-blocks/text-underline';
const title = __('Text underline', 'maxi-blocks');

const underline = {
	name,
	title,
	tagName: 'span',
	className: 'maxi-text-block--has-text-underline',
	attributes: {
		className: 'class',
	},
};

export default underline;

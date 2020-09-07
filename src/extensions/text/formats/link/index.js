/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Text-link format
 *
 * Not setting '__unstablePasteRule' because is returning an element with 'core/link'
 * format instead of 'maxi-blocks/text-link', even setting 'allowedFormats' without it.
 * We'll cheat a little bit later to transform 'core/link' to 'maxi-blocks/text-link', but...
 * who never cheated a little bit? lumberjack
 *
 */
const name = 'maxi-blocks/text-link';
const title = __('Link', 'maxi-blocks');

const link = {
	name,
	title,
	tagName: 'a',
	className: 'maxi-text-block--link',
	attributes: {
		url: 'href',
		type: 'data-type',
		id: 'data-id',
		target: 'target',
	},
};

export default link;

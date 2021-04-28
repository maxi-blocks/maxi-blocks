/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Text-link format
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
		rel: 'rel',
		title: 'title',
	},
};

export default link;

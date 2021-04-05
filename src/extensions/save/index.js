/**
 * WordPress Dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * General
 */
const allowedBlocks = [
	'maxi-blocks/row-maxi',
	'maxi-blocks/column-maxi',
	'maxi-blocks/text-maxi',
	'maxi-blocks/divider-maxi',
	'maxi-blocks/image-maxi',
	'maxi-blocks/section-maxi',
	'maxi-blocks/container-maxi',
	'maxi-blocks/group-maxi',
	'maxi-blocks/svg-icon-maxi',
	'maxi-blocks/font-icon-maxi',
];

/**
 * Add hyperlink element on Maxi Blocks with toolbar link activated
 *
 * @param {Object} BlockSave Original saved object.
 * @return {string} Wrapped component.
 */

const withSave = (element, blockType, attributes) => {
	const linkSettings = { ...attributes.linkSettings };

	if (
		allowedBlocks.includes(blockType.name) &&
		!!linkSettings &&
		!!linkSettings.url
	) {
		let rel = '';
		if (linkSettings.nofollow) rel += ' nofollow';
		if (linkSettings.sponsored) rel += ' sponsored';
		if (linkSettings.ugc) rel += ' ugc';

		return (
			<a
				className='maxi-link-wrapper'
				href={linkSettings.url}
				target={linkSettings.opensInNewTab ? '_blank' : '_self'}
				rel={rel}
			>
				{element}
			</a>
		);
	}

	return element;
};

addFilter('blocks.getSaveElement', 'maxi-blocks/save', withSave);

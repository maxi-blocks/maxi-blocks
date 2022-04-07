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
	'maxi-blocks/divider-maxi',
	'maxi-blocks/map-maxi',
	'maxi-blocks/image-maxi',
	'maxi-blocks/container-maxi',
	'maxi-blocks/group-maxi',
	'maxi-blocks/number-counter-maxi',
	'maxi-blocks/svg-icon-maxi',
	'maxi-blocks/slider-maxi',
	'maxi-blocks/slide-maxi',
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
			// eslint-disable-next-line react/jsx-no-target-blank
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

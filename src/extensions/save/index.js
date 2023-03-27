/**
 * WordPress Dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { WithLink } from './utils';
import getGroupAttributes from '../styles/getGroupAttributes';

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
	'maxi-blocks/video-maxi',
	'maxi-blocks/accordion-maxi',
	'maxi-blocks/search-maxi',
];

/**
 * Add hyperlink element on Maxi Blocks with toolbar link activated
 *
 * @param {Object} BlockSave Original saved object.
 * @return {string} Wrapped component.
 */

const withSave = (element, blockType, attributes) => {
	const linkSettings = { ...attributes.linkSettings };
	const dynamicContent = getGroupAttributes(attributes, 'dynamicContent');

	if (
		allowedBlocks.includes(blockType.name) ||
		(dynamicContent['dc-status'] &&
			blockType.name === 'maxi-blocks/text-maxi')
	) {
		return (
			<WithLink
				linkSettings={linkSettings}
				dynamicContent={dynamicContent}
			>
				{element}
			</WithLink>
		);
	}

	return element;
};

addFilter('blocks.getSaveElement', 'maxi-blocks/save', withSave);

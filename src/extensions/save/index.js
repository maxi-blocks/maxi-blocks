/**
 * WordPress Dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { WithLink } from './utils';

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
	'maxi-blocks/video-maxi',
	'maxi-blocks/navigation-menu-maxi',
	'maxi-blocks/navigation-link-maxi',
	'maxi-blocks/navigation-submenu-maxi',
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

	if (allowedBlocks.includes(blockType.name)) {
		return <WithLink linkSettings={linkSettings}>{element}</WithLink>;
	}

	return element;
};

addFilter('blocks.getSaveElement', 'maxi-blocks/save', withSave);

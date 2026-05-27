/**
 * WordPress Dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { WithLink } from './utils';
import { shouldWrapWithLink } from './linkWrapper';
import getGroupAttributes from '@extensions/styles/getGroupAttributes';
import { getBlockData } from '@extensions/attributes';

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
	'maxi-blocks/pane-maxi',
	'maxi-blocks/number-counter-maxi',
	'maxi-blocks/svg-icon-maxi',
	'maxi-blocks/slider-maxi',
	'maxi-blocks/slide-maxi',
	'maxi-blocks/video-maxi',
	'maxi-blocks/accordion-maxi',
	'maxi-blocks/search-maxi',
	'maxi-blocks/button-maxi',
];

/**
 * Add hyperlink element on MaxiBlocks with toolbar link activated
 *
 * @param {Object} BlockSave Original saved object.
 * @return {string} Wrapped component.
 */

const withSave = (element, blockType, attributes) => {
	const linkSettings = { ...attributes.linkSettings };
	const dynamicContent = getGroupAttributes(attributes, 'dynamicContent');
	const linkElements = getBlockData(blockType.name)?.linkElements;
	const shouldWrap = shouldWrapWithLink({
		blockName: blockType.name,
		allowedBlocks,
		linkElements,
		linkSettings,
		dynamicContent,
	});

	if (shouldWrap) {
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

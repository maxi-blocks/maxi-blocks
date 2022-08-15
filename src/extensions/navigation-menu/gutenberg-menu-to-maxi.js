/**
 * WordPress dependencies
 */
import { createBlock, parse } from '@wordpress/blocks';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import createNewMenu from './create-new-menu';

const convertBlocks = blocks => {
	const res = [];

	blocks.forEach(block => {
		if (block.name === 'core/navigation-link') {
			res.push(
				createBlock(
					'maxi-blocks/navigation-link-maxi',
					block.attributes,
					block.innerBlocks
				)
			);
		} else if (block.name === 'core/navigation-submenu') {
			res.push(
				createBlock(
					'maxi-blocks/navigation-submenu-maxi',
					block.attributes,
					convertBlocks(block.innerBlocks)
				)
			);
		} else {
			res.push(block);
		}
	});

	return res;
};

const convertGutenbergMenuToMaxi = async menuId => {
	const menu = select('core').getEntityRecord(
		'postType',
		'wp_navigation',
		menuId
	);
	const content = menu.content.raw;

	const blocks = parse(content);

	if (
		blocks.some(block =>
			['core/navigation-link', 'core/navigation-submenu'].includes(
				block.name
			)
		)
	) {
		const convertedBlocks = convertBlocks(blocks);
		const newMenuId = await createNewMenu(convertedBlocks, menu.title);

		return newMenuId;
	}

	return menuId;
};

export default convertGutenbergMenuToMaxi;

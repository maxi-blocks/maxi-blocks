/**
 * WordPress dependencies
 */
import { createBlock, parse } from '@wordpress/blocks';
import { resolveSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import createNewMenu from './create-new-menu';

/**
 * External dependencies
 */
import { sortBy } from 'lodash';

// Taken from https://github.com/WordPress/gutenberg/blob/trunk/packages/block-library/src/navigation/menu-items-to-blocks.js
const createDataTree = menuItems => {
	const hashTable = {};
	const dataTree = [];

	for (const data of menuItems) {
		hashTable[data.id] = {
			...data,
			children: [],
		};
		const parentId = data.parent;
		if (parentId) {
			hashTable[parentId] = hashTable[parentId] || {};
			hashTable[parentId].children = hashTable[parentId].children || [];
			hashTable[parentId].children.push(hashTable[data.id]);
		} else {
			dataTree.push(hashTable[data.id]);
		}
	}

	return dataTree;
};

const menuItemToBlockAttributes = ({
	title: menuItemTitleField,
	xfn,
	classes,
	attr_title: attrTitle,
	object,
	object_id: objectId,
	url,
	target,
}) => ({
	label: menuItemTitleField?.rendered || '',
	...(object?.length && {
		type: object,
	}),
	url: url || '',
	...(xfn?.length &&
		xfn.join(' ').trim() && {
			rel: xfn.join(' ').trim(),
		}),
	...(classes?.length &&
		classes.join(' ').trim() && {
			extraClassName: classes.join(' ').trim(),
		}),
	...(attrTitle?.length && {
		title: attrTitle,
	}),
	...(objectId &&
		object !== 'custom' && {
			id: objectId,
		}),
	...(target === '_blank' && {
		opensInNewTab: true,
	}),
});

const mapMenuItemsToBlocks = menuItems => {
	// The menu items should be placed in menu_order sort order.
	const sortedItems = sortBy(menuItems, 'menu_order');

	const innerBlocks = sortedItems.map(menuItem => {
		if (menuItem.type === 'block') {
			const [block] = parse(menuItem.content.raw);

			if (!block) {
				return createBlock('core/freeform', {
					content: menuItem.content,
				});
			}

			return block;
		}

		const attributes = menuItemToBlockAttributes(menuItem);

		// If there are children recurse to build those nested blocks.
		const nestedBlocks = menuItem.children?.length
			? mapMenuItemsToBlocks(menuItem.children)
			: {};

		const blockType = menuItem.children?.length
			? 'maxi-blocks/navigation-submenu-maxi'
			: 'maxi-blocks/navigation-link-maxi';

		const block = createBlock(blockType, attributes, nestedBlocks);

		return block;
	});

	return innerBlocks;
};

const menuItemsToBlocks = menuItems => {
	if (!menuItems) {
		return null;
	}

	const menuTree = createDataTree(menuItems);
	const innerBlocks = mapMenuItemsToBlocks(menuTree);
	return innerBlocks;
};

const convertClassicMenuToBlocks = async menuId => {
	const { getMenuItems } = resolveSelect('core');

	const args = {
		menus: menuId,
		per_page: -1,
		context: 'view',
	};
	const menuItems = await getMenuItems(args);
	const innerBlocks = menuItemsToBlocks(menuItems);

	return createNewMenu(innerBlocks);
};

export default convertClassicMenuToBlocks;

/**
 * WordPress dependencies
 */
import { createBlock, parse } from '@wordpress/blocks';

/**
 * External dependencies
 */

import { sortBy } from 'lodash';

const createDataTree = dataset => {
	const hashTable = Object.create(null);
	const dataTree = [];

	for (const data of dataset) {
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
	// eslint-disable-next-line camelcase
	attr_title,
	object,
	// eslint-disable-next-line camelcase
	object_id,
	description,
	url,
	type: menuItemTypeField,
	target,
}) => {
	return {
		label: menuItemTitleField?.rendered || '',
		...(object?.length && {
			type: object,
		}),
		kind: menuItemTypeField?.replace('_', '-') || 'custom',
		url: url || '',
		...(xfn?.length &&
			xfn.join(' ').trim() && {
				rel: xfn.join(' ').trim(),
			}),
		...(classes?.length &&
			classes.join(' ').trim() && {
				extraClassName: classes.join(' ').trim(),
			}),
		/* eslint-disable camelcase */
		...(attr_title?.length && {
			title: attr_title,
		}),
		...(object_id &&
			object !== 'custom' && {
				id: object_id,
			}),
		/* eslint-enable camelcase */
		...(description?.length && {
			description,
		}),
		...(target === '_blank' && {
			opensInNewTab: true,
		}),
	};
};

const mapMenuItemsToBlocks = menuItems => {
	let mapping = {};

	// The menuItem should be in menu_order sort order.
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
		const { innerBlocks: nestedBlocks = [], mapping: nestedMapping = {} } =
			menuItem.children?.length
				? mapMenuItemsToBlocks(menuItem.children)
				: {};

		// Update parent mapping with nested mapping.
		mapping = {
			...mapping,
			...nestedMapping,
		};

		const blockType = menuItem.children?.length
			? 'core/navigation-submenu'
			: 'maxi-blocks/navigation-link-maxi';

		// Create block with nested "innerBlocks".
		const block = createBlock(blockType, attributes, nestedBlocks);

		// Create mapping for menuItem -> block.
		mapping[menuItem.id] = block.clientId;

		return block;
	});

	return {
		innerBlocks,
		mapping,
	};
};

export default function menuItemsToBlocks(menuItems) {
	if (!menuItems) {
		return null;
	}

	const menuTree = createDataTree(menuItems);
	const { innerBlocks } = mapMenuItemsToBlocks(menuTree);
	return innerBlocks;
}

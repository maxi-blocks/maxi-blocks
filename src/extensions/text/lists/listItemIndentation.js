export const LIST_ITEM_BLOCK = 'maxi-blocks/list-item-maxi';
export const TEXT_BLOCK = 'maxi-blocks/text-maxi';

export const getParentListItemClientId = (selectors, clientId) => {
	const listClientId = selectors.getBlockRootClientId(clientId);
	const parentListItemClientId =
		listClientId && selectors.getBlockRootClientId(listClientId);

	if (!parentListItemClientId) return null;

	return selectors.getBlockName(parentListItemClientId) === LIST_ITEM_BLOCK
		? parentListItemClientId
		: null;
};

export const canIndentListItem = (selectors, clientId) =>
	selectors.getBlockName(clientId) === LIST_ITEM_BLOCK &&
	selectors.getBlockIndex(clientId) > 0;

export const canOutdentListItem = (selectors, clientId) =>
	selectors.getBlockName(clientId) === LIST_ITEM_BLOCK &&
	!!getParentListItemClientId(selectors, clientId);

export const getNestedListAttributes = (attributes = {}) =>
	Object.entries(attributes).reduce(
		(accumulator, [key, value]) => {
			if (
				key === 'blockStyle' ||
				key === 'typeOfList' ||
				key === 'listStyle' ||
				key === 'listStyleCustom' ||
				key.startsWith('list-')
			) {
				accumulator[key] = value;
			}

			return accumulator;
		},
		{ isList: true }
	);

const getLastNestedListIndex = (innerBlocks = []) => {
	for (let index = innerBlocks.length - 1; index >= 0; index -= 1) {
		const block = innerBlocks[index];

		if (block?.name === TEXT_BLOCK && block?.attributes?.isList)
			return index;
	}

	return -1;
};

/**
 * Recursively collects clientIds of all nested text-maxi list blocks
 * within the block tree rooted at the given parent block.
 *
 * Walks: parent text-maxi → list-item-maxi children → nested text-maxi (isList) → recurse
 *
 * @param {Object} block Block object with innerBlocks from getBlock()
 * @return {string[]}    ClientIds of all descendant text-maxi list blocks
 */
export const collectNestedListBlockClientIds = block => {
	const result = [];

	if (!block?.innerBlocks?.length) return result;

	for (const innerBlock of block.innerBlocks) {
		if (innerBlock.name !== LIST_ITEM_BLOCK) continue;

		for (const childBlock of innerBlock.innerBlocks || []) {
			if (
				childBlock.name === TEXT_BLOCK &&
				childBlock.attributes?.isList
			) {
				result.push(childBlock.clientId);
				result.push(
					...collectNestedListBlockClientIds(childBlock)
				);
			}
		}
	}

	return result;
};

export const appendBlocksToListItem = ({
	listItemBlock,
	blocks,
	createBlock,
	parentListAttributes = {},
}) => {
	const innerBlocks = [...(listItemBlock.innerBlocks || [])];
	let nestedListIndex = getLastNestedListIndex(innerBlocks);

	if (nestedListIndex === -1) {
		innerBlocks.push(
			createBlock(TEXT_BLOCK, getNestedListAttributes(parentListAttributes))
		);
		nestedListIndex = innerBlocks.length - 1;
	}

	const nestedListBlock = innerBlocks[nestedListIndex];

	innerBlocks[nestedListIndex] = {
		...nestedListBlock,
		innerBlocks: [...(nestedListBlock.innerBlocks || []), ...blocks],
	};

	return {
		...listItemBlock,
		innerBlocks,
	};
};

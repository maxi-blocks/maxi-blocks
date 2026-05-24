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

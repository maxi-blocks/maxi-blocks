const DISALLOWED_BLOCKS = [
	'maxi-blocks/slider-maxi',
	'maxi-blocks/accordion-maxi',
	'maxi-blocks/map-maxi',
	'maxi-blocks/search-maxi',
];

const isDisallowedRepeaterBlock = blockName =>
	typeof blockName === 'string' && DISALLOWED_BLOCKS.includes(blockName);

export const getDisallowedRepeaterBlocksFromClientId = (
	clientId,
	blockEditor
) => {
	const disallowedBlocks = new Set();

	const checkBlock = rootClientId => {
		const childClientIds = blockEditor.getBlockOrder(rootClientId) || [];

		childClientIds.forEach(childClientId => {
			const blockName = blockEditor.getBlockName(childClientId);

			if (isDisallowedRepeaterBlock(blockName)) {
				disallowedBlocks.add(blockName);
			}

			checkBlock(childClientId);
		});
	};

	checkBlock(clientId);

	return Array.from(disallowedBlocks);
};

export default DISALLOWED_BLOCKS;

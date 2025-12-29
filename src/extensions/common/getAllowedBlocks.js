const allowedBlocksCache = new Map();

const createCacheKey = excludedBlockNames =>
	excludedBlockNames.slice().sort().join('|');

export const getAllowedBlocks = excludedBlockNames => {
	const cacheKey = createCacheKey(excludedBlockNames);

	if (!allowedBlocksCache.has(cacheKey)) {
		const allowedBlocks = wp.blocks
			.getBlockTypes()
			.map(block => block.name)
			.filter(blockName => !excludedBlockNames.includes(blockName));

		allowedBlocksCache.set(cacheKey, allowedBlocks);
	}

	return allowedBlocksCache.get(cacheKey);
};

import * as blocksData from '@blocks/data';

const blockDataCache = new Map();

const getBlockData = blockName => {
	if (!blockName) {
		return {};
	}

	if (blockDataCache.has(blockName)) {
		return blockDataCache.get(blockName);
	}

	const blockData =
		Object.values(blocksData).find(
			data => data.name === blockName.replace('maxi-blocks/', '')
		) ?? {};

	blockDataCache.set(blockName, blockData);

	return blockData;
};

export default getBlockData;

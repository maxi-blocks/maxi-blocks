import * as blocksData from '@blocks/data';

const getBlockData = blockName =>
	Object.values(blocksData).find(
		data => data.name === blockName.replace('maxi-blocks/', '')
	) ?? {};

export default getBlockData;

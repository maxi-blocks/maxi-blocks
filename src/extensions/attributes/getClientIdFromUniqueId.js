import { select } from '@wordpress/data';

const getClientIdFromUniqueId = uniqueID => {
	const { getBlocks } = select('core/block-editor');

	const findClientId = (blocks, uniqueID) => {
		const block = blocks.find(block => {
			if (block.attributes.uniqueID === uniqueID) {
				return block.clientId;
			}

			if (block.innerBlocks.length) {
				const foundClientId = findClientId(block.innerBlocks, uniqueID);
				if (foundClientId) {
					return foundClientId;
				}
			}
		});

		return block ? block.clientId : null;
	};

	const blocks = getBlocks();
	const clientId = findClientId(blocks, uniqueID);

	return clientId;
};

export default getClientIdFromUniqueId;

import { select } from '@wordpress/data';

const getClientIdFromUniqueId = uniqueID => {
	const { getBlocks } = select('core/block-editor');

	const findClientId = (blocks, uniqueID) => {
		let clientId = null;

		blocks.forEach(block => {
			if (block.attributes.uniqueID === uniqueID) {
				clientId = block.clientId;
			}

			if (block.innerBlocks.length) {
				clientId =
					findClientId(block.innerBlocks, uniqueID) || block.clientId;
			}
		});

		return clientId;
	};

	const blocks = getBlocks();
	const clientId = findClientId(blocks, uniqueID);

	return clientId;
};

export default getClientIdFromUniqueId;

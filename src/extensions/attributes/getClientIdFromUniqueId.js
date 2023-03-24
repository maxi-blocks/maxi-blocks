import { select } from '@wordpress/data';
import getAttributesValue from './getAttributesValue';

const getClientIdFromUniqueId = uniqueID => {
	const { getBlocks } = select('core/block-editor');

	const findClientId = (blocks, uniqueID) => {
		let clientId = null;

		blocks.forEach(block => {
			const blockUniqueID = getAttributesValue({
				target: 'uniqueID',
				props: block.attributes,
			});

			if (blockUniqueID === uniqueID) {
				clientId = block.clientId;
			}

			if (block.innerBlocks.length) {
				const foundClientId = findClientId(block.innerBlocks, uniqueID);
				if (foundClientId) {
					clientId = foundClientId;
				}
			}
		});

		return clientId;
	};

	const blocks = getBlocks();
	const clientId = findClientId(blocks, uniqueID);

	return clientId;
};

export default getClientIdFromUniqueId;

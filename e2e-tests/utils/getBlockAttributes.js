import { getAllBlocks } from '@wordpress/e2e-test-utils';
import getClientId from './getClientId';

import { find, isEmpty } from 'lodash';

export const getAttributes = (blocks, clientId) => {
	let attributes = false;

	for (const block of blocks) {
		debugger;
		if (block.clientId === clientId) attributes = block.attributes;

		if (!isEmpty(block.innerBlocks)) {
			for (const innerBlock of block.innerBlock) {
				const res = getAttributes(innerBlock, clientId);

				if (res) attributes = res;
			}
		}
	}

	return attributes;
};

const getBlockAttributes = async () => {
	const clientId = await getClientId();
	const blocks = await getAllBlocks();

	// a ver, que esto tiene miga...

	const { attributes } = find(blocks, { clientId });

	return attributes;
};

export default getBlockAttributes;

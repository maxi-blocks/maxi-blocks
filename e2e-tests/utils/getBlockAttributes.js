/**
 * WordPress dependencies
 */
import { getAllBlocks } from '@wordpress/e2e-test-utils';
import getClientId from './getClientId';

/**
 * Internal dependencies
 */
import { isEmpty } from 'lodash';

export const getAttributes = (blocks, clientId) => {
	let attributes = false;

	blocks.forEach(block => {
		if (block.clientId === clientId) attributes = block.attributes;

		if (!isEmpty(block.innerBlocks)) {
			const res = getAttributes(block.innerBlocks, clientId);

			if (res) attributes = res;
		}
	});

	return attributes;
};

const getBlockAttributes = async () => {
	const clientId = await getClientId();
	const blocks = await getAllBlocks();

	const attributes = getAttributes(blocks, clientId);

	return attributes;
};

export default getBlockAttributes;

import { getAllBlocks } from '@wordpress/e2e-test-utils';
import getClientId from './getClientId';

import { find } from 'lodash';

export const getAttributes = (blocks, matcher) => {
	const result = find(blocks, matcher);

	if ( result?.attributes) return result.attributes;

	let attributes;

	blocks.forEach(block => {
		const result = getAttributes(block.innerBlocks, matcher);

		if (result) attributes = result;
	});

	return attributes ?? false;
};

const getBlockAttributes = async () => {
	const clientId = await getClientId();
	const blocks = await getAllBlocks();

	const attributes = getAttributes(blocks, { clientId });

	return attributes;
};

export default getBlockAttributes;

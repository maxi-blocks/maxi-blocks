import { getAllBlocks } from '@wordpress/e2e-test-utils';
import getClientId from './getClientId';

import { find } from 'lodash';

const getBlockAttributes = async () => {
	const clientId = await getClientId();
	const blocks = await getAllBlocks();

	const { attributes } = find(blocks, { clientId });

	return attributes;
};

export default getBlockAttributes;

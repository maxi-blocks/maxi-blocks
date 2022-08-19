/* eslint-disable no-await-in-loop */

/**
 * Internal dependencies
 */
import getAttributes from './getAttributes';

/**
 * External dependencies
 */
import { isArray } from 'lodash';

const waitForAttribute = async (page, rawAttributesKeys) => {
	const attributeKeys = isArray(rawAttributesKeys)
		? rawAttributesKeys
		: [rawAttributesKeys];

	let attributes = await getAttributes(attributeKeys);

	while (Object.values(attributes).some(attribute => !attribute)) {
		await page.waitForTimeout(150);
		attributes = await getAttributes(attributeKeys);
	}

	return true;
};

export default waitForAttribute;

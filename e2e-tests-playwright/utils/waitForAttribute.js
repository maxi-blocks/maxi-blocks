/* eslint-disable no-await-in-loop */

import getAttributes from './getAttributes';

const waitForAttribute = async (page, rawAttributesKeys) => {
	const attributeKeys = Array.isArray(rawAttributesKeys)
		? rawAttributesKeys
		: [rawAttributesKeys];

	let attributes = await getAttributes(page, attributeKeys);

	while (Object.values(attributes).some(attribute => !attribute)) {
		await page.waitForTimeout(150);
		attributes = await getAttributes(page, attributeKeys);
	}

	return true;
};

export default waitForAttribute;

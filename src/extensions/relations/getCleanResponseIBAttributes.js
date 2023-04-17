/**
 * Internal dependencies
 */
import { getClientIdFromUniqueId } from '../attributes';
import { handleSetAttributes } from '../maxi-block';
import getRelatedAttributes from './getRelatedAttributes';
import getTempAttributes from './getTempAttributes';

/**
 * External dependencies
 */
import { isEqual, compact, isNil } from 'lodash';

const getCleanResponseIBAttributes = (
	newAttributesObj,
	blockAttributes,
	uniqueID,
	selectedSettingsObj,
	breakpoint,
	prefix
) => {
	const filteredAttributesObj = Object.entries(newAttributesObj).reduce(
		(acc, [key, value]) => {
			const originalValue = blockAttributes[key];

			if (!isEqual(originalValue, value)) acc[key] = value;

			return acc;
		},
		{}
	);

	const cleanAttributesObject = getRelatedAttributes({
		IBAttributes: handleSetAttributes({
			obj: filteredAttributesObj,
			attributes: blockAttributes,
			clientId: getClientIdFromUniqueId(uniqueID),
			onChange: response => response,
			allowXXLOverGeneral: true,
		}),
		props: blockAttributes,
		relatedAttributes: selectedSettingsObj.relatedAttributes ?? [],
	});

	/**
	 * XXL exception: there's a concrete situation that needs to be saved as exception.
	 * In cases where the block attributes for XXL and General are different, but we save
	 * the same value for XXL and General in IB, the XXL value become undefined, so in IB
	 * component the XXL value from the block attribute is the one shown. Here's an example:
	 * Block attributes: { test-general: 10, test-xxl: 20 }
	 * IB attributes: { test-general: 15: test-xxl: undefined} (because we save 15 for both)
	 *
	 * In this case, we need to save the XXL value from the block attributes, so the IB
	 * will display the correct value. If not, as it is on the example, IB component will
	 * display the value from the block attributes on XXL, which is 20.
	 */
	if (breakpoint === 'xxl') {
		const newXXLUndefinedAttrs = compact(
			Object.entries(cleanAttributesObject).map(([key, value]) => {
				if (key.includes('xxl') && value === undefined) return key;

				return null;
			})
		);

		if (newXXLUndefinedAttrs.length) {
			newXXLUndefinedAttrs.forEach(attr => {
				if (filteredAttributesObj[attr] !== cleanAttributesObject[attr])
					cleanAttributesObject[attr] = filteredAttributesObj[attr];
				else if (
					isNil(cleanAttributesObject[attr]) &&
					cleanAttributesObject[attr.replace('xxl', 'general')]
				)
					cleanAttributesObject[attr] =
						cleanAttributesObject[attr.replace('xxl', 'general')];
			});
		}
	}

	// These attributes are necessary for styling, not need to save in IB
	const tempAttributes = getTempAttributes(
		selectedSettingsObj,
		cleanAttributesObject,
		blockAttributes,
		breakpoint,
		prefix
	);

	return {
		cleanAttributesObject,
		tempAttributes,
	};
};

export default getCleanResponseIBAttributes;

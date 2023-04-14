/**
 * Internal dependencies
 */
import { getClientIdFromUniqueId } from '../attributes';
import { handleSetAttributes } from '../maxi-block';
import getRelatedAttributes from './getRelatedAttributes';
import getTempAttributes from './getTempAttributes';

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

			if (originalValue !== value) acc[key] = value;

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

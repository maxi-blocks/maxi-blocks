/**
 * Internal dependencies
 */
import { getClientIdFromUniqueId } from '@extensions/attributes';
import { handleSetAttributes } from '@extensions/maxi-block';
import { getBreakpointFromAttribute } from '@extensions/styles/utils';
import getRelatedAttributes from './getRelatedAttributes';
import getTempAttributes from './getTempAttributes';

/**
 * External dependencies
 */
import { compact } from 'lodash';

const getCleanResponseIBAttributes = (
	newAttributesObj,
	blockAttributes,
	uniqueID,
	selectedSettingsObj,
	breakpoint,
	prefix,
	sid,
	blockTriggerClientId
) => {
	// Add null check for selectedSettingsObj to prevent undefined errors
	if (!selectedSettingsObj) {
		// eslint-disable-next-line no-console
		console.warn(
			'selectedSettingsObj is undefined, returning empty attributes'
		);
		return {
			cleanAttributesObject: {},
			tempAttributes: {},
		};
	}

	const cleanAttributesObject = getRelatedAttributes({
		IBAttributes: handleSetAttributes({
			obj: newAttributesObj,
			attributes: blockAttributes,
			clientId: getClientIdFromUniqueId(uniqueID),
			targetClientId: blockTriggerClientId,
			onChange: response => response,
			allowXXLOverGeneral: true,
		}),
		props: blockAttributes,
		relatedAttributes: selectedSettingsObj.relatedAttributes ?? [],
		sid,
	});

	/**
	 * Exception: there's a concrete situation that needs to be saved as exception.
	 * In cases where the block attributes for a breakpoint and General are different,
	 * but we save the same value for this concrete breakpoint and General in IB,
	 * the breakpoint attribute value become undefined, so in IB component the current
	 * breakpoint value from the block attribute is the one shown. Here's an example:
	 * Block attributes: { test-general: 10, test-xxl: 20 }
	 * IB attributes: { test-general: 15: test-xxl: undefined} (because we save 15 for both)
	 *
	 * In this case, we need to save the current breakpoint value from the block attributes, so the IB
	 * will display the correct value. If not, as it is on the example, IB component will
	 * display the value from the block attributes on XXL, which is 20.
	 */

	const newUndefinedAttrs = compact(
		Object.entries(cleanAttributesObject).map(([key, value]) => {
			if (value === undefined) return key;

			return null;
		})
	);

	if (newUndefinedAttrs.length) {
		newUndefinedAttrs.forEach(attr => {
			const attrBreakpoint = getBreakpointFromAttribute(attr);

			if (attrBreakpoint !== 'general') {
				if (newAttributesObj[attr] !== cleanAttributesObject[attr]) {
					cleanAttributesObject[attr] = newAttributesObj[attr];
				}
			}
		});
	}

	// These attributes are necessary for styling, not need to save in IB
	const tempAttributes = getTempAttributes(
		selectedSettingsObj,
		cleanAttributesObject,
		blockAttributes,
		breakpoint,
		prefix,
		sid
	);

	return {
		cleanAttributesObject,
		tempAttributes,
	};
};

export default getCleanResponseIBAttributes;

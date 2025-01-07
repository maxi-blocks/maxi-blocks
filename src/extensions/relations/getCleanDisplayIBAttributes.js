/**
 * Internal dependencies
 */
import {
	replaceAttrKeyBreakpoint,
	getBreakpointFromAttribute,
} from '@extensions/styles/utils';

/**
 * External dependencies
 */
import { merge } from 'lodash';

/**
 * Cleans up the merged attributes based on criteria from inputAttributes.
 *
 * Criteria:
 * - If inputAttributes has a 'general' attribute and originalObj has an attribute for a specific
 *   breakpoint (XXL to XS) that differs from the default, the breakpoint-specific attribute from
 *   originalObj might overwrite the 'general' one in mergedObj. This can lead to misleading display
 *   in components.
 * - This function identifies such cases and removes these potentially confusing attributes from
 *   mergedObj for all breakpoints.
 *
 * @param {Object} mergedObj       - Merged attributes.
 * @param {Object} originalObj     - Original block attributes.
 * @param {Object} inputAttributes - Attributes guiding the cleanup.
 * @returns {Object} - Cleaned mergedObj.
 */
const cleanAttributes = (mergedObj, originalObj, inputAttributes) => {
	// Check if inputAttributes is a valid object
	if (!inputAttributes || typeof inputAttributes !== 'object') {
		return mergedObj; // Return mergedObj as is, since inputAttributes is not valid
	}
	Object.keys(inputAttributes).forEach(key => {
		const breakpoint = getBreakpointFromAttribute(key);

		if (breakpoint === 'general') {
			['xxl', 'xl', 'l', 'm', 's', 'xs'].forEach(breakpoint => {
				const breakpointAttrKey = replaceAttrKeyBreakpoint(
					key,
					breakpoint
				);

				if (!(breakpointAttrKey in originalObj)) return;

				const shouldDelete =
					originalObj[key] !== mergedObj[breakpointAttrKey] &&
					!(breakpointAttrKey in inputAttributes);

				if (shouldDelete) delete mergedObj[breakpointAttrKey];
			});
		}
	});

	return mergedObj;
};

/**
 * Merges blockAttributes and IBAttributes and then cleans up the merged result
 * based on specific criteria (as defined in the cleanAttributes function).
 *
 * - Initially, it merges the two sets of attributes.
 * - Then it cleans the merged attributes using the `cleanAttributes` function.
 * - If the merged attributes contain a 'background-layers' property, it cleans that as well.
 *
 * @param {Object} blockAttributes - The original block attributes.
 * @param {Object} IBAttributes    - Attributes from IB (or other source) that dictate the cleanup process.
 * @returns {Object} - The cleaned merged attributes.
 */
const getCleanDisplayIBAttributes = (blockAttributes, IBAttributes) => {
	// Merging into empty object because lodash `merge` mutates first argument
	const mergedAttributes = merge({}, blockAttributes, IBAttributes);

	// Clean main mergedAttributes
	cleanAttributes(mergedAttributes, blockAttributes, IBAttributes);

	// If 'background-layers' exists, clean it as well
	if (
		mergedAttributes['background-layers'] &&
		IBAttributes['background-layers']
	) {
		mergedAttributes['background-layers'].forEach((layer, index) => {
			mergedAttributes['background-layers'][index] = cleanAttributes(
				layer,
				blockAttributes['background-layers'][index],
				IBAttributes['background-layers'][index]
			);
		});
	}

	return mergedAttributes;
};

export default getCleanDisplayIBAttributes;

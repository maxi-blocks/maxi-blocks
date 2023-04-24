/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getClientIdFromUniqueId } from '../attributes';
import { handleSetAttributes } from '../maxi-block';
import { replaceAttrKeyBreakpoint } from '../styles';
import getBreakpointFromAttribute from '../styles/getBreakpointFromAttribute';
import getRelatedAttributes from './getRelatedAttributes';
import getTempAttributes from './getTempAttributes';

/**
 * External dependencies
 */
import { compact, isNil } from 'lodash';

const getCleanResponseIBAttributes = (
	newAttributesObj,
	blockAttributes,
	uniqueID,
	selectedSettingsObj,
	breakpoint,
	prefix,
	sid
) => {
	const cleanAttributesObject = getRelatedAttributes({
		IBAttributes: handleSetAttributes({
			obj: newAttributesObj,
			attributes: blockAttributes,
			clientId: getClientIdFromUniqueId(uniqueID),
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

	const baseBreakpoint = select('maxiBlocks').receiveBaseBreakpoint();

	const newUndefinedAttrs = compact(
		Object.entries(cleanAttributesObject).map(([key, value]) => {
			if (value === undefined) return key;

			return null;
		})
	);

	if (newUndefinedAttrs.length) {
		newUndefinedAttrs.forEach(attr => {
			if (breakpoint !== 'general') {
				if (newAttributesObj[attr] !== cleanAttributesObject[attr]) {
					cleanAttributesObject[attr] = newAttributesObj[attr];
					return;
				}

				const breakpointAttrKey = replaceAttrKeyBreakpoint(
					attr,
					breakpoint
				);

				if (
					isNil(cleanAttributesObject[attr]) &&
					cleanAttributesObject[breakpointAttrKey]
				)
					cleanAttributesObject[attr] =
						cleanAttributesObject[breakpointAttrKey];

				const attrBreakpoint = getBreakpointFromAttribute(attr);

				if (baseBreakpoint !== attrBreakpoint)
					delete cleanAttributesObject[attr];
			}

			const attrBreakpoint = getBreakpointFromAttribute(attr);

			if (
				attrBreakpoint !== 'general' &&
				baseBreakpoint !== attrBreakpoint
			)
				delete cleanAttributesObject[attr];
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

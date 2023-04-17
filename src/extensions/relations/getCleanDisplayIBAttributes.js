/**
 * Internal dependencies
 */
import getBreakpointFromAttribute from '../styles/getBreakpointFromAttribute';

/**
 * External dependencies
 */
import { merge } from 'lodash';

const getCleanDisplayIBAttributes = (blockAttributes, IBAttributes) => {
	// Merging into empty object because lodash `merge` mutates first argument
	const mergedAttributes = merge({}, blockAttributes, IBAttributes);

	// In case IBAttributes contains a general attribute and the block attribute
	// has a XXL attribute different from the default, on IB the general attribute
	// will overwrite the XXL block attribute, so when the attributes we need to pass
	// to the component to be displayed need to be cleaned from this XXL attribute
	// or it will be wrongly displayed and will cause confusion.
	Object.keys(IBAttributes).forEach(key => {
		const breakpoint = getBreakpointFromAttribute(key);

		if (breakpoint === 'general') {
			const cleanKey = key.replace('-general', '');

			if (`${cleanKey}-xxl` in blockAttributes) {
				delete mergedAttributes[`${cleanKey}-xxl`];
			}
		}
	});

	return mergedAttributes;
};

export default getCleanDisplayIBAttributes;

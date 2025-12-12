/**
 * Internal dependencies
 */
import getAttributeKey from '@extensions/styles/getAttributeKey';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Generates size styles object
 *
 * @param {Object} obj Block size properties
 */
const getDisplayStyles = (obj, isHover = false, isRelations = false) => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		const attrKey = getAttributeKey('display', isHover, false, breakpoint);
		if (obj[attrKey])
			response[breakpoint] = {
				display: obj[attrKey],
			};
		// Removed automatic 'display: flex' fallback for relations
		// This was causing higher breakpoints (XXL) to override lower ones
		// CSS cascade will handle inheritance properly
	});

	return response;
};

export default getDisplayStyles;

/**
 * Internal dependencies
 */
import getAttributeKey from '../../attributes/getAttributeKey';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Generates size styles object
 *
 * @param {Object} obj Block size properties
 */
const getDisplayStyles = (obj, isHover = false) => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		const attrKey = getAttributeKey('_d', isHover, false, breakpoint);
		if (obj[attrKey])
			response[breakpoint] = {
				display: obj[attrKey],
			};
	});

	return response;
};

export default getDisplayStyles;

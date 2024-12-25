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
const getOpacityStyles = (obj, isHover = false, prefix = '') => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		const attrKey = getAttributeKey('opacity', isHover, prefix, breakpoint);
		response[breakpoint] = {
			...(obj[attrKey] !== undefined &&
				obj[attrKey] !== '' && {
					opacity: obj[attrKey],
				}),
		};
	});

	return response;
};

export default getOpacityStyles;

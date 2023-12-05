/**
 * Internal dependencies
 */
import getAttributeKey from '../getAttributeKey';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Generates image width styles object
 *
 * @param {Object} obj Block size properties
 */
const getImgWidthStyles = (obj, useInitSize, mediaWidth) => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		const attrKey = getAttributeKey('img-width', false, false, breakpoint);
		const value = obj[attrKey];
		if (value)
			response[breakpoint] = {
				width: !useInitSize ? `${value}%` : `${mediaWidth}px`,
			};
	});

	return { imgWidth: response };
};

export default getImgWidthStyles;

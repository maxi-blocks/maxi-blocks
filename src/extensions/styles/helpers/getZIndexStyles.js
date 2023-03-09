/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Internal dependencies
 */
import getAttributeValue from '../getAttributeValue';

/**
 * Generates size styles object
 *
 * @param {Object} obj Block size properties
 */
const getZIndexStyles = obj => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		const value = getAttributeValue({
			target: 'z-index',
			breakpoint,
			props: obj,
		});

		if (value)
			response[breakpoint] = {
				'z-index': value,
			};
	});

	return response;
};

export default getZIndexStyles;

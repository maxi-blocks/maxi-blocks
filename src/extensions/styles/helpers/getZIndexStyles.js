/**
 * General
 */
const breakpoints = ['g', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Internal dependencies
 */
import getAttributesValue from '../../attributes/getAttributesValue';

/**
 * Generates size styles object
 *
 * @param {Object} obj Block size properties
 */
const getZIndexStyles = obj => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		const value = getAttributesValue({
			target: '_zi',
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

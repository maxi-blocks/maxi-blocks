/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Generates size styles object
 *
 * @param {Object} obj Block size properties
 */
const getZIndexStyles = obj => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		if (obj[`z-index-${breakpoint}`])
			response[breakpoint] = {
				'z-index': obj[`z-index-${breakpoint}`],
			};
	});

	return response;
};

export default getZIndexStyles;

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Generates size styles object
 *
 * @param {Object} obj Block size properties
 */
const getDisplayStyles = obj => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		if (obj[`display-${breakpoint}`])
			response[breakpoint] = {
				display: obj[`display-${breakpoint}`],
			};
	});

	return response;
};

export default getDisplayStyles;

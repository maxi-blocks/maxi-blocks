/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Generates overflow styles object
 *
 * @param {Object} obj Block overflow properties
 */
const getOverflowStyles = obj => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		if (obj[`overflow-${breakpoint}`])
			response[breakpoint] = {
				overflow: obj[`overflow-${breakpoint}`],
			};
	});

	return response;
};

export default getOverflowStyles;

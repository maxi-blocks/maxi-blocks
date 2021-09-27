/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Generates size styles object
 *
 * @param {Object} obj Block size properties
 */
const getTransitionStyles = obj => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		if (obj[`transition-duration-${breakpoint}`])
			response[breakpoint] = {
				transition: `all ${
					obj[`transition-duration-${breakpoint}`]
				}s ease`,
			};
	});

	return response;
};

export default getTransitionStyles;

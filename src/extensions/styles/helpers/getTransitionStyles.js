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
				'transition-duration': `${
					obj[`transition-duration-${breakpoint}`]
				}s`,
				'transition-delay': `${
					obj[`transition-delay-${breakpoint}`]
				}s`,
				'transition-timing-function': obj[`easing-${breakpoint}`],
			};
	});

	return response;
};

export default getTransitionStyles;

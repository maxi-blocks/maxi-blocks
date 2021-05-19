/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Generates size styles object
 *
 * @param {Object} obj Block size properties
 */
const getOpacityStyles = obj => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {
			...(obj[`opacity-${breakpoint}`] && {
				opacity: obj[`opacity-${breakpoint}`],
			}),
		};
	});

	return response;
};

export default getOpacityStyles;

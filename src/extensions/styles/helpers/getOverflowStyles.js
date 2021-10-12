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
		response[breakpoint] = {
			...(obj[`overflow-x-${breakpoint}`] && {
				'overflow-x': obj[`overflow-x-${breakpoint}`],
			}),
			...(obj[`overflow-y-${breakpoint}`] && {
				'overflow-y': obj[`overflow-y-${breakpoint}`],
			}),
		};
	});

	return response;
};

export default getOverflowStyles;

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 *
 * @param {Object} obj Block clip-path properties
 */
const getClipPathStyles = obj => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		if (
			obj[`clip-path-status-${breakpoint}`] &&
			obj[`clip-path-${breakpoint}`]
		)
			response[breakpoint] = {
				'clip-path': obj[`clip-path-${breakpoint}`],
			};
	});

	return response;
};

export default getClipPathStyles;

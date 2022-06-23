import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

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

	const isOverflowStylesNeeded = breakpoints.some(breakpoint => {
		const overflowX = getLastBreakpointAttribute({
			target: 'overflow-x',
			breakpoint,
			attributes: obj,
		});

		const overflowY = getLastBreakpointAttribute({
			target: 'overflow-y',
			breakpoint,
			attributes: obj,
		});

		if (overflowX !== 'visible' || overflowY !== 'visible') {
			return true;
		}

		return false;
	});

	if (isOverflowStylesNeeded)
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

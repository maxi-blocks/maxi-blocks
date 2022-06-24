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

	let omitOverflowX = true;
	let omitOverflowY = true;

	breakpoints.forEach(breakpoint => {
		const overflowX = obj[`overflow-x-${breakpoint}`];
		const overflowY = obj[`overflow-y-${breakpoint}`];

		omitOverflowX = omitOverflowX ? overflowX === 'visible' : false;
		omitOverflowY = omitOverflowY ? overflowY === 'visible' : false;

		response[breakpoint] = {
			...(!omitOverflowX &&
				obj[`overflow-x-${breakpoint}`] && {
					'overflow-x': obj[`overflow-x-${breakpoint}`],
				}),
			...(!omitOverflowY &&
				obj[`overflow-y-${breakpoint}`] && {
					'overflow-y': obj[`overflow-y-${breakpoint}`],
				}),
		};
	});

	return response;
};

export default getOverflowStyles;

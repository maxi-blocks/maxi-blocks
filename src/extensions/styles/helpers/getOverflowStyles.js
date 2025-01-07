import getLastBreakpointAttribute from '@extensions/styles/getLastBreakpointAttribute';

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

		omitOverflowX = omitOverflowX ? overflowX === 'visible' : false;
		omitOverflowY = omitOverflowY ? overflowY === 'visible' : false;

		response[breakpoint] = {
			...(!omitOverflowX && {
				'overflow-x': overflowX,
			}),
			...(!omitOverflowY && {
				'overflow-y': overflowY,
			}),
		};
	});

	return response;
};

export default getOverflowStyles;

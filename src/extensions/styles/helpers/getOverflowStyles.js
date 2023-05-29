import getLastBreakpointAttribute from '../../attributes/getLastBreakpointAttribute';

/**
 * General
 */
const breakpoints = ['g', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

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
			target: '_ox',
			breakpoint,
			attributes: obj,
		});
		const overflowY = getLastBreakpointAttribute({
			target: '_oy',
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

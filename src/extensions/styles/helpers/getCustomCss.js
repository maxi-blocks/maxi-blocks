/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Generates custom css object
 *
 * @param {Object} obj Block custom css properties
 */
const getCustomCss = (obj, index) => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {
			css: getLastBreakpointAttribute('custom-css', breakpoint, obj)[
				index
			],
		};

		// console.log(typeof response[breakpoint]);
	});

	return response;
};

export default getCustomCss;

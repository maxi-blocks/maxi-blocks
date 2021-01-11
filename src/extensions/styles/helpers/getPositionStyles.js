/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../getLastBreakpointValue';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Generates size styles object
 *
 * @param {Object} obj Block size properties
 */
const getPositionStyles = obj => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {
			position: obj[`position-${breakpoint}`],
			top:
				getLastBreakpointAttribute('position-top', breakpoint, obj) +
				getLastBreakpointAttribute('position-unit', breakpoint, obj),
			right:
				getLastBreakpointAttribute('position-right', breakpoint, obj) +
				getLastBreakpointAttribute('position-unit', breakpoint, obj),
			bottom:
				getLastBreakpointAttribute('position-bottom', breakpoint, obj) +
				getLastBreakpointAttribute('position-unit', breakpoint, obj),
			left:
				getLastBreakpointAttribute('position-left', breakpoint, obj) +
				getLastBreakpointAttribute('position-unit', breakpoint, obj),
		};
	});

	return response;
};

export default getPositionStyles;

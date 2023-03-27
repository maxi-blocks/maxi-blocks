/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Returns the relative breakpoint to the content width of the editor canvas
 *
 * @param {number} contentWidth Editor canvas width
 * @param {obj}    breakpoints  Breakpoints object
 * @returns Breakpoint relative to the content width
 */
const getWinBreakpoint = (contentWidth, rawBreakpoints) => {
	const breakpoints = !isEmpty(rawBreakpoints)
		? rawBreakpoints
		: {
				xs: 480,
				s: 767,
				m: 1024,
				l: 1366,
				xl: 1920,
		  };

	if (contentWidth > breakpoints.xl) return 'xxl';

	// Objects are unordered collection of properties, so as we can't rely on
	// its own order, we need to iterate over an ordered array
	const getBreakpointRange = (obj, minWidth) => {
		let result;

		['xl', 'l', 'm', 's', 'xs'].forEach(breakpoint => {
			if (obj[breakpoint] >= minWidth) {
				result = breakpoint;
			}
		});

		return result;
	};

	return getBreakpointRange(breakpoints, contentWidth);
};

export default getWinBreakpoint;

const getBreakpointRange = (width, breakpoints) => {
	let result;

	// Objects are unordered collection of properties, so as we can't rely on
	// its own order, we need to iterate over an ordered array
	['xl', 'l', 'm', 's', 'xs'].forEach(breakpoint => {
		if (breakpoints[breakpoint] >= width) result = breakpoint;
	});

	return result;
};

/**
 * @param {number}                  width       Width of the editor.
 * @param {Object.<string, number>} breakpoints Object of breakpoints, where keys - are breakpoint names, and values - are breakpoint widths.
 * @returns {string}
 */
const getBreakpointByWidth = (width, breakpoints) => {
	if (width > breakpoints.xl) return 'xxl';
	return getBreakpointRange(width, breakpoints);
};

export default getBreakpointByWidth;

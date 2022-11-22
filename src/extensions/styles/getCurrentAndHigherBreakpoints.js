const getCurrentAndHigherBreakpoints = breakpoint => {
	const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
	return breakpoints.slice(0, breakpoints.indexOf(breakpoint) + 1);
};

export default getCurrentAndHigherBreakpoints;

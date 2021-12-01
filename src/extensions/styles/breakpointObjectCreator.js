/**
 * TODO: implement on the rest of default attributes 👍
 */

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const breakpointObjectCreator = ({ obj, noBreakpointAttr = [] }) => {
	const response = {};

	Object.entries(obj).forEach(([key, val]) => {
		if (noBreakpointAttr?.includes(key)) {
			response[key] = val;

			return;
		}

		breakpoints.forEach(breakpoint => {
			const newVal = { ...val };
			if (breakpoint !== 'general') delete newVal.default;

			const newKey = `${key}-${breakpoint}`;

			response[newKey] = newVal;
		});
	});

	return response;
};

export default breakpointObjectCreator;

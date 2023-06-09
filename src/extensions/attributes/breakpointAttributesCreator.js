const breakpoints = ['g', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const breakpointAttributesCreator = ({
	obj,
	noBreakpointAttr = [],
	diffValAttr = {},
}) => {
	const response = {};
	const diffValAttrKeys = Object.keys(diffValAttr);

	Object.entries(obj).forEach(([key, val]) => {
		if (noBreakpointAttr?.includes(key)) {
			response[key] = val;

			return;
		}

		breakpoints.forEach(breakpoint => {
			const newKey = `${key}-${breakpoint}`;
			const newVal = {
				...val,
				longLabel: `${val.longLabel}-${
					breakpoint === 'g' ? 'general' : breakpoint
				}`,
			};

			if (diffValAttrKeys.includes(newKey))
				newVal.default = diffValAttr[newKey];
			else if (breakpoint !== 'g') delete newVal.default;

			response[newKey] = newVal;
		});
	});

	return response;
};

export default breakpointAttributesCreator;

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

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
			const newVal = { ...val };

			if (diffValAttrKeys.includes(newKey))
				newVal.default = diffValAttr[newKey];
			else if (breakpoint !== 'general') delete newVal.default;

			response[newKey] = newVal;
		});
	});

	return response;
};

export default breakpointAttributesCreator;

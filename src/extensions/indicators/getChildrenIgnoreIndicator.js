import getResponsiveAttributeKeys from './getResponsiveAttributeKeys';

const getChildrenIgnoreIndicator = items => {
	const ignoreIndicatorArray = [];

	Object.entries(items).forEach(([key, value]) => {
		if (key === 'ignoreIndicator' && value)
			ignoreIndicatorArray.push(...value);

		if (key === 'ignoreIndicatorResponsive')
			ignoreIndicatorArray.push(...getResponsiveAttributeKeys(value));

		if (
			value?.content ||
			value?.props ||
			value?.children ||
			value?.items ||
			Array.isArray(value)
		)
			ignoreIndicatorArray.push(...getChildrenIgnoreIndicator(value));
	});

	return ignoreIndicatorArray;
};

export default getChildrenIgnoreIndicator;

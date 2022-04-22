const getBorderRadiusCorners = (index, originalNestedColumns) => {
	if (index === 0 && originalNestedColumns.length === 1) {
		return [
			'border-top-left-radius',
			'border-top-right-radius',
			'border-bottom-left-radius',
			'border-bottom-right-radius',
		];
	}
	if (index === 0) {
		return ['border-top-left-radius', 'border-bottom-left-radius'];
	}
	if (index === originalNestedColumns.length - 1) {
		return ['border-top-right-radius', 'border-bottom-right-radius'];
	}
	return null;
};

const getParentBorderRadius = (
	rawParentBorderRadius,
	originalNestedColumns,
	clientId
) => {
	const index = originalNestedColumns.indexOf(clientId);
	const corners = getBorderRadiusCorners(index, originalNestedColumns);

	const parentBorderRadius = {};

	if (corners) {
		Object.entries(rawParentBorderRadius).forEach(([key, value]) => {
			if (corners.some(corner => key.includes(corner))) {
				parentBorderRadius[key] = value;
			}
		});

		return parentBorderRadius;
	}

	return null;
};

export default getParentBorderRadius;

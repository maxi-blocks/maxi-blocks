const getBorderRadiusCorners = (index, originalNestedColumns) => {
	if (index === 0 && originalNestedColumns.length === 1) {
		return [
			'border-radius-top-left',
			'border-radius-top-right',
			'border-radius-bottom-left',
			'border-radius-bottom-right',
		];
	}
	if (index === 0) {
		return ['border-radius-top-left', 'border-radius-bottom-left'];
	}
	if (index === originalNestedColumns.length - 1) {
		return ['border-radius-top-right', 'border-radius-bottom-right'];
	}
	return null;
};

const getRowBorderRadius = (
	rawRowBorderRadius,
	originalNestedColumns,
	clientId
) => {
	const index = originalNestedColumns.indexOf(clientId);
	const corners = getBorderRadiusCorners(index, originalNestedColumns);

	const rowBorderRadius = {};

	if (corners) {
		Object.entries(rawRowBorderRadius).forEach(([key, value]) => {
			if (corners.some(corner => key.includes(corner))) {
				rowBorderRadius[key] = value;
			}
		});

		return rowBorderRadius;
	}

	return {};
};

export default getRowBorderRadius;

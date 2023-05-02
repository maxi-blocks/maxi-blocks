const getBorderRadiusCorners = (index, originalNestedColumns) => {
	if (index === 0 && originalNestedColumns.length === 1) {
		return ['bo.ra.tl', 'bo.ra.tr', 'bo.ra.bl', 'bo.ra.br'];
	}
	if (index === 0) {
		return ['bo.ra.tl', 'bo.ra.bl'];
	}
	if (index === originalNestedColumns.length - 1) {
		return ['bo.ra.tr', 'bo.ra.br'];
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

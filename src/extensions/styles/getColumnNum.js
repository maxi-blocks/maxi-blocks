const getColumnNum = (columnsSize, clientId, breakpoint) => {
	if (!columnsSize) return null;

	let k = 0;
	let acc = 0;
	const columnSizeMatrix = [];

	Object.entries(columnsSize).forEach(([key, value]) => {
		const size = value[`column-size-${breakpoint}`];

		if (size) {
			acc += size;

			if (acc >= 100) k += 1;

			if (!columnSizeMatrix[k]) columnSizeMatrix[k] = [];

			columnSizeMatrix[k].push(key);
		}
	});

	const row = columnSizeMatrix.find(row => row?.includes(clientId));
	return row?.length;
};

export default getColumnNum;

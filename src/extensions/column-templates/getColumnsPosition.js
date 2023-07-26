/**
 * Get columns positions (Row number and the number of columns in the row)
 *
 * @param {Array} sizes array of columns widths
 * @return {Array} Array of objects
 */
const getColumnsPosition = sizes => {
	const columnsPositions = [];

	let columnsSizeSum = 0;
	let columnsNumberInOneRow = 0;
	let rowsCount = 1;

	sizes.forEach(size => {
		columnsSizeSum += size;
		columnsNumberInOneRow += 1;

		columnsPositions.push({
			rowNumber: rowsCount,
		});

		if (Math.round(columnsSizeSum * 100 + Number.EPSILON) / 100 === 1) {
			columnsPositions.forEach(column => {
				if (!column.columnsNumber) {
					column.columnsNumber = columnsNumberInOneRow;
				}
			});

			rowsCount += 1;
			columnsSizeSum = 0;
			columnsNumberInOneRow = 0;
		}
	});

	return columnsPositions;
};

export default getColumnsPosition;

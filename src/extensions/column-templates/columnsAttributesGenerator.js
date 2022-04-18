import getColumnsPosition from './getColumnsPosition';

const getGeneralColumnAttributes = ({ column, columnPosition, proportion }) => {
	return {
		'column-size-general': column * proportion,
		'column-size-m': 100,
		...(columnPosition.columnsNumber === 1 && {
			'column-size-general': 100,
		}),
	};
};

const getColumnAttributes = ({
	column,
	breakpoint,
	columnPosition,
	proportion,
}) => {
	return {
		[`column-size-${breakpoint}`]: column * proportion,
		...(columnPosition.columnsNumber === 1 && {
			[`column-size-${breakpoint}`]: 100,
		}),
	};
};

/**
 * Apply gap on columns sizes array
 *
 * @param {Array} sizes array of columns widths
 * @return {Array} columns sizes after applying the gap
 */
const columnAttributesGenerator = (columns, breakpoint) => {
	const newColumnsSizes = [];
	const columnsPositions = getColumnsPosition(columns);

	const isResponsive = breakpoint !== 'general';

	columns.forEach((column, i) => {
		const proportion = 100;

		newColumnsSizes.push(
			(!isResponsive &&
				getGeneralColumnAttributes({
					column,
					columnPosition: columnsPositions[i],
					proportion,
					isFirst: !i,
				})) ||
				getColumnAttributes({
					column,
					breakpoint,
					columnPosition: columnsPositions[i],
					proportion,
				})
		);
	});

	return newColumnsSizes;
};

export default columnAttributesGenerator;

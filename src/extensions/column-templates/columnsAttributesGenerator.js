import getColumnsPosition from './getColumnsPosition';

const getGeneralColumnAttributes = ({
	column,
	columnPosition,
	proportion,
	isFirst,
}) => {
	return {
		'column-size-general': column * proportion,
		'column-size-m': 100,
		...(!isFirst && {
			'margin-top-m': '1.5',
			'margin-unit-m': 'em',
		}),
		...(isFirst && {
			'margin-top-m': '',
			'margin-unit-m': '',
		}),
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
		...(columnPosition.rowNumber !== 1 && {
			[`margin-top-${breakpoint}`]: '1.5',
			[`margin-unit-${breakpoint}`]: 'em',
		}),
		...(columnPosition.rowNumber === 1 && {
			[`margin-top-${breakpoint}`]: '0',
		}),
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
const columnAttributesGenerator = (columns, removeColumnGap, breakpoint) => {
	const newColumnsSizes = [];
	const columnsPositions = getColumnsPosition(columns);
	const gap = !removeColumnGap ? 2.5 : 0;

	const isResponsive = breakpoint !== 'general';

	columns.forEach((column, i) => {
		const numberOfGaps = columnsPositions[i].columnsNumber - 1;
		const proportion = 100 - gap * numberOfGaps;
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

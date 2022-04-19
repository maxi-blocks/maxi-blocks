/**
 * Internal dependencies
 */
import getColumnsPosition from './getColumnsPosition';

/**
 * External dependencies
 */
import { round } from 'lodash';

const getGeneralColumnAttributes = ({ column, columnPosition }) => {
	return {
		'column-size-general': round(column * 100, 2),
		'column-size-m': 100,
		...(columnPosition.columnsNumber === 1 && {
			'column-size-general': 100,
		}),
	};
};

const getColumnAttributes = ({ column, breakpoint, columnPosition }) => {
	return {
		[`column-size-${breakpoint}`]: round(column * 100, 2),
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
		newColumnsSizes.push(
			(!isResponsive &&
				getGeneralColumnAttributes({
					column,
					columnPosition: columnsPositions[i],
				})) ||
				getColumnAttributes({
					column,
					breakpoint,
					columnPosition: columnsPositions[i],
				})
		);
	});

	return newColumnsSizes;
};

export default columnAttributesGenerator;

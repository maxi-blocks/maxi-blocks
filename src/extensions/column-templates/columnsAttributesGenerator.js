/**
 * Internal dependencies
 */
import getColumnsPosition from './getColumnsPosition';

/**
 * External dependencies
 */
import { floor } from 'lodash';

const getGeneralColumnAttributes = ({ column, columnPosition }) => {
	return {
		'_cs-g': floor(column * 100, 2),
		'_cs-m': 100,
		...(columnPosition.columnsNumber === 1 && {
			'_cs-g': 100,
		}),
	};
};

const getColumnAttributes = ({ column, breakpoint, columnPosition }) => {
	return {
		[`_cs-${breakpoint}`]: floor(column * 100, 2),
		...(columnPosition.columnsNumber === 1 && {
			[`_cs-${breakpoint}`]: 100,
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

	const isResponsive = breakpoint !== 'g';

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

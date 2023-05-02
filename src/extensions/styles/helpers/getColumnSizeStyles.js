/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../../attributes/getLastBreakpointAttribute';

/**
 * External dependencies
 */
import { isNumber, round } from 'lodash';
import getAttributeKey from '../../attributes/getAttributeKey';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

export const getColumnNum = (columnsSize, clientId, breakpoint) => {
	if (!columnsSize) return null;

	let k = 0;
	let acc = 0;
	const columnSizeMatrix = [];

	Object.entries(columnsSize).forEach(([key, value]) => {
		const size = getLastBreakpointAttribute({
			target: '_cs',
			breakpoint,
			attributes: value,
		});

		if (size) {
			acc += size;

			if (acc > 100) {
				k += 1;

				acc = size;
			}

			if (!columnSizeMatrix[k]) columnSizeMatrix[k] = [];

			columnSizeMatrix[k].push(key);
		}
	});

	const row = columnSizeMatrix.find(row => row?.includes(clientId));
	return row?.length;
};

const getColumnSizeStyles = (obj, rowGapProps, clientId) => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		const fitContent = getLastBreakpointAttribute({
			target: '_cfc',
			breakpoint,
			attributes: obj,
		});
		const columnSize = getLastBreakpointAttribute({
			target: '_cs',
			breakpoint,
			attributes: obj,
		});

		if (fitContent) {
			response[breakpoint] = {
				width: 'fit-content',
				'flex-basis': 'fit-content',
			};
		} else if (
			isNumber(columnSize) ||
			isNumber(
				rowGapProps?.[getAttributeKey('_cg', false, '', breakpoint)]
			)
		) {
			const columnNum = getColumnNum(
				rowGapProps?.columnsSize,
				clientId,
				breakpoint
			);

			const gapNum = columnNum - 1;
			const gap =
				(getLastBreakpointAttribute({
					target: '_cg',
					breakpoint,
					attributes: rowGapProps,
				}) *
					gapNum) /
				columnNum;
			const gapUnit = getLastBreakpointAttribute({
				target: '_cg.u',
				breakpoint,
				attributes: rowGapProps,
			});

			const gapValue = gap ? `${round(gap, 4)}${gapUnit}` : '0px';

			const value =
				columnSize !== 100
					? `calc(${columnSize}% - ${gapValue})`
					: '100%';

			response[breakpoint] = {
				width: value,
				'flex-basis': value,
			};
		}
	});

	return response;
};

export default getColumnSizeStyles;

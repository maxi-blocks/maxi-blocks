/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';
import getColumnNum from '../getColumnNum';

/**
 * External dependencies
 */
import { isNumber, round } from 'lodash';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getColumnSizeStyles = (obj, rowGapProps, clientId) => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		const fitContent = obj[`column-fit-content-${breakpoint}`];
		let columnSize = obj[`column-size-${breakpoint}`];

		if (fitContent) {
			response[breakpoint] = {
				width: 'fit-content',
				'flex-basis': 'fit-content',
			};
		} else if (
			isNumber(columnSize) ||
			isNumber(rowGapProps?.[`column-gap-${breakpoint}`])
		) {
			const columnNum = getColumnNum(
				rowGapProps?.columnsSize,
				clientId,
				breakpoint
			);

			const gapNum = columnNum - 1;
			const gap =
				(getLastBreakpointAttribute({
					target: 'column-gap',
					breakpoint,
					attributes: rowGapProps,
				}) *
					gapNum) /
				columnNum;

			console.log(gap);
			const gapUnit = getLastBreakpointAttribute({
				target: 'column-gap-unit',
				breakpoint,
				attributes: rowGapProps,
			});

			if (!columnSize)
				columnSize = getLastBreakpointAttribute({
					target: 'column-size',
					breakpoint,
					attributes: obj,
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

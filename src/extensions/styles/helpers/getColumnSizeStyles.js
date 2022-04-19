/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

/**
 * External dependencies
 */
import { isNumber, round } from 'lodash';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getColumnSizeStyles = (obj, rowProps) => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		const fitContent = obj[`column-fit-content-${breakpoint}`];
		const columnSize = obj[`column-size-${breakpoint}`];

		if (fitContent) {
			response[breakpoint] = {
				width: 'fit-content',
				'flex-basis': 'fit-content',
			};
		} else if (isNumber(columnSize)) {
			const gap = getLastBreakpointAttribute({
				target: 'column-gap',
				breakpoint,
				attributes: rowProps,
			});
			const gapUnit = getLastBreakpointAttribute({
				target: 'column-gap-unit',
				breakpoint,
				attributes: rowProps,
			});
			const rowElements = rowProps.rowElements.length;

			const gapValue = gap
				? `${round(gap / rowElements, 2)}${gapUnit}`
				: '0px';

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

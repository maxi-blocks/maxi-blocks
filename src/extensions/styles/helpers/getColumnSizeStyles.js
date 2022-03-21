/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * External dependencies
 */
import { isNumber } from 'lodash';

const getColumnSizeStyles = obj => {
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
			response[breakpoint] = {
				width: `${columnSize}%`,
				'flex-basis': `${columnSize}%`,
			};
		}
	});

	return response;
};

export default getColumnSizeStyles;

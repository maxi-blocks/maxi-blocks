/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * External dependencies
 */
import { isFinite } from 'lodash';

const getColumnSizeStyles = obj => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		const column = obj[`column-size-${breakpoint}`];

		if (isFinite(parseFloat(column))) {
			response[breakpoint] = {
				width: `${parseFloat(column)}%`,
				'flex-basis': `${parseFloat(column)}%`,
			};
		} else if (column === 'auto') {
			response[breakpoint] = {
				width: 'fit-content',
				'flex-basis': 'fit-content',
			};
		}
	});

	return response;
};

export default getColumnSizeStyles;

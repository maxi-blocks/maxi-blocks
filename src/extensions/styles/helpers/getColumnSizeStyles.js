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
		if (isNumber(obj[`column-size-${breakpoint}`])) {
			response[breakpoint] = {
				width: `${obj[`column-size-${breakpoint}`]}%`,
			};
			response[breakpoint] = {
				'flex-basis': `${obj[`column-size-${breakpoint}`]}%`,
			};
		}
	});

	return response;
};

export default getColumnSizeStyles;

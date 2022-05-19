/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

import { isNil } from 'lodash';
/**
 * Generates size styles object
 *
 * @param {Object} obj Block size properties
 */
const getTransitionStyles = obj => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {
			'transition-duration':
				!isNil(obj[`transition-duration-${breakpoint}`]) &&
				`${obj[`transition-duration-${breakpoint}`]}s`,
			'transition-delay':
				!isNil(obj[`transition-delay-${breakpoint}`]) &&
				`${obj[`transition-delay-${breakpoint}`]}s`,
			'transition-timing-function':
				!isNil(obj[`transition-timing-function-${breakpoint}`]) &&
				obj[`transition-timing-function-${breakpoint}`],
		};
	});

	return response;
};

export default getTransitionStyles;

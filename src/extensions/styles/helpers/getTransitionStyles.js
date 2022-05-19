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
			...(!isNil(obj[`transition-duration-${breakpoint}`]) && {
				'transition-duration': `${
					obj[`transition-duration-${breakpoint}`]
				}s`,
			}),
			...(!isNil(obj[`transition-delay-${breakpoint}`]) && {
				'transition-delay': `${obj[`transition-delay-${breakpoint}`]}s`,
			}),
			...(!isNil(obj[`transition-timing-function-${breakpoint}`]) && {
				'transition-timing-function':
					obj[`transition-timing-function-${breakpoint}`],
			}),
		};
	});

	return response;
};

export default getTransitionStyles;

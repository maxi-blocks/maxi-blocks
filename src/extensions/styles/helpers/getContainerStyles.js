/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Generates size styles object
 *
 * @param {Object} obj Block size properties
 */
const getContainerStyles = obj => {
	const response = {};
	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {
			...(obj[`container-max-width-${breakpoint}`] && {
				'max-width': `${
					obj[`container-max-width-${breakpoint}`]
				}${getLastBreakpointAttribute({
					target: 'container-max-width-unit',
					breakpoint,
					attributes: obj,
				})}`,
			}),
			...(obj[`container-width-${breakpoint}`] && {
				width: `${
					obj[`container-width-${breakpoint}`]
				}${getLastBreakpointAttribute({
					target: 'container-width-unit',
					breakpoint,
					attributes: obj,
				})}`,
			}),
		};
	});

	return response;
};

export default getContainerStyles;

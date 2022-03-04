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
				}${getLastBreakpointAttribute(
					'container-max-width-unit',
					breakpoint,
					obj
				)}`,
			}),
			...(obj[`container-width-${breakpoint}`] && {
				width: `${
					obj[`container-width-${breakpoint}`]
				}${getLastBreakpointAttribute(
					'container-width-unit',
					breakpoint,
					obj
				)}`,
			}),
		};
	});

	return response;
};

export default getContainerStyles;

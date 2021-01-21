/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../getLastBreakpointValue';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Generates size styles object
 *
 * @param {Object} obj Block size properties
 */
const getSizeStyles = obj => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {
			...(obj[`max-width-${breakpoint}`] && {
				'max-width':
					obj[`max-width-${breakpoint}`] +
					getLastBreakpointAttribute(
						'max-width-unit',
						breakpoint,
						obj
					),
			}),
			...(obj[`width-${breakpoint}`] && {
				width:
					obj[`width-${breakpoint}`] +
					getLastBreakpointAttribute('width-unit', breakpoint, obj),
			}),
			...(obj[`min-width-${breakpoint}`] && {
				'min-width':
					obj[`min-width-${breakpoint}`] +
					getLastBreakpointAttribute(
						'min-width-unit',
						breakpoint,
						obj
					),
			}),
			...(obj[`max-height-${breakpoint}`] && {
				'max-height':
					obj[`max-height-${breakpoint}`] +
					getLastBreakpointAttribute(
						'max-height-unit',
						breakpoint,
						obj
					),
			}),
			...(obj[`height-${breakpoint}`] && {
				height:
					obj[`height-${breakpoint}`] +
					getLastBreakpointAttribute('height-unit', breakpoint, obj),
			}),
			...(obj[`min-height-${breakpoint}`] && {
				'min-height':
					obj[`min-height-${breakpoint}`] +
					getLastBreakpointAttribute(
						'min-height-unit',
						breakpoint,
						obj
					),
			}),
		};
	});

	return response;
};

export default getSizeStyles;

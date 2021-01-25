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
const getSizeStyles = (obj, prefix) => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {
			...(obj[`${prefix ? prefix : ''}max-width-${breakpoint}`] && {
				'max-width':
					obj[`${prefix ? prefix : ''}max-width-${breakpoint}`] +
					getLastBreakpointAttribute(
						`${prefix ? prefix : ''}max-width-unit`,
						breakpoint,
						obj
					),
			}),
			...(obj[`${prefix ? prefix : ''}width-${breakpoint}`] && {
				width:
					obj[`${prefix ? prefix : ''}width-${breakpoint}`] +
					getLastBreakpointAttribute(
						`${prefix ? prefix : ''}width-unit`,
						breakpoint,
						obj
					),
			}),
			...(obj[`${prefix ? prefix : ''}min-width-${breakpoint}`] && {
				'min-width':
					obj[`${prefix ? prefix : ''}min-width-${breakpoint}`] +
					getLastBreakpointAttribute(
						`${prefix ? prefix : ''}min-width-unit`,
						breakpoint,
						obj
					),
			}),
			...(obj[`${prefix ? prefix : ''}max-height-${breakpoint}`] && {
				'max-height':
					obj[`${prefix ? prefix : ''}max-height-${breakpoint}`] +
					getLastBreakpointAttribute(
						`${prefix ? prefix : ''}max-height-unit`,
						breakpoint,
						obj
					),
			}),
			...(obj[`${prefix ? prefix : ''}height-${breakpoint}`] && {
				height:
					obj[`${prefix ? prefix : ''}height-${breakpoint}`] +
					getLastBreakpointAttribute(
						`${prefix ? prefix : ''}height-unit`,
						breakpoint,
						obj
					),
			}),
			...(obj[`${prefix ? prefix : ''}min-height-${breakpoint}`] && {
				'min-height':
					obj[`${prefix ? prefix : ''}min-height-${breakpoint}`] +
					getLastBreakpointAttribute(
						`${prefix ? prefix : ''}min-height-unit`,
						breakpoint,
						obj
					),
			}),
		};
	});

	return response;
};

export default getSizeStyles;

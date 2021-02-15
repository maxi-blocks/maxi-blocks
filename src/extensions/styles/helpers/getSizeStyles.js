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
const getSizeStyles = (obj, prefix = '') => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {
			...(obj[`${prefix}max-width-${breakpoint}`] && {
				'max-width':
					obj[`${prefix}max-width-${breakpoint}`] +
					getLastBreakpointAttribute(
						`${prefix}max-width-unit`,
						breakpoint,
						obj
					),
			}),
			...(obj[`${prefix}width-${breakpoint}`] && {
				width:
					obj[`${prefix}width-${breakpoint}`] +
					getLastBreakpointAttribute(
						`${prefix}width-unit`,
						breakpoint,
						obj
					),
			}),
			...(obj[`${prefix}min-width-${breakpoint}`] && {
				'min-width':
					obj[`${prefix}min-width-${breakpoint}`] +
					getLastBreakpointAttribute(
						`${prefix}min-width-unit`,
						breakpoint,
						obj
					),
			}),
			...(obj[`${prefix}max-height-${breakpoint}`] && {
				'max-height':
					obj[`${prefix}max-height-${breakpoint}`] +
					getLastBreakpointAttribute(
						`${prefix}max-height-unit`,
						breakpoint,
						obj
					),
			}),
			...(obj[`${prefix}height-${breakpoint}`] && {
				height:
					obj[`${prefix}height-${breakpoint}`] +
					getLastBreakpointAttribute(
						`${prefix}height-unit`,
						breakpoint,
						obj
					),
			}),
			...(obj[`${prefix}min-height-${breakpoint}`] && {
				'min-height':
					obj[`${prefix}min-height-${breakpoint}`] +
					getLastBreakpointAttribute(
						`${prefix}min-height-unit`,
						breakpoint,
						obj
					),
			}),
		};
	});

	return response;
};

export default getSizeStyles;

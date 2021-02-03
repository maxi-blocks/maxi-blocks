/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../getLastBreakpointValue';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Generates size styles object
 *
 * @param {Object} obj Block size properties
 */
const getTypographyStyles = (obj, isHover = false, prefix = '') => {
	const response = {};

	const getName = (target, breakpoint) =>
		`${prefix}${target}-${breakpoint}${isHover ? '-hover' : ''}`;

	breakpoints.forEach(breakpoint => {
		const typography = {
			...(obj[getName('font-family', breakpoint)] && {
				'font-family': obj[getName('font-family', breakpoint)],
			}),
			...(obj[getName('color', breakpoint)] && {
				color: obj[getName('color', breakpoint)],
			}),
			...(obj[getName('font-size', breakpoint)] && {
				'font-size': `${
					obj[getName('font-size', breakpoint)]
				}${getLastBreakpointAttribute(
					`${prefix}font-size-unit`,
					breakpoint,
					obj
				)}`,
			}),
			...(obj[getName('line-height', breakpoint)] && {
				'line-height': `${obj[getName('line-height', breakpoint)]}${
					getLastBreakpointAttribute(
						`${prefix}line-height-unit`,
						breakpoint,
						obj
					) || ''
				}`,
			}),
			...(obj[getName('letter-spacing', breakpoint)] && {
				'letter-spacing': `${
					obj[getName('letter-spacing', breakpoint)]
				}${getLastBreakpointAttribute(
					`${prefix}letter-spacing-unit`,
					breakpoint,
					obj
				)}`,
			}),
			...(obj[getName('font-weight', breakpoint)] && {
				'font-weight': obj[getName('font-weight', breakpoint)],
			}),
			...(obj[getName('text-transform', breakpoint)] && {
				'text-transform': obj[getName('text-transform', breakpoint)],
			}),
			...(obj[getName('font-style', breakpoint)] && {
				'font-style': obj[getName('font-style', breakpoint)],
			}),
			...(obj[getName('text-decoration', breakpoint)] && {
				'text-decoration': obj[getName('text-decoration', breakpoint)],
			}),
			...(obj[getName('text-shadow', breakpoint)] && {
				'text-shadow': obj[getName('text-shadow', breakpoint)],
			}),
			...(obj[getName('vertical-align', breakpoint)] && {
				'vertical-align': obj[getName('vertical-align', breakpoint)],
			}),
		};

		if (!isEmpty(typography)) response[breakpoint] = typography;
	});

	return response;
};

export default getTypographyStyles;

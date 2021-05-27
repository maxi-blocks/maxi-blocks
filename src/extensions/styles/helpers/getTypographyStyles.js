/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

/**
 * External dependencies
 */
import { isEmpty, isNil } from 'lodash';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Generates size styles object
 *
 * @param {Object} obj Block size properties
 */
const getTypographyStyles = (
	obj,
	isHover = false,
	prefix = '',
	customFormatTypography = false
) => {
	const response = {};

	const isCustomFormat = !!customFormatTypography;

	const getName = (target, breakpoint) =>
		`${prefix}${target}-${breakpoint}${
			!isCustomFormat && isHover ? '-hover' : ''
		}`;

	breakpoints.forEach(breakpoint => {
		const typography = {
			...(!isNil(obj[getName('font-family', breakpoint)]) && {
				'font-family': obj[getName('font-family', breakpoint)],
			}),
			...(!isNil(obj[getName('color', breakpoint)]) && {
				color: obj[getName('color', breakpoint)],
			}),
			...(!isNil(obj[getName('font-size', breakpoint)]) && {
				'font-size': `${
					obj[getName('font-size', breakpoint)]
				}${getLastBreakpointAttribute(
					`${prefix}font-size-unit`,
					breakpoint,
					isCustomFormat ? customFormatTypography : obj
				)}`,
			}),
			...(!isNil(obj[getName('line-height', breakpoint)]) && {
				'line-height': `${obj[getName('line-height', breakpoint)]}${
					getLastBreakpointAttribute(
						`${prefix}line-height-unit`,
						breakpoint,
						isCustomFormat ? customFormatTypography : obj
					) || ''
				}`,
			}),
			...(!isNil(obj[getName('letter-spacing', breakpoint)]) && {
				'letter-spacing': `${
					obj[getName('letter-spacing', breakpoint)]
				}${getLastBreakpointAttribute(
					`${prefix}letter-spacing-unit`,
					breakpoint,
					isCustomFormat ? customFormatTypography : obj
				)}`,
			}),
			...(!isNil(obj[getName('font-weight', breakpoint)]) && {
				'font-weight': obj[getName('font-weight', breakpoint)],
			}),
			...(!isNil(obj[getName('text-transform', breakpoint)]) && {
				'text-transform': obj[getName('text-transform', breakpoint)],
			}),
			...(!isNil(obj[getName('font-style', breakpoint)]) && {
				'font-style': obj[getName('font-style', breakpoint)],
			}),
			...(!isNil(obj[getName('text-decoration', breakpoint)]) && {
				'text-decoration': obj[getName('text-decoration', breakpoint)],
			}),
			...(!isNil(obj[getName('text-shadow', breakpoint)]) && {
				'text-shadow': obj[getName('text-shadow', breakpoint)],
			}),
			...(!isNil(obj[getName('vertical-align', breakpoint)]) && {
				'vertical-align': obj[getName('vertical-align', breakpoint)],
			}),
		};

		if (!isEmpty(typography)) response[breakpoint] = typography;
	});

	return response;
};

export default getTypographyStyles;

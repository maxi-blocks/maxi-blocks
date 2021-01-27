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
const getTypographyStyles = (obj, isHover = false) => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		const typography = {
			...(obj[`font-family-${breakpoint}${isHover ? '-hover' : ''}`] && {
				'font-family':
					obj[`font-family-${breakpoint}${isHover ? '-hover' : ''}`],
			}),
			...(obj[`color-${breakpoint}${isHover ? '-hover' : ''}`] && {
				color: obj[`color-${breakpoint}${isHover ? '-hover' : ''}`],
			}),
			...(obj[`font-size-${breakpoint}${isHover ? '-hover' : ''}`] && {
				'font-size': `${
					obj[`font-size-${breakpoint}${isHover ? '-hover' : ''}`]
				}${getLastBreakpointAttribute(
					'font-size-unit',
					breakpoint,
					obj
				)}`,
			}),
			...(obj[`line-height-${breakpoint}${isHover ? '-hover' : ''}`] && {
				'line-height': `${
					obj[`line-height-${breakpoint}${isHover ? '-hover' : ''}`]
				}${
					getLastBreakpointAttribute(
						'line-height-unit',
						breakpoint,
						obj
					) || ''
				}`,
			}),
			...(obj[
				`letter-spacing-${breakpoint}${isHover ? '-hover' : ''}`
			] && {
				'letter-spacing': `${
					obj[
						`letter-spacing-${breakpoint}${isHover ? '-hover' : ''}`
					]
				}${getLastBreakpointAttribute(
					'letter-spacing-unit',
					breakpoint,
					obj
				)}`,
			}),
			...(obj[`font-weight-${breakpoint}${isHover ? '-hover' : ''}`] && {
				'font-weight':
					obj[`font-weight-${breakpoint}${isHover ? '-hover' : ''}`],
			}),
			...(obj[
				`text-transform-${breakpoint}${isHover ? '-hover' : ''}`
			] && {
				'text-transform':
					obj[
						`text-transform-${breakpoint}${isHover ? '-hover' : ''}`
					],
			}),
			...(obj[`font-style-${breakpoint}${isHover ? '-hover' : ''}`] && {
				'font-style':
					obj[`font-style-${breakpoint}${isHover ? '-hover' : ''}`],
			}),
			...(obj[
				`text-decoration-${breakpoint}${isHover ? '-hover' : ''}`
			] && {
				'text-decoration':
					obj[
						`text-decoration-${breakpoint}${
							isHover ? '-hover' : ''
						}`
					],
			}),
			...(obj[`text-shadow-${breakpoint}${isHover ? '-hover' : ''}`] && {
				'text-shadow':
					obj[`text-shadow-${breakpoint}${isHover ? '-hover' : ''}`],
			}),
			...(obj[
				`vertical-align-${breakpoint}${isHover ? '-hover' : ''}`
			] && {
				'vertical-align':
					obj[
						`vertical-align-${breakpoint}${isHover ? '-hover' : ''}`
					],
			}),
		};

		if (!isEmpty(typography)) response[breakpoint] = typography;
	});

	return response;
};

export default getTypographyStyles;

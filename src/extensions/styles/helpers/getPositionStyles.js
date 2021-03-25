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
const getPositionStyles = obj => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		if (!isEmpty(obj[`position-${breakpoint}`]))
			response[breakpoint] = {
				position: obj[`position-${breakpoint}`],
				...(!isNil(
					getLastBreakpointAttribute('position-top', breakpoint, obj)
				) && {
					top:
						getLastBreakpointAttribute(
							'position-top',
							breakpoint,
							obj
						) +
						getLastBreakpointAttribute(
							'position-unit',
							breakpoint,
							obj
						),
				}),
				...(!isNil(
					getLastBreakpointAttribute(
						'position-right',
						breakpoint,
						obj
					)
				) && {
					right:
						getLastBreakpointAttribute(
							'position-right',
							breakpoint,
							obj
						) +
						getLastBreakpointAttribute(
							'position-unit',
							breakpoint,
							obj
						),
				}),
				...(!isNil(
					getLastBreakpointAttribute(
						'position-bottom',
						breakpoint,
						obj
					)
				) && {
					bottom:
						getLastBreakpointAttribute(
							'position-bottom',
							breakpoint,
							obj
						) +
						getLastBreakpointAttribute(
							'position-unit',
							breakpoint,
							obj
						),
				}),
				...(!isNil(
					getLastBreakpointAttribute('position-left', breakpoint, obj)
				) && {
					left:
						getLastBreakpointAttribute(
							'position-left',
							breakpoint,
							obj
						) +
						getLastBreakpointAttribute(
							'position-unit',
							breakpoint,
							obj
						),
				}),
			};
	});

	return response;
};

export default getPositionStyles;

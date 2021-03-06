/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

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
const getPositionStyles = obj => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		if (!isEmpty(obj[`position-${breakpoint}`]))
			response[breakpoint] = {
				position: obj[`position-${breakpoint}`],
				...(getLastBreakpointAttribute(
					'position-top',
					breakpoint,
					obj
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
				...(getLastBreakpointAttribute(
					'position-right',
					breakpoint,
					obj
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
				...(getLastBreakpointAttribute(
					'position-bottom',
					breakpoint,
					obj
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
				...(getLastBreakpointAttribute(
					'position-left',
					breakpoint,
					obj
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

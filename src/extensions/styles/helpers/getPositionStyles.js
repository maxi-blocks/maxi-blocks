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
		const getValue = direction => {
			const val = getLastBreakpointAttribute({
				target: `position-${direction}`,
				breakpoint,
				attributes: obj,
			});

			return val;
		};

		const position = obj[`position-${breakpoint}`];
		const top = getValue('top');
		const right = getValue('right');
		const bottom = getValue('bottom');
		const left = getValue('left');
		const unit = getLastBreakpointAttribute({
			target: 'position-unit',
			breakpoint,
			attributes: obj,
		});

		response[breakpoint] = {
			...(position && { position }),
			...(!isNil(top) && {
				top: getValue('top') + unit,
			}),
			...(!isNil(right) && {
				right: getValue('right') + unit,
			}),
			...(!isNil(bottom) && {
				bottom: getValue('bottom') + unit,
			}),
			...(!isNil(left) && {
				left: getValue('left') + unit,
			}),
		};

		if (isEmpty(response[breakpoint])) delete response[breakpoint];
	});

	return response;
};

export default getPositionStyles;

/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

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
	const keyWords = ['top', 'right', 'bottom', 'left'];
	const response = {};

	breakpoints.forEach(breakpoint => {
		const position = obj[`position-${breakpoint}`];

		if (position) {
			response[breakpoint] = {
				position,
			};

			keyWords.forEach(keyWord => {
				const value = getLastBreakpointAttribute({
					target: `position-${keyWord}`,
					breakpoint,
					attributes: obj,
				});

				const unit = getLastBreakpointAttribute({
					target: `position-${keyWord}-unit`,
					breakpoint,
					attributes: obj,
				});

				if (!isNil(value) && !isNil(unit)) {
					response[breakpoint][`${keyWord}`] = `${value}${unit}`;
				}
			});
		}
	});

	return response;
};

export default getPositionStyles;

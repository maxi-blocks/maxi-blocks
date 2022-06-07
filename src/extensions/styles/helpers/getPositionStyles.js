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
	const keyWords = ['top', 'right', 'bottom', 'left'];
	const response = {};

	breakpoints.forEach(breakpoint => {
		const position = getLastBreakpointAttribute({
			target: 'position',
			breakpoint,
			attributes: obj,
		});

		response[breakpoint] = {};

		if (!isNil(position)) {
			response[breakpoint] = {
				position,
			};
		}

		keyWords.forEach(keyWord => {
			const value =
				position !== 'inherit'
					? getLastBreakpointAttribute({
							target: `position-${keyWord}`,
							breakpoint,
							attributes: obj,
					  })
					: '0';

			const unit = getLastBreakpointAttribute({
				target: `position-${keyWord}-unit`,
				breakpoint,
				attributes: obj,
			});

			if (!isNil(value) && !isNil(unit))
				response[breakpoint][keyWord] =
					value !== 'auto' ? `${value}${unit}` : value;
		});

		if (isEmpty(response[breakpoint])) delete response[breakpoint];
	});

	return response;
};

export default getPositionStyles;

/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../../attributes/getLastBreakpointAttribute';

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
	const axis = ['.t', '.r', '.b', '.l'];
	const keyWords = {
		'.t': 'top',
		'.r': 'right',
		'.b': 'bottom',
		'.l': 'left',
	};
	const response = {};
	let omitPositionStyle = true;

	breakpoints.forEach(breakpoint => {
		const position = getLastBreakpointAttribute({
			target: '_pos',
			breakpoint,
			attributes: obj,
		});
		omitPositionStyle = omitPositionStyle ? position === 'inherit' : false;

		response[breakpoint] = {};

		if (!isNil(position) && !omitPositionStyle) {
			response[breakpoint] = {
				position,
			};
		}

		axis.forEach(axis => {
			const lastBreakpointValue = getLastBreakpointAttribute({
				target: `_pos${axis}`,
				breakpoint,
				attributes: obj,
			});

			const value = position !== 'inherit' ? lastBreakpointValue : null;

			const unit = getLastBreakpointAttribute({
				target: `_pos${axis}.u`,
				breakpoint,
				attributes: obj,
			});

			if (!isNil(value) && !isNil(unit) && !omitPositionStyle)
				response[breakpoint][keyWords[axis]] =
					value !== 'auto' ? `${value}${unit}` : value;
		});

		if (isEmpty(response[breakpoint])) delete response[breakpoint];
	});

	return response;
};

export default getPositionStyles;

/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

/**
 * External dependencies
 */
import { isNumber, isNil } from 'lodash';

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
		const getValue = target => {
			if (
				isNumber(obj[`${prefix}${target}-${breakpoint}`]) ||
				obj[`${prefix}${target}-unit-${breakpoint}`]
			) {
				const num = getLastBreakpointAttribute(
					`${prefix}${target}`,
					breakpoint,
					obj
				);
				const unit = getLastBreakpointAttribute(
					`${prefix}${target}-unit`,
					breakpoint,
					obj
				);

				if (!isNil(num) && !isNil(unit))
					return { [target]: num + unit };
			}

			return {};
		};

		response[breakpoint] = {
			...getValue('max-width'),
			...getValue('width'),
			...getValue('min-width'),
			...getValue('max-height'),
			...getValue('height'),
			...getValue('min-height'),
		};
	});

	return response;
};

export default getSizeStyles;

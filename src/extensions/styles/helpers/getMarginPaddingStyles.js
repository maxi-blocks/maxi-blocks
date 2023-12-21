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

const getMarginPaddingStyles = ({ obj, prefix = '' }) => {
	const keyWords = ['top', 'right', 'bottom', 'left'];
	const response = {};

	for (const breakpoint of breakpoints) {
		response[breakpoint] = {};
		for (const type of ['margin', 'padding']) {
			for (const key of keyWords) {
				const attributeName = `${prefix}${type}-${key}`;
				const lastValue = getLastBreakpointAttribute({
					target: attributeName,
					breakpoint,
					attributes: obj,
				});
				const lastUnit = getLastBreakpointAttribute({
					target: `${attributeName}-unit`,
					breakpoint,
					attributes: obj,
				});
				const value = obj[`${attributeName}-${breakpoint}`];
				const unit = obj[`${attributeName}-unit-${breakpoint}`]; // Note the correction here

				// Refine comparison logic to handle cases where the value remains constant across breakpoints but the unit changes
				if (!isNil(lastValue)) {
					const isValueEqual = lastValue === value;
					const isUnitEqual = lastUnit === unit;
					const shouldSetResponse = isValueEqual || isUnitEqual;

					if (shouldSetResponse) {
						response[breakpoint][`${type}-${key}`] =
							lastValue === 'auto'
								? 'auto'
								: `${lastValue}${lastUnit}`;
					}
				}

				if (value === '') {
					delete response[breakpoint][`${type}-${key}`];
				}
			}
		}
	}

	return response;
};

export default getMarginPaddingStyles;

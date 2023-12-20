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
				const unit = obj[`${attributeName}-${breakpoint}-unit`];

				if (
					!isNil(lastValue) &&
					(lastValue === value || lastUnit === unit)
				) {
					response[breakpoint][`${type}-${key}`] =
						lastValue === 'auto'
							? 'auto'
							: `${lastValue}${lastUnit}`;
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

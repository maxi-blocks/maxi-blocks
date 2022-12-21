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
	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		['margin', 'padding'].forEach(type => {
			keyWords.forEach(key => {
				const value = getLastBreakpointAttribute({
					target: `${prefix}${type}-${key}`,
					breakpoint,
					attributes: obj,
				});
				const unit =
					getLastBreakpointAttribute({
						target: `${prefix}${type}-${key}-unit`,
						breakpoint,
						attributes: obj,
					}) || 'px';

				if (!isNil(value))
					response[breakpoint][`${type}-${key}`] =
						value === 'auto' ? 'auto' : `${value}${unit}`;
			});
		});
	});

	return response;
};

export default getMarginPaddingStyles;

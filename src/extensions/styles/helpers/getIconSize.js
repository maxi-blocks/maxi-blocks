/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getIconSize = (obj, isHover = false, prefix = '') => {
	const response = {
		label: 'Icon size',
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		const iconSize =
			getLastBreakpointAttribute({
				target: `${prefix}icon-width`,
				isHover,
				breakpoint,
				attributes: obj,
			}) ??
			getLastBreakpointAttribute({
				target: `${prefix}icon-height`,
				isHover,
				breakpoint,
				attributes: obj,
			});

		const iconUnit =
			getLastBreakpointAttribute({
				target: `${prefix}icon-width-unit`,
				isHover,
				breakpoint,
				attributes: obj,
			}) ??
			getLastBreakpointAttribute({
				target: `${prefix}icon-height-unit`,
				isHover,
				breakpoint,
				attributes: obj,
			}) ??
			'px';

		if (!isNil(iconSize) && !isEmpty(iconSize)) {
			response[breakpoint].height = `${iconSize}${iconUnit}`;
			response[breakpoint].width = `${iconSize}${iconUnit}`;
		}

		if (isEmpty(response[breakpoint]) && breakpoint !== 'general')
			delete response[breakpoint];
	});

	return { iconSize: response };
};

export default getIconSize;

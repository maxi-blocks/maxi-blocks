/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';

/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

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
				target: 'icon-width',
				isHover,
				breakpoint,
				prefix,
				props: obj,
			}) ??
			getLastBreakpointAttribute({
				target: 'icon-height',
				isHover,
				breakpoint,
				prefix,
				props: obj,
			});

		const iconUnit =
			getLastBreakpointAttribute({
				target: 'icon-width-unit',
				isHover,
				breakpoint,
				prefix,
				props: obj,
			}) ??
			getLastBreakpointAttribute({
				target: 'icon-height-unit',
				isHover,
				breakpoint,
				prefix,
				props: obj,
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

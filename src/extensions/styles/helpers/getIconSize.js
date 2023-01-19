/**
 * Internal dependencies
 */
import getAttributeKey from '../getAttributeKey';

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
			obj[getAttributeKey('icon-width', isHover, prefix, breakpoint)] ??
			obj[getAttributeKey('icon-height', isHover, prefix, breakpoint)];

		const iconUnit =
			obj[
				getAttributeKey('icon-width-unit', isHover, prefix, breakpoint)
			] ??
			obj[
				getAttributeKey('icon-height-unit', isHover, prefix, breakpoint)
			] ??
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

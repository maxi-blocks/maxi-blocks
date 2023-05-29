/**
 * Internal dependencies
 */
import getAttributeKey from '../../attributes/getAttributeKey';

/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';

const breakpoints = ['g', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getIconPathStyles = (obj, isHover = false, prefix = '') => {
	const response = {
		label: 'Icon path',
		g: {},
	};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		const iconStroke =
			obj[getAttributeKey({ key: 'i_str', isHover, prefix, breakpoint })];

		if (!isNil(iconStroke)) {
			response[breakpoint]['stroke-width'] = iconStroke;
		}

		if (isEmpty(response[breakpoint]) && breakpoint !== 'g')
			delete response[breakpoint];
	});

	return { iconPath: response };
};

export default getIconPathStyles;

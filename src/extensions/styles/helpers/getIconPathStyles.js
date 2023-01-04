/**
 * Internal dependencies
 */
import getAttributeValue from '../getAttributeValue';

/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getIconPathStyles = (obj, isHover = false, prefix = '') => {
	const response = {
		label: 'Icon path',
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		const iconStroke = getAttributeValue({
			target: 'icon-stroke',
			prefix,
			isHover,
			breakpoint,
			props: obj,
		});

		if (!isNil(iconStroke)) {
			response[breakpoint]['stroke-width'] = iconStroke;
		}

		if (isEmpty(response[breakpoint]) && breakpoint !== 'general')
			delete response[breakpoint];
	});

	return { iconPath: response };
};

export default getIconPathStyles;

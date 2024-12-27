/**
 * Internal dependencies
 */
import getAttributeKey from '@extensions/styles/getAttributeKey';

/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';

// Move breakpoints outside the function to avoid recreating it on each call
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getIconPathStyles = (obj, isHover = false, prefix = '') => {
	const response = {
		label: 'Icon path',
		general: {},
	};

	// Use for...of loop instead of forEach for better performance
	for (const breakpoint of breakpoints) {
		const iconStroke =
			obj[getAttributeKey('icon-stroke', isHover, prefix, breakpoint)];

		// Only create the breakpoint object if iconStroke is not null or undefined
		if (!isNil(iconStroke)) {
			response[breakpoint] = { 'stroke-width': iconStroke };
		}
	}

	// Remove empty breakpoint objects after the loop
	for (const breakpoint of breakpoints) {
		if (breakpoint !== 'general' && isEmpty(response[breakpoint])) {
			delete response[breakpoint];
		}
	}

	return { iconPath: response };
};

export default getIconPathStyles;

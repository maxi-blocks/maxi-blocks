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

		if (
			!isNil(
				obj[
					`${prefix}icon-stroke-${breakpoint}${
						isHover ? '-hover' : ''
					}`
				]
			)
		) {
			response[breakpoint]['stroke-width'] = `${
				obj[
					`${prefix}icon-stroke-${breakpoint}${
						isHover ? '-hover' : ''
					}`
				]
			}`;
		}

		if (isEmpty(response[breakpoint]) && breakpoint !== 'general')
			delete response[breakpoint];
	});

	return { iconPath: response };
};

export default getIconPathStyles;

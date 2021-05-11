/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const getAlignmentFlexStyles = obj => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		if (!isEmpty(obj[`alignment-${breakpoint}`]))
			switch (obj[`alignment-${breakpoint}`]) {
				case 'left':
					response[breakpoint] = {
						'align-items': 'flex-start',
					};
					break;
				case 'center':
				case 'justify':
					response[breakpoint] = {
						'align-items': 'center',
					};
					break;
				case 'right':
					response[breakpoint] = {
						'align-items': 'flex-end',
					};
					break;
				default:
					return false;
			}
	});

	return response;
};

export default getAlignmentFlexStyles;

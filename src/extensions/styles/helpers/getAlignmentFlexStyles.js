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
						'justify-content': 'flex-start',
					};
					break;
				case 'center':
				case 'justify':
					response[breakpoint] = {
						'justify-content': 'center',
					};
					break;
				case 'right':
					response[breakpoint] = {
						'justify-content': 'flex-end',
					};
					break;
				default:
					break;
			}
	});

	return response;
};

export default getAlignmentFlexStyles;

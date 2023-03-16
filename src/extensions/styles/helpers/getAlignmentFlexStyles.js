/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Internal dependencies
 */
import getAttributesValue from '../getAttributesValue';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const getAlignmentFlexStyles = obj => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		const value = getAttributesValue({
			target: 'alignment',
			props: obj,
			breakpoint,
		});

		if (isEmpty(value)) return;

		switch (value) {
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

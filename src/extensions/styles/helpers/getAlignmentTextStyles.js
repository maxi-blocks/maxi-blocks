/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Internal dependencies
 */
import getAttributeValue from '../getAttributeValue';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const getAlignmentTextStyles = (obj, type = 'text') => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		const value = getAttributeValue({
			target: 'text-alignment',
			props: obj,
			breakpoint,
		});

		if (isEmpty(value)) return;

		switch (obj[`ta-${breakpoint}`]) {
			case 'left':
				response[breakpoint] = {
					'text-align': 'left',
				};
				break;
			case 'center':
				type === 'list'
					? (response[breakpoint] = {
							'list-style-position':
								type === 'list' ? 'inside' : 'initial',
					  })
					: (response[breakpoint] = {
							'text-align': 'center',
					  });
				break;
			case 'justify':
				response[breakpoint] = {
					'text-align': 'justify',
				};
				break;
			case 'right':
				type === 'list'
					? (response[breakpoint] = {
							'list-style-position':
								type === 'list' ? 'inside' : 'initial',
					  })
					: (response[breakpoint] = {
							'text-align': 'right',
					  });
				break;
			default:
				break;
		}
	});

	return response;
};

export default getAlignmentTextStyles;

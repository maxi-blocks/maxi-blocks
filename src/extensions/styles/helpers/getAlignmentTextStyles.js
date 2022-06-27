/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getAlignmentTextStyles = (obj, type = 'text') => {
	const response = {};

	let omitTextAlignment = true;

	breakpoints.forEach(breakpoint => {
		const textAlignment = getLastBreakpointAttribute({
			target: 'text-alignment',
			breakpoint,
			attributes: obj,
		});

		if (!isEmpty(textAlignment)) {
			omitTextAlignment = omitTextAlignment
				? textAlignment === 'left'
				: false;

			switch (textAlignment) {
				case 'left':
					if (!omitTextAlignment)
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
		}
	});

	return response;
};

export default getAlignmentTextStyles;

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const getAlignmentTextStyles = (obj, type = 'text') => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		if (!isEmpty(obj[`text-alignment-${breakpoint}`]))
			switch (obj[`text-alignment-${breakpoint}`]) {
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
					return false;
			}
	});

	return response;
};

export default getAlignmentTextStyles;

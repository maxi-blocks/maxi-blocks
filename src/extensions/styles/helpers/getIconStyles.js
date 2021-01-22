/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const getIconStyles = obj => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		if (obj[`icon-size-${breakpoint}`]) {
			response[breakpoint] = {
				'font-size': `${obj[`icon-size-${breakpoint}`]}${
					obj[`icon-size-unit-${breakpoint}`]
				}`,
			};
		}

		if (!isEmpty(obj['icon-color'])) {
			response.general.color = obj['icon-color'];
		}

		if (obj['icon-spacing']) {
			if (obj['icon-position'] === 'left') {
				response.general['margin-right'] = `${obj['icon-spacing']}px`;
			}

			if (obj['icon-position'] === 'right') {
				response.general['margin-left'] = `${obj['icon-spacing']}px`;
			}
		}
	});

	return response;
};

export default getIconStyles;

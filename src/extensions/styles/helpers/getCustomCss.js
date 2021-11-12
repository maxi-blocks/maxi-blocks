/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Generates custom css object
 *
 * @param {Object} obj Block custom css properties
 */
const getCustomCss = (obj, category, index) => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		let value;
		const customCssValue = getLastBreakpointAttribute(
			'custom-css',
			breakpoint,
			obj
		);

		if (
			customCssValue &&
			customCssValue[category] &&
			customCssValue[category][index]
		)
			value = customCssValue[category][index];

		if (value)
			response[breakpoint] = {
				css: value,
			};
	});

	return response;
};

export default getCustomCss;

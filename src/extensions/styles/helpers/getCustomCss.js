/**
 * Internal dependencies
 */
import { isEmpty } from '@wordpress/rich-text';
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
		let value = '';
		const customCssValue = getLastBreakpointAttribute(
			'custom-css',
			breakpoint,
			obj
		);
		value = customCssValue?.category?.index;

		if (value)
			response[breakpoint] = {
				css: value,
			};
	});

	console.log(response);

	return response;
};

export default getCustomCss;

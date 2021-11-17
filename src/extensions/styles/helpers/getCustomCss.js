/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';
import getGroupAttributes from '../getGroupAttributes';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Generates custom css object
 *
 * @param {Object} obj Block custom css properties
 */
export const getCustomCss = (obj, category, index) => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		const customCssValue = getLastBreakpointAttribute(
			'custom-css',
			breakpoint,
			obj
		);

		const value = customCssValue?.[category]?.[index];

		if (value)
			response[breakpoint] = {
				css: value,
			};
	});

	return response;
};

export const getCustomStyles = (props, type, index) => {
	const response = {
		customCss: getCustomCss(
			{
				...getGroupAttributes(props, 'customCss'),
			},
			type,
			index
		),
	};

	return response;
};

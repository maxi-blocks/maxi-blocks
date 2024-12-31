/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '@extensions/styles/getLastBreakpointAttribute';
import getGroupAttributes from '@extensions/styles/getGroupAttributes';

/**
 * External dependencies
 */
import { isEmpty, cloneDeep } from 'lodash';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getCustomCss = (obj, category, index) => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		const customCssValue = getLastBreakpointAttribute({
			target: 'custom-css',
			breakpoint,
			attributes: obj,
		});

		const value = customCssValue?.[category]?.[index];

		if (value)
			response[breakpoint] = {
				css: value,
			};
	});

	return response;
};

const getCustomStyles = (props, type, index) => {
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

const getCustomCssObject = (selectors, props) => {
	const response = {};

	Object.entries(selectors)?.forEach(element => {
		const category = element?.[0];
		const targets = element?.[1];
		Object.entries(targets)?.forEach(element => {
			const index = element?.[0];
			const target = element?.[1]?.target;
			const css = getCustomStyles(props, category, index);
			if (!isEmpty(css?.customCss)) response[target] = cloneDeep(css);
		});
	});

	return response;
};

export default getCustomCssObject;

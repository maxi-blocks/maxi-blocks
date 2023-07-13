/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';

const BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getStyles = content => {
	if (!content) return false;

	let response = '';

	Object.entries(content).forEach(([key, val]) => {
		if (key.includes('css')) response += `${val}`;
		else response += `${key}:${val};`;
	});

	return response;
};

const getMediaQueryString = (breakpoint, media) =>
	`@media only screen and (${
		breakpoint !== 'xxl' ? 'max-width' : 'min-width'
	}:${
		breakpoint !== 'xxl' ? media : media + 1 // Ensures XXl doesn't affect XL
	}px){`;

const frontendStyleGenerator = styles => {
	if (isNil(styles) || isEmpty(styles)) return false;

	let response = '';

	BREAKPOINTS.forEach(breakpoint => {
		const target = styles?.[0];
		const value = styles?.[1];

		let breakpointResponse = '';
		const { breakpoints, content } = value;

		Object.entries(content).forEach(([suffix, props]) => {
			if (!isNil(props[breakpoint]) && !isEmpty(props[breakpoint])) {
				breakpointResponse += `body.maxi-blocks--active #${target}${suffix}{`;
				breakpointResponse += getStyles(props[breakpoint]);
				breakpointResponse += '}';
			}
		});

		if (!isEmpty(breakpointResponse)) {
			if (breakpoint === 'xxl')
				response += getMediaQueryString(breakpoint, breakpoints.xl);
			else if (breakpoint !== 'general')
				response += getMediaQueryString(
					breakpoint,
					breakpoints[breakpoint]
				);

			response += breakpointResponse;
			if (breakpoint !== 'general') response += '}';
		}
	});

	return response;
};

export default frontendStyleGenerator;

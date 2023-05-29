/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';

const BREAKPOINTS = ['g', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

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
	`@media only screen and (${breakpoint !== 'xxl' ? 'max-width' : '_miw'}:${
		breakpoint !== 'xxl' ? media : media + 1 // Ensures XXl doesn't affect XL
	}px){`;

const frontendStyleGenerator = styles => {
	if (isNil(styles) || isEmpty(styles)) return false;

	let response = '';

	BREAKPOINTS.forEach(breakpoint => {
		Object.entries(styles).forEach(([target, value]) => {
			let breakpointResponse = '';
			const { breakpoints, content } = value;

			Object.entries(content).forEach(([suffix, props]) => {
				const breakpointStyles = props[breakpoint];

				if (!isNil(breakpointStyles) && !isEmpty(breakpointStyles)) {
					breakpointResponse += `body.maxi-blocks--active #${target}${suffix}{`;
					breakpointResponse += getStyles(breakpointStyles);
					breakpointResponse += '}';
				}
			});

			if (!isEmpty(breakpointResponse)) {
				if (breakpoint === 'xxl')
					response += getMediaQueryString(breakpoint, breakpoints.xl);
				else if (breakpoint !== 'g')
					response += getMediaQueryString(
						breakpoint,
						breakpoints[breakpoint]
					);

				response += breakpointResponse;
				if (breakpoint !== 'g') response += '}';
			}
		});
	});

	return response;
};

export default frontendStyleGenerator;

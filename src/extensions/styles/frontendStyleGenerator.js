/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';

const BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getStyles = content => {
	if (!content) return false;

	let response = '';

	Object.entries(content).forEach(([key, val]) => {
		// Ensure we never output undefined in style variables
		const safeKey = key.includes('--maxi-undefined')
			? key.replace('undefined', 'light')
			: key;

		const safeVal =
			typeof val === 'string' && val.includes('--maxi-undefined')
				? val.replace('--maxi-undefined', '--maxi-light')
				: val;

		if (safeKey.includes('css')) {
			// Ensure raw custom CSS declarations end with a semicolon to avoid invalid CSS
			const raw = `${safeVal}`.trim();
			const needsSemicolon = raw.length > 0 && !raw.endsWith(';');
			response += needsSemicolon ? `${raw};` : raw;
		} else response += `${safeKey}:${safeVal};`;
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

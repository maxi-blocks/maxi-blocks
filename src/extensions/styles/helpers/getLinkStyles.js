/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';

/**
 * External dependencies
 */
import { isBoolean } from 'lodash';

const getLinkStyles = (obj, target, parentBlockStyle) => {
	const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
	const response = {
		[target]: { link: {} },
		[`${target}:hover`]: { link: {} },
		[`${target}:hover span`]: { link: {} },
		[`${target}:active`]: { link: {} },
		[`${target}:active span`]: { link: {} },
		[`${target}:visited`]: { link: {} },
		[`${target}:visited span`]: { link: {} },
	};

	breakpoints.forEach(breakpoint => {
		if (
			isBoolean(obj[`link-palette-status-${breakpoint}`]) &&
			!obj[`link-palette-status-${breakpoint}`]
		) {
			response[target].link[breakpoint] = {};

			response[target].link[breakpoint].color =
				obj[`link-color-${breakpoint}`];
		} else if (obj[`link-palette-color-${breakpoint}`]) {
			response[target].link[breakpoint] = {};

			response[target].link[breakpoint].color = getColorRGBAString({
				firstVar: 'link',
				secondVar: `color-${obj[`link-palette-color-${breakpoint}`]}`,
				opacity: obj[`link-palette-opacity-${breakpoint}`],
				blockStyle: parentBlockStyle,
			});
		}
		if (
			isBoolean(obj[`link-hover-palette-status-${breakpoint}`]) &&
			!obj[`link-hover-palette-status-${breakpoint}`]
		) {
			response[`${target}:hover`].link[breakpoint] = {};
			response[`${target}:hover span`].link[breakpoint] = {};

			response[`${target}:hover`].link[breakpoint].color =
				obj[`link-hover-color-${breakpoint}`];
			response[`${target}:hover span`].link[breakpoint].color =
				obj[`link-hover-color-${breakpoint}`];
		} else if (obj[`link-hover-palette-color-${breakpoint}`]) {
			const color = getColorRGBAString({
				firstVar: 'link-hover',
				secondVar: `color-${
					obj[`link-hover-palette-color-${breakpoint}`]
				}`,
				opacity: obj[`link-hover-palette-opacity-${breakpoint}`],
				blockStyle: parentBlockStyle,
			});

			response[`${target}:hover`].link[breakpoint] = { color };
			response[`${target}:hover span`].link[breakpoint] = { color };
		}
		if (
			isBoolean(obj[`link-active-palette-status-${breakpoint}`]) &&
			!obj[`link-active-palette-status-${breakpoint}`]
		) {
			response[`${target}:active span`].link[breakpoint] = {};
			response[`${target}:active`].link[breakpoint] = {};

			response[`${target}:active`].link[breakpoint].color =
				obj[`link-active-color-${breakpoint}`];
			response[`${target}:active span`].link[breakpoint].color =
				obj[`link-active-color-${breakpoint}`];
		} else if (obj[`link-active-palette-color-${breakpoint}`]) {
			const color = getColorRGBAString({
				firstVar: 'link-active',
				secondVar: `color-${
					obj[`link-active-palette-color-${breakpoint}`]
				}`,
				opacity: obj[`link-active-palette-opacity-${breakpoint}`],
				blockStyle: parentBlockStyle,
			});

			response[`${target}:active span`].link[breakpoint] = { color };
			response[`${target}:active`].link[breakpoint] = { color };
		}
		if (
			isBoolean(obj[`link-visited-palette-status-${breakpoint}`]) &&
			!obj[`link-visited-palette-status-${breakpoint}`]
		) {
			response[`${target}:visited`].link[breakpoint] = {};
			response[`${target}:visited span`].link[breakpoint] = {};

			response[`${target}:visited`].link[breakpoint].color =
				obj[`link-visited-color-${breakpoint}`];
			response[`${target}:visited span`].link[breakpoint].color =
				obj[`link-visited-color-${breakpoint}`];
		} else if (obj[`link-visited-palette-color-${breakpoint}`]) {
			const color = getColorRGBAString({
				firstVar: 'link-visited',
				secondVar: `color-${
					obj[`link-visited-palette-color-${breakpoint}`]
				}`,
				opacity: obj[`link-visited-palette-opacity-${breakpoint}`],
				blockStyle: parentBlockStyle,
			});

			response[`${target}:visited`].link[breakpoint] = { color };
			response[`${target}:visited span`].link[breakpoint] = { color };
		}
	});

	return response;
};

export default getLinkStyles;

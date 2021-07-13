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
			isBoolean(obj[`link-palette-color-status-${breakpoint}`]) &&
			!obj[`link-palette-color-status-${breakpoint}`]
		) {
			response[target].link[breakpoint] = {};

			response[target].link[breakpoint].color =
				obj[`link-color-${breakpoint}`];
		} else if (obj[`link-palette-color-${breakpoint}`]) {
			response[target].link[breakpoint] = {};

			response[target].link[
				breakpoint
			].color = `var(--maxi-${parentBlockStyle}-color-${
				obj[`link-palette-color-${breakpoint}`]
			})`;
		}
		if (
			isBoolean(obj[`link-hover-palette-color-status-${breakpoint}`]) &&
			!obj[`link-hover-palette-color-status-${breakpoint}`]
		) {
			response[`${target}:hover`].link[breakpoint] = {};
			response[`${target}:hover span`].link[breakpoint] = {};

			response[`${target}:hover`].link[breakpoint].color =
				obj[`link-hover-color-${breakpoint}`];
			response[`${target}:hover span`].link[breakpoint].color =
				obj[`link-hover-color-${breakpoint}`];
		} else if (obj[`link-hover-palette-color-${breakpoint}`]) {
			response[`${target}:hover`].link[breakpoint] = {};
			response[`${target}:hover span`].link[breakpoint] = {};

			response[`${target}:hover`].link[
				breakpoint
			].color = `var(--maxi-${parentBlockStyle}-color-${
				obj[`link-hover-palette-color-${breakpoint}`]
			})`;
			response[`${target}:hover span`].link[
				breakpoint
			].color = `var(--maxi-${parentBlockStyle}-color-${
				obj[`link-hover-palette-color-${breakpoint}`]
			})`;
		}
		if (
			isBoolean(obj[`link-active-palette-color-status-${breakpoint}`]) &&
			!obj[`link-active-palette-color-status-${breakpoint}`]
		) {
			response[`${target}:active span`].link[breakpoint] = {};
			response[`${target}:active`].link[breakpoint] = {};

			response[`${target}:active`].link[breakpoint].color =
				obj[`link-active-color-${breakpoint}`];
			response[`${target}:active span`].link[breakpoint].color =
				obj[`link-active-color-${breakpoint}`];
		} else if (obj[`link-active-palette-color-${breakpoint}`]) {
			response[`${target}:active span`].link[breakpoint] = {};
			response[`${target}:active`].link[breakpoint] = {};

			response[`${target}:active`].link[
				breakpoint
			].color = `var(--maxi-${parentBlockStyle}-color-${
				obj[`link-active-palette-color-${breakpoint}`]
			})`;
			response[`${target}:active span`].link[
				breakpoint
			].color = `var(--maxi-${parentBlockStyle}-color-${
				obj[`link-active-palette-color-${breakpoint}`]
			})`;
		}
		if (
			isBoolean(obj[`link-visited-palette-color-status-${breakpoint}`]) &&
			!obj[`link-visited-palette-color-status-${breakpoint}`]
		) {
			response[`${target}:visited`].link[breakpoint] = {};
			response[`${target}:visited span`].link[breakpoint] = {};

			response[`${target}:visited`].link[breakpoint].color =
				obj[`link-visited-color-${breakpoint}`];
			response[`${target}:visited span`].link[breakpoint].color =
				obj[`link-visited-color-${breakpoint}`];
		} else if (obj[`link-visited-palette-color-${breakpoint}`]) {
			response[`${target}:visited`].link[breakpoint] = {};
			response[`${target}:visited span`].link[breakpoint] = {};

			response[`${target}:visited`].link[
				breakpoint
			].color = `var(--maxi-${parentBlockStyle}-color-${
				obj[`link-visited-palette-color-${breakpoint}`]
			})`;
			response[`${target}:visited span`].link[
				breakpoint
			].color = `var(--maxi-${parentBlockStyle}-color-${
				obj[`link-visited-palette-color-${breakpoint}`]
			})`;
		}
	});

	return response;
};

export default getLinkStyles;

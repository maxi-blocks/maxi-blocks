/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';

/**
 * External dependencies
 */
import { isBoolean } from 'lodash';
import getPaletteAttributes from '../getPaletteAttributes';

const getLinkStyles = (obj, target, blockStyle) => {
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
		const {
			paletteStatus: linkPaletteStatus,
			paletteColor: linkPaletteColor,
			paletteOpacity: linkPaletteOpacity,
			color: linkColor,
		} = getPaletteAttributes({
			obj,
			prefix: 'link-',
			breakpoint,
		});

		if (isBoolean(linkPaletteStatus) && !linkPaletteStatus) {
			response[target].link[breakpoint] = {};

			response[target].link[breakpoint].color = linkColor;
		} else if (linkPaletteColor) {
			response[target].link[breakpoint] = {};

			response[target].link[breakpoint].color = getColorRGBAString({
				firstVar: 'link',
				secondVar: `color-${linkPaletteColor}`,
				opacity: linkPaletteOpacity,
				blockStyle: blockStyle,
			});
		}

		const {
			paletteStatus: linkHoverPaletteStatus,
			paletteColor: linkHoverPaletteColor,
			paletteOpacity: linkHoverPaletteOpacity,
			color: linkHoverColor,
		} = getPaletteAttributes({
			obj,
			prefix: 'link-hover-',
			breakpoint,
		});

		if (isBoolean(linkHoverPaletteStatus) && !linkHoverPaletteStatus) {
			response[`${target}:hover`].link[breakpoint] = {};
			response[`${target}:hover span`].link[breakpoint] = {};

			response[`${target}:hover`].link[breakpoint].color = linkHoverColor;
			response[`${target}:hover span`].link[breakpoint].color =
				linkHoverColor;
		} else if (linkHoverPaletteColor) {
			const color = getColorRGBAString({
				firstVar: 'link-hover',
				secondVar: `color-${linkHoverPaletteColor}`,
				opacity: linkHoverPaletteOpacity,
				blockStyle: blockStyle,
			});

			response[`${target}:hover`].link[breakpoint] = { color };
			response[`${target}:hover span`].link[breakpoint] = { color };
		}

		const {
			paletteStatus: linkActivePaletteStatus,
			paletteColor: linkActivePaletteColor,
			paletteOpacity: linkActivePaletteOpacity,
			color: linkActiveColor,
		} = getPaletteAttributes({
			obj,
			prefix: 'link-active-',
			breakpoint,
		});

		if (isBoolean(linkActivePaletteStatus) && !linkActivePaletteStatus) {
			response[`${target}:active`].link[breakpoint] = {};
			response[`${target}:active span`].link[breakpoint] = {};

			response[`${target}:active`].link[breakpoint].color =
				linkActiveColor;
			response[`${target}:active span`].link[breakpoint].color =
				linkActiveColor;
		} else if (linkActivePaletteColor) {
			const color = getColorRGBAString({
				firstVar: 'link-active',
				secondVar: `color-${linkActivePaletteColor}`,
				opacity: linkActivePaletteOpacity,
				blockStyle: blockStyle,
			});

			response[`${target}:active`].link[breakpoint] = { color };
			response[`${target}:active span`].link[breakpoint] = { color };
		}

		const {
			paletteStatus: linkVisitedPaletteStatus,
			paletteColor: linkVisitedPaletteColor,
			paletteOpacity: linkVisitedPaletteOpacity,
			color: linkVisitedColor,
		} = getPaletteAttributes({
			obj,
			prefix: 'link-visited-',
			breakpoint,
		});

		if (isBoolean(linkVisitedPaletteStatus) && !linkVisitedPaletteStatus) {
			response[`${target}:visited`].link[breakpoint] = {};
			response[`${target}:visited span`].link[breakpoint] = {};

			response[`${target}:visited`].link[breakpoint].color =
				linkVisitedColor;
			response[`${target}:visited span`].link[breakpoint].color =
				linkVisitedColor;
		} else if (linkVisitedPaletteColor) {
			const color = getColorRGBAString({
				firstVar: 'link-visited',
				secondVar: `color-${linkVisitedPaletteColor}`,
				opacity: linkVisitedPaletteOpacity,
				blockStyle: blockStyle,
			});

			response[`${target}:visited`].link[breakpoint] = { color };
			response[`${target}:visited span`].link[breakpoint] = { color };
		}
	});

	return response;
};

export default getLinkStyles;

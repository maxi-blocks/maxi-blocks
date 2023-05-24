/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';
import getPaletteAttributes from '../../attributes/getPaletteAttributes';
import getAttributeKey from '../../attributes/getAttributeKey';

/**
 * External dependencies
 */
import { isBoolean, isNil } from 'lodash';

const getLinkStyles = (obj, target, blockStyle) => {
	const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
	const response = {
		[target]: { link: {} },
		[`${target}:hover`]: { link: {} },
		[`${target}:active`]: { link: {} },
		[`${target}:active span`]: { link: {} },
		[`${target}:visited`]: { link: {} },
		[`${target}:visited span`]: { link: {} },
		[`.block-editor-block-list__block ${target}:visited`]: {
			link: {},
		},
		[`${target}:visited span`]: { link: {} },
		[`${target}:visited:hover`]: {
			link: {},
		},
	};

	const getTextDecoration = (breakpoint, isHover = false) => {
		const hoverStatus = obj[getAttributeKey({ key: 't.sh' })];
		const value = obj[getAttributeKey({ key: '_td', isHover, breakpoint })];
		return !isNil(value) && (hoverStatus || !isHover) && value;
	};

	breakpoints.forEach(breakpoint => {
		response[target].link[breakpoint] = {};

		const decoration = getTextDecoration(breakpoint);
		if (decoration) {
			response[target].link[breakpoint]['text-decoration'] = decoration;
		}

		const {
			paletteStatus: linkPaletteStatus,
			paletteColor: linkPaletteColor,
			paletteOpacity: linkPaletteOpacity,
			color: linkColor,
		} = getPaletteAttributes({
			obj,
			prefix: '_l-',
			breakpoint,
		});

		if (isBoolean(linkPaletteStatus) && !linkPaletteStatus) {
			response[
				[`.block-editor-block-list__block ${target}:visited`]
			].link[breakpoint] = {};

			response[target].link[breakpoint].color = linkColor;
			response[
				[`.block-editor-block-list__block ${target}:visited`]
			].link[breakpoint].color = linkColor;
		} else if (linkPaletteColor) {
			response[
				[`.block-editor-block-list__block ${target}:visited`]
			].link[breakpoint] = {};

			response[target].link[breakpoint].color = getColorRGBAString({
				firstVar: 'link',
				secondVar: `color-${linkPaletteColor}`,
				opacity: linkPaletteOpacity,
				blockStyle,
			});
			response[
				[`.block-editor-block-list__block ${target}:visited`]
			].link[breakpoint].color = getColorRGBAString({
				firstVar: 'link',
				secondVar: `color-${linkPaletteColor}`,
				opacity: linkPaletteOpacity,
				blockStyle,
			});
		}

		response[`${target}:hover`].link[breakpoint] = {};
		const hoverDecoration = getTextDecoration(breakpoint);
		if (hoverDecoration) {
			response[target].link[breakpoint]['text-decoration'] =
				hoverDecoration;
		}

		const {
			paletteStatus: linkHoverPaletteStatus,
			paletteColor: linkHoverPaletteColor,
			paletteOpacity: linkHoverPaletteOpacity,
			color: linkHoverColor,
		} = getPaletteAttributes({
			obj,
			prefix: '_lih-',
			breakpoint,
		});

		if (isBoolean(linkHoverPaletteStatus) && !linkHoverPaletteStatus) {
			response[[`${target}:visited:hover`]].link[breakpoint] = {};

			response[`${target}:hover`].link[breakpoint].color = linkHoverColor;

			response[[`${target}:visited:hover`]].link[breakpoint].color =
				linkHoverColor;
		} else if (linkHoverPaletteColor) {
			const color = getColorRGBAString({
				firstVar: 'link-hover',
				secondVar: `color-${linkHoverPaletteColor}`,
				opacity: linkHoverPaletteOpacity,
				blockStyle,
			});

			response[`${target}:hover`].link[breakpoint].color = color;

			response[[`${target}:visited:hover`]].link[breakpoint] = { color };
		}

		const {
			paletteStatus: linkActivePaletteStatus,
			paletteColor: linkActivePaletteColor,
			paletteOpacity: linkActivePaletteOpacity,
			color: linkActiveColor,
		} = getPaletteAttributes({
			obj,
			prefix: '_lia-',
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
				blockStyle,
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
			prefix: '_liv-',
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
				blockStyle,
			});

			response[`${target}:visited`].link[breakpoint] = { color };
			response[`${target}:visited span`].link[breakpoint] = { color };
		}
	});

	return response;
};

export default getLinkStyles;

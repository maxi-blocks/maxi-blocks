/**
 * Internal dependencies
 */
import getColorRGBAString from '@extensions/styles/getColorRGBAString';
import getLastBreakpointAttribute from '@extensions/styles/getLastBreakpointAttribute';
import getPaletteAttributes from '@extensions/styles/getPaletteAttributes';
import { getIsValid } from '@extensions/styles/utils';

/**
 * External dependencies
 */
import { isUndefined, isNil } from 'lodash';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Generates border styles object
 *
 * @param {Object} obj Block border properties
 */
const getBorderStyles = ({
	obj,
	isHover = false,
	isIB = false,
	prefix = '',
	blockStyle,
	isButton = false,
	scValues = {},
	borderColorProperty = 'border-color',
}) => {
	const response = {};

	const hoverStatus = obj[`${prefix}border-status-hover`];
	const {
		'hover-border-color-global': isActive,
		'hover-border-color-all': affectAll,
	} = scValues;
	const globalHoverStatus = isActive && affectAll;

	if (isHover && !isNil(hoverStatus) && !hoverStatus && !globalHoverStatus)
		return response;

	const keyWords = [
		'top-left',
		'top-right',
		'bottom-right',
		'bottom-left',
		'top',
		'right',
		'bottom',
		'left',
	];

	let omitBorderStyle = !isIB && !hoverStatus && !globalHoverStatus;

	const getColorString = breakpoint => {
		const {
			paletteStatus,
			paletteSCStatus,
			paletteColor,
			paletteOpacity,
			color,
		} = getPaletteAttributes({
			obj,
			prefix: `${prefix}border-`,
			isHover,
			breakpoint,
		});

		if (!paletteStatus) return color;

		if (
			!paletteSCStatus &&
			isButton &&
			(!isHover || hoverStatus || globalHoverStatus)
		)
			return getColorRGBAString({
				firstVar: `${isButton ? 'button-' : ''}border-color${
					isHover ? '-hover' : ''
				}`,
				secondVar: `color-${paletteColor}`,
				opacity: paletteOpacity,
				blockStyle,
			});
		return getColorRGBAString({
			firstVar: `color-${paletteColor}`,
			opacity: paletteOpacity,
			blockStyle,
		});
	};
	// Pre-compute regex patterns and object entries once
	// Filter out palette-sc-status keys to avoid them appearing in CSS
	const hoverSuffix = isHover ? '-hover' : '';
	const replacerCache = {};
	const colorStringCache = {}; // Cache color strings per breakpoint
	const objEntries = Object.entries(obj).filter(
		([key]) => !key.includes('palette-sc-status')
	);

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		const borderStyle = getLastBreakpointAttribute({
			target: `${prefix}border-style`,
			breakpoint,
			attributes: obj,
			isHover,
		});
		const isBorderNone = isUndefined(borderStyle) || borderStyle === 'none';
		omitBorderStyle = omitBorderStyle ? isBorderNone : false;

		// Cache regex per breakpoint
		if (!replacerCache[breakpoint]) {
			replacerCache[breakpoint] = new RegExp(
				`\\b-${breakpoint}${hoverSuffix}\\b(?!.*\\b-${breakpoint}${hoverSuffix}\\b)`,
				'gm'
			);
		}
		const replacer = replacerCache[breakpoint];
		const breakpointSuffix = `-${breakpoint}${hoverSuffix}`;

		objEntries.forEach(([key, rawValue]) => {
			const newKey = prefix ? key.replace(prefix, '') : key;

			// Early exit: check if this entry is for the current breakpoint BEFORE doing expensive operations
			const includesBreakpoint = newKey.endsWith(breakpointSuffix);

			// Skip early if not for this breakpoint, or if it's a sync/unit key
			if (
				!includesBreakpoint ||
				newKey.includes('sync') ||
				newKey.includes('unit')
			) {
				return;
			}

			const newLabel = newKey.replace(replacer, '');
			const value = getLastBreakpointAttribute({
				target: `${prefix}${newLabel}`,
				isHover,
				breakpoint,
				attributes: obj,
			});

			if (
				getIsValid(value, true) ||
				(isHover && globalHoverStatus && key.includes('color')) ||
				key === `${prefix}border-palette-color-${breakpoint}`
			) {
				// More efficient: find unitKey only if needed
				let unitKey;
				for (let i = 0; i < keyWords.length; i += 1) {
					if (newLabel.includes(keyWords[i])) {
						unitKey = keyWords[i];
						break;
					}
				}

				const unit = unitKey
					? getLastBreakpointAttribute({
							target: `${prefix}${newLabel.replace(
								unitKey,
								'unit'
							)}`,
							breakpoint,
							attributes: obj,
							isHover,
					  }) || 'px'
					: 'px';

				if (key.includes('style')) {
					if (!omitBorderStyle)
						if ((isHover || isIB) && isBorderNone) {
							response[breakpoint].border = 'none';
						} else
							response[breakpoint]['border-style'] = borderStyle;
				} else if (!unitKey) {
					// If unitKey wasn't found, none of the keywords match
					if (
						(key.includes('color') || key.includes('opacity')) &&
						(!isBorderNone || (isHover && globalHoverStatus))
					) {
						// Cache color string per breakpoint
						if (!colorStringCache[breakpoint]) {
							colorStringCache[breakpoint] =
								getColorString(breakpoint);
						}
						response[breakpoint][borderColorProperty] =
							colorStringCache[breakpoint];
					} else if (
						![
							'border-palette-status',
							'border-palette-color',
							'border-palette-opacity',
						].includes(newLabel)
					)
						response[breakpoint][newLabel] = `${value}`;
				} else if (
					[
						'border-top-width',
						'border-right-width',
						'border-left-width',
						'border-bottom-width',
					].includes(newLabel)
				) {
					if (isBorderNone) return;
					if (Number.isFinite(value)) {
						response[breakpoint][newLabel] = `${value}${unit}`;
					} else {
						response[breakpoint][newLabel] = `0${unit}`;
					}
				} else if (Number.isFinite(value)) {
					response[breakpoint][newLabel] = `${value}${unit}`;
				} else {
					response[breakpoint][newLabel] = `0${unit}`;
				}
			}
		});
	});

	return response;
};

export default getBorderStyles;

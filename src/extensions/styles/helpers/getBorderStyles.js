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

	// Clean `palette-sc-status` traces on obj. This is an MVP, considering future implementation of
	// #4679 will implement a new border style helper.
	Object.keys(obj).forEach(key => {
		if (key.includes('palette-sc-status')) delete obj[key];
	});

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

		const replacer = new RegExp(
			`\\b-${breakpoint}${
				isHover ? '-hover' : ''
			}\\b(?!.*\\b-${breakpoint}${isHover ? '-hover' : ''}\\b)`,
			'gm'
		);

		Object.entries(obj).forEach(([key, rawValue]) => {
			const newKey = prefix ? key.replace(prefix, '') : key;
			const includesBreakpoint =
				newKey.lastIndexOf(`-${breakpoint}${isHover ? '-hover' : ''}`) +
					`-${breakpoint}${isHover ? '-hover' : ''}`.length ===
				newKey.length;
			const newLabel = newKey.replace(replacer, '');
			const value = getLastBreakpointAttribute({
				target: `${prefix}${newLabel}`,
				isHover,
				breakpoint,
				attributes: obj,
			});

			if (
				(getIsValid(value, true) ||
					(isHover && globalHoverStatus && key.includes('color')) ||
					key === `${prefix}border-palette-color-${breakpoint}`) &&
				includesBreakpoint &&
				!newKey.includes('sync') &&
				!newKey.includes('unit')
			) {
				const unitKey = keyWords.filter(key =>
					newLabel.includes(key)
				)[0];

				const unit =
					getLastBreakpointAttribute({
						target: `${prefix}${newLabel.replace(unitKey, 'unit')}`,
						breakpoint,
						attributes: obj,
						isHover,
					}) || 'px';

				if (key.includes('style')) {
					if (!omitBorderStyle)
						if ((isHover || isIB) && isBorderNone) {
							response[breakpoint].border = 'none';
						} else
							response[breakpoint]['border-style'] = borderStyle;
				} else if (!keyWords.some(key => newKey.includes(key))) {
					if (
						(key.includes('color') || key.includes('opacity')) &&
						(!isBorderNone || (isHover && globalHoverStatus))
					) {
						response[breakpoint][borderColorProperty] =
							getColorString(breakpoint);
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

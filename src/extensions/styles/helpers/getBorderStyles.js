/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';
import getPaletteAttributes from '../getPaletteAttributes';
import { getIsValid } from '../utils';

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
	const newObj = {};
	let borderObj = obj;
	let hasValidKeys = false;

	for (const key in obj) {
		if (!key.includes('palette-sc-status')) {
			newObj[key] = obj[key];
			hasValidKeys = true;
		}
	}

	if (hasValidKeys) {
		borderObj = newObj;
	}

	const hoverStatus = borderObj[`${prefix}border-status-hover`];
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
			borderObj,
			prefix: `${prefix}border-`,
			isHover,
			breakpoint,
		});

		if (!paletteStatus) {
			return color;
		}

		const isButtonCondition =
			isButton && (!isHover || hoverStatus || globalHoverStatus);

		if (!paletteSCStatus && isButtonCondition) {
			return getColorRGBAString({
				firstVar: `button-border-color${isHover ? '-hover' : ''}`,
				secondVar: `color-${paletteColor}`,
				opacity: paletteOpacity,
				blockStyle,
			});
		}

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
			attributes: borderObj,
			isHover,
		});
		const isBorderNone = isUndefined(borderStyle) || borderStyle === 'none';
		omitBorderStyle = omitBorderStyle ? isBorderNone : false;

		const regexPattern = `\\b-${breakpoint}${
			isHover ? '-hover' : ''
		}\\b(?!.*\\b-${breakpoint}${isHover ? '-hover' : ''}\\b)`;
		const replacer = new RegExp(regexPattern, 'gm');

		Object.entries(borderObj).forEach(([key, rawValue]) => {
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
				attributes: borderObj,
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
						attributes: borderObj,
						isHover,
					}) || 'px';

				// Initial check for 'style' condition
				if (key.includes('style') && !omitBorderStyle) {
					if ((isHover || isIB) && isBorderNone) {
						response[breakpoint].border = 'none';
					} else {
						response[breakpoint]['border-style'] = borderStyle;
					}
				}
				// Check for keyWords and other conditions
				else if (!keyWords.some(keyword => newKey.includes(keyword))) {
					if (
						(key.includes('color') || key.includes('opacity')) &&
						(!isBorderNone || (isHover && globalHoverStatus))
					) {
						response[breakpoint][borderColorProperty] =
							getColorString(breakpoint);
					}
					// Check for palette conditions
					else if (
						![
							'border-palette-status',
							'border-palette-color',
							'border-palette-opacity',
						].includes(newLabel)
					) {
						response[breakpoint][newLabel] = `${value}`;
					}
				}
				// Check for specific border width properties
				else if (
					[
						'border-top-width',
						'border-right-width',
						'border-left-width',
						'border-bottom-width',
					].includes(newLabel)
				) {
					if (!isBorderNone) {
						response[breakpoint][newLabel] = Number.isFinite(value)
							? `${value}${unit}`
							: `0${unit}`;
					}
				}
				// Final else condition for remaining cases
				else {
					response[breakpoint][newLabel] = Number.isFinite(value)
						? `${value}${unit}`
						: `0${unit}`;
				}
			}
		});
	});

	return response;
};

export default getBorderStyles;

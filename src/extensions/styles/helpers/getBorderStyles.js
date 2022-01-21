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
import { isUndefined } from 'lodash';

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
	prefix = '',
	parentBlockStyle,
	isButton = false,
	scValues = {},
}) => {
	const response = {};

	const hoverStatus = obj[`${prefix}border-status-hover`];
	const {
		'hover-border-color-global': isActive,
		'hover-border-color-all': affectAll,
	} = scValues;
	const globalHoverStatus = isActive && affectAll;

	if (isHover && !hoverStatus && !globalHoverStatus) return response;

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

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		const borderStyle = getLastBreakpointAttribute(
			`${prefix}border-style`,
			breakpoint,
			obj,
			isHover
		);
		const isBorderNone = isUndefined(borderStyle) || borderStyle === 'none';

		const getColorString = () => {
			const { paletteStatus, paletteColor, paletteOpacity, color } =
				getPaletteAttributes({
					obj,
					prefix: `${prefix}border-`,
					isHover,
					breakpoint,
				});

			if (paletteStatus)
				if (isButton && (!isHover || hoverStatus || globalHoverStatus))
					return getColorRGBAString({
						firstVar: `${isButton ? 'button-' : ''}border-color${
							isHover ? '-hover' : ''
						}`,
						secondVar: `color-${paletteColor}`,
						opacity: paletteOpacity,
						blockStyle: parentBlockStyle,
					});
				else
					return getColorRGBAString({
						firstVar: `color-${paletteColor}`,
						opacity: paletteOpacity,
						blockStyle: parentBlockStyle,
					});
			return color;
		};

		Object.entries(obj).forEach(([key, value]) => {
			const newKey = prefix ? key.replace(prefix, '') : key;
			const includesBreakpoint =
				newKey.lastIndexOf(`-${breakpoint}${isHover ? '-hover' : ''}`) +
					`-${breakpoint}${isHover ? '-hover' : ''}`.length ===
				newKey.length;

			if (
				(getIsValid(value, true) ||
					(isHover && globalHoverStatus && key.includes('color'))) &&
				includesBreakpoint &&
				!newKey.includes('sync') &&
				!newKey.includes('unit')
			) {
				const replacer = new RegExp(
					`\\b-${breakpoint}${
						isHover ? '-hover' : ''
					}\\b(?!.*\\b-${breakpoint}${isHover ? '-hover' : ''}\\b)`,
					'gm'
				);
				const newLabel = newKey.replace(replacer, '');
				if (key.includes('style')) {
					if (isHover && isBorderNone) {
						response[breakpoint].border = 'none';
					} else response[breakpoint]['border-style'] = borderStyle;
				} else if (!keyWords.some(key => newLabel.includes(key))) {
					if (
						(key.includes('color') || key.includes('opacity')) &&
						(!isBorderNone || (isHover && globalHoverStatus))
					)
						response[breakpoint]['border-color'] = getColorString();
					else if (
						![
							'border-palette-status',
							'border-palette-color',
							'border-palette-opacity',
						].includes(newLabel)
					)
						response[breakpoint][newLabel] = `${value}`;
				} else {
					const unitKey = keyWords.filter(key =>
						newLabel.includes(key)
					)[0];

					const unit =
						getLastBreakpointAttribute(
							`${prefix}${newLabel.replace(unitKey, 'unit')}`,
							breakpoint,
							obj,
							isHover
						) || 'px';

					response[breakpoint][newLabel] = `${value}${unit}`;
				}
			}
		});
	});

	return response;
};

export default getBorderStyles;

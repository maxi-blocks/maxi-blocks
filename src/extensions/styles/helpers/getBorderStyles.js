/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

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
}) => {
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

	const response = {};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		const borderStyle = getLastBreakpointAttribute(
			`${prefix}border-style`,
			breakpoint,
			obj,
			isHover
		);
		const isBorderNone = isUndefined(borderStyle) || borderStyle === 'none';

		Object.entries(obj).forEach(([key, value]) => {
			const newKey = prefix ? key.replace(prefix, '') : key;
			const includesBreakpoint =
				newKey.lastIndexOf(`-${breakpoint}${isHover ? '-hover' : ''}`) +
					`-${breakpoint}${isHover ? '-hover' : ''}`.length ===
				newKey.length;

			if (
				!!value &&
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
					if (key.includes('color') || key.includes('opacity')) {
						const paletteStatus = getLastBreakpointAttribute(
							`${prefix}border-palette-color-status`,
							breakpoint,
							obj,
							isHover
						);
						const paletteColor =
							obj[
								`${prefix}border-palette-color-${breakpoint}${
									isHover ? '-hover' : ''
								}`
							];

						if (!isBorderNone) {
							if (paletteStatus && paletteColor)
								if (isButton)
									response[breakpoint]['border-color'] =
										getColorRGBAString({
											firstVar: `${
												isButton ? 'button-' : ''
											}border-color${
												isHover ? '-hover' : ''
											}`,
											secondVar: `color-${paletteColor}`,
											opacity:
												obj[
													`${prefix}border-palette-opacity-${breakpoint}${
														isHover ? '-hover' : ''
													}`
												],
											blockStyle: parentBlockStyle,
										});
								else
									response[breakpoint]['border-color'] =
										getColorRGBAString({
											firstVar: `color-${paletteColor}`,
											opacity:
												obj[
													`${prefix}border-palette-opacity-${breakpoint}${
														isHover ? '-hover' : ''
													}`
												],
											blockStyle: parentBlockStyle,
										});
							else
								response[breakpoint]['border-color'] =
									obj[
										`${prefix}border-color-${breakpoint}${
											isHover ? '-hover' : ''
										}`
									];
						}
					} else response[breakpoint][newLabel] = `${value}`;
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

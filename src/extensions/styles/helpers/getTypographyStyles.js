/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

/**
 * External dependencies
 */
import { isEmpty, isNil, isBoolean } from 'lodash';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Generates size styles object
 *
 * @param {Object} obj Block size properties
 */
const getTypographyStyles = ({
	obj,
	isHover = false,
	prefix = '',
	customFormatTypography = false,
	parentBlockStyle,
	textLevel = 'p',
	normalTypography, // Just in case is hover,
	scValues = {},
}) => {
	const response = {};

	const hoverStatus = obj[`${prefix}typography-status-hover`];
	const { 'hover-color-global': isActive, 'hover-color-all': affectAll } =
		scValues;

	const globalHoverStatus = isActive && affectAll;

	if (isHover && !hoverStatus && !globalHoverStatus) return response;

	const isCustomFormat = !!customFormatTypography;

	const getName = (target, breakpoint) =>
		`${prefix}${target}-${breakpoint}${
			!isCustomFormat && isHover ? '-hover' : ''
		}`;

	const getPaletteColorStatus = breakpoint => {
		const propName = getName('palette-status', breakpoint);

		if (isBoolean(obj[propName])) return obj[propName];

		return (
			isCustomFormat &&
			getLastBreakpointAttribute({
				target: 'palette-status',
				breakpoint,
				attributes: customFormatTypography,
				isHover,
			})
		);
	};

	const getColorString = breakpoint => {
		const paletteStatus = getPaletteColorStatus(breakpoint);
		const paletteColor = obj[getName('palette-color', breakpoint)];
		const paletteOpacity = obj[getName('palette-opacity', breakpoint)];
		const color = obj[getName('color', breakpoint)];

		if (paletteStatus && (!isHover || hoverStatus || globalHoverStatus))
			return {
				...(!isNil(paletteColor) && {
					color: getColorRGBAString({
						firstVar: `${textLevel}-color${
							isHover ? '-hover' : ''
						}`,
						secondVar: `color-${paletteColor}`,
						opacity: paletteOpacity,
						blockStyle: parentBlockStyle,
					}),
				}),
			};
		if (paletteStatus)
			return {
				...(!isNil(paletteColor) && {
					color: getColorRGBAString({
						firstVar: `color-${paletteColor}`,
						opacity: paletteOpacity,
						blockStyle: parentBlockStyle,
					}),
				}),
			};

		return {
			...(!isNil(color) && {
				color,
			}),
		};
	};

	// As sometimes creators just change the value and not the unit, we need to
	// be able to request the non-hover unit
	const getUnitValue = (prop, breakpoint) => {
		const unit = getLastBreakpointAttribute({
			target: `${prefix}${prop}`,
			breakpoint,
			attributes: isCustomFormat ? customFormatTypography : obj,
			avoidXXL: false,
		});

		if (!normalTypography || unit) return unit === '-' ? '' : unit;

		return getLastBreakpointAttribute({
			target: `${prefix}${prop}`,
			breakpoint,
			attributes: normalTypography,
			avoidXXL: false,
		});
	};

	breakpoints.forEach(breakpoint => {
		const typography = {
			...(!isNil(obj[getName('font-family', breakpoint)]) && {
				'font-family': obj[getName('font-family', breakpoint)],
			}),
			...getColorString(breakpoint),
			...(!isNil(obj[getName('font-size', breakpoint)]) && {
				'font-size': `${
					obj[getName('font-size', breakpoint)]
				}${getUnitValue('font-size-unit', breakpoint)}`,
			}),
			...(!isNil(obj[getName('line-height', breakpoint)]) && {
				'line-height': `${obj[getName('line-height', breakpoint)]}${
					getUnitValue(`${prefix}line-height-unit`, breakpoint) || ''
				}`,
			}),
			...(!isNil(obj[getName('letter-spacing', breakpoint)]) && {
				'letter-spacing': `${
					obj[getName('letter-spacing', breakpoint)]
				}${getUnitValue(`${prefix}letter-spacing-unit`, breakpoint)}`,
			}),
			...(!isNil(obj[getName('font-weight', breakpoint)]) && {
				'font-weight': obj[getName('font-weight', breakpoint)],
			}),
			...(!isNil(obj[getName('text-transform', breakpoint)]) && {
				'text-transform': obj[getName('text-transform', breakpoint)],
			}),
			...(!isNil(obj[getName('font-style', breakpoint)]) && {
				'font-style': obj[getName('font-style', breakpoint)],
			}),
			...(!isNil(obj[getName('text-decoration', breakpoint)]) && {
				'text-decoration': obj[getName('text-decoration', breakpoint)],
			}),
			...(!isNil(obj[getName('text-shadow', breakpoint)]) && {
				'text-shadow': obj[getName('text-shadow', breakpoint)],
			}),
			...(!isNil(obj[getName('vertical-align', breakpoint)]) && {
				'vertical-align': obj[getName('vertical-align', breakpoint)],
			}),
			...(!isNil(obj[getName('text-orientation', breakpoint)]) && {
				'writing-mode': !isEmpty(
					obj[getName('text-orientation', breakpoint)]
				)
					? 'vertical-rl'
					: null,
				'text-orientation':
					obj[getName('text-orientation', breakpoint)],
			}),
		};

		if (!isEmpty(typography)) response[breakpoint] = typography;
	});

	return response;
};

export default getTypographyStyles;

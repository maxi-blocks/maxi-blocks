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
}) => {
	if (isHover && !obj[`${prefix}typography-status-hover`]) return {};

	const response = {};

	const isCustomFormat = !!customFormatTypography;

	const getName = (target, breakpoint) =>
		`${prefix}${target}-${breakpoint}${
			!isCustomFormat && isHover ? '-hover' : ''
		}`;

	const getPaletteColorStatus = breakpoint => {
		const propName = getName('palette-color-status', breakpoint);

		if (isBoolean(obj[propName])) return obj[propName];

		return (
			isCustomFormat &&
			getLastBreakpointAttribute(
				'palette-color-status',
				breakpoint,
				customFormatTypography,
				isHover
			)
		);
	};

	// As sometimes creators just change the value and not the unit, we need to
	// be able to request the non-hover unit
	const getUnitValue = (prop, breakpoint) => {
		const unit = getLastBreakpointAttribute(
			`${prefix}${prop}`,
			breakpoint,
			isCustomFormat ? customFormatTypography : obj
		);

		if (!normalTypography || unit) return unit === '-' ? '' : unit;

		return getLastBreakpointAttribute(
			`${prefix}${prop}`,
			breakpoint,
			normalTypography
		);
	};

	breakpoints.forEach(breakpoint => {
		const typography = {
			...(!isNil(obj[getName('font-family', breakpoint)]) && {
				'font-family': obj[getName('font-family', breakpoint)],
			}),
			...(getPaletteColorStatus(breakpoint)
				? {
						...(!isNil(
							obj[getName('palette-color', breakpoint)]
						) && {
							color: getColorRGBAString({
								firstVar: `${textLevel}-color${
									isHover ? '-hover' : ''
								}`,
								secondVar: `color-${
									obj[getName('palette-color', breakpoint)]
								}`,
								opacity:
									obj[getName('palette-opacity', breakpoint)],
								blockStyle: parentBlockStyle,
							}),
						}),
				  }
				: {
						...(!isNil(obj[getName('color', breakpoint)]) && {
							color: obj[getName('color', breakpoint)],
						}),
				  }),
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
		};

		if (!isEmpty(typography)) response[breakpoint] = typography;
	});

	return response;
};

export default getTypographyStyles;

/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';
import getLastBreakpointAttribute from '../../attributes/getLastBreakpointAttribute';
import getAttributeKey from '../../attributes/getAttributeKey';

/**
 * External dependencies
 */
import { isEmpty, isNil } from 'lodash';

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
	blockStyle,
	textLevel = 'p',
	normalTypography, // Just in case is hover,
	scValues = {},
	isStyleCards = false,
}) => {
	const response = {};

	const hoverStatus = obj[getAttributeKey('t.sh', false, prefix)];
	const { 'hover-color-global': isActive, 'hover-color-all': affectAll } =
		scValues;

	const globalHoverStatus = isActive && affectAll;

	if (isHover && !hoverStatus && !globalHoverStatus) return response;

	const isCustomFormat = !!customFormatTypography;

	const getValue = (target, breakpoint) =>
		obj[
			getAttributeKey(
				target,
				!isCustomFormat && isHover,
				prefix,
				breakpoint
			)
		];

	const getPaletteColorStatus = breakpoint => {
		const paletteStatus = getLastBreakpointAttribute({
			target: '_ps',
			prefix,
			breakpoint,
			attributes: { ...obj, ...normalTypography },
			isHover,
		});

		if (!isNil(paletteStatus)) return paletteStatus;

		return (
			isCustomFormat &&
			getLastBreakpointAttribute({
				target: '_ps',
				prefix,
				breakpoint,
				attributes: customFormatTypography,
				isHover,
			})
		);
	};

	const getColorString = breakpoint => {
		const paletteStatus = getPaletteColorStatus(breakpoint);
		const paletteColor = getValue('_pc', breakpoint);
		const paletteOpacity = getValue('_po', breakpoint);

		if (paletteStatus && (!isHover || hoverStatus || globalHoverStatus))
			return {
				...(!isNil(paletteColor) && {
					color: getColorRGBAString({
						firstVar: `${textLevel}-color${
							isHover ? '-hover' : ''
						}`,
						secondVar: `color-${paletteColor}`,
						opacity: paletteOpacity,
						blockStyle,
					}),
				}),
			};
		if (paletteStatus)
			return {
				...(!isNil(paletteColor) && {
					color: getColorRGBAString({
						firstVar: `color-${paletteColor}`,
						opacity: paletteOpacity,
						blockStyle,
					}),
				}),
			};

		const color = getValue('_cc', breakpoint);
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
			target: prop,
			prefix,
			breakpoint,
			attributes: isCustomFormat ? customFormatTypography : obj,
		});

		if (!normalTypography || unit) return unit === '-' ? '' : unit;

		return getLastBreakpointAttribute({
			target: prop,
			prefix,
			breakpoint,
			attributes: normalTypography,
		});
	};

	breakpoints.forEach(breakpoint => {
		const typography = {
			...(!isNil(getValue('_ff', breakpoint)) && {
				'font-family': getValue('_ff', breakpoint),
			}),
			...getColorString(breakpoint),
			...(!isNil(getValue('_fs', breakpoint)) && {
				'font-size': `${getValue('_fs', breakpoint)}${getUnitValue(
					'_fs.u',
					breakpoint
				)}`,
			}),
			...(!isNil(getValue('_lhe', breakpoint)) && {
				'line-height': `${getValue('_lhe', breakpoint)}${
					getUnitValue('_lhe.u', breakpoint) || ''
				}`,
			}),
			...(!isNil(getValue('_ls', breakpoint)) && {
				'letter-spacing': `${getValue('_ls', breakpoint)}${getUnitValue(
					'_ls.u',
					breakpoint
				)}`,
			}),
			...(!isNil(getValue('_fw', breakpoint)) && {
				'font-weight': getValue('_fw', breakpoint),
			}),
			...(!isNil(getValue('_ttr', breakpoint)) && {
				'text-transform': getValue('_ttr', breakpoint),
			}),
			...(!isNil(getValue('_fst', breakpoint)) && {
				'font-style': getValue('_fst', breakpoint),
			}),
			...(!isNil(getValue('_td', breakpoint)) && {
				'text-decoration': getValue('_td', breakpoint),
			}),
			...(!isNil(getValue('_ti', breakpoint)) && {
				'text-indent': `${getValue('_ti', breakpoint)}${getUnitValue(
					'_ti.u',
					breakpoint
				)}`,
			}),
			...(!isNil(getValue('_tsh', breakpoint)) && {
				'text-shadow': getValue('_tsh', breakpoint),
			}),
			...(!isNil(getValue('_va', breakpoint)) && {
				'vertical-align': getValue('_va', breakpoint),
			}),
			...(!isNil(getValue('_to', breakpoint)) && {
				'writing-mode':
					getValue('_to', breakpoint) !== 'unset'
						? 'vertical-rl'
						: 'unset',
				'text-orientation': getValue('_to', breakpoint),
			}),
			...(!isNil(getValue('_td', breakpoint)) && {
				direction: getValue('_td', breakpoint),
			}),
			...(!isNil(getValue('_ws', breakpoint)) && {
				'white-space': getValue('_ws', breakpoint),
			}),
			...(!isNil(getValue('_wsp', breakpoint)) && {
				'word-spacing': `${getValue('_wsp', breakpoint)}${getUnitValue(
					'_wsp.u',
					breakpoint
				)}`,
			}),
			...(!isNil(getValue('_bg', breakpoint)) && {
				'margin-bottom': `${getValue('_bg', breakpoint)}${getUnitValue(
					'_bg.u',
					breakpoint
				)}`,
			}),
			...(!isStyleCards && {
				...(!isNil(getValue('_to', breakpoint)) && {
					'writing-mode':
						getValue('_to', breakpoint) !== 'unset'
							? 'vertical-rl'
							: 'unset',
					'text-orientation': getValue('_to', breakpoint),
				}),
				...(!isNil(getValue('_td', breakpoint)) && {
					direction: getValue('_td', breakpoint),
				}),
			}),
		};

		if (!isEmpty(typography)) response[breakpoint] = typography;
	});

	return response;
};

export default getTypographyStyles;

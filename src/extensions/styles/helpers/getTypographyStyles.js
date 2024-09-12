/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';
import getAttributeKey from '../getAttributeKey';
import { getTypographyValue } from '../../text/formats';

/**
 * External dependencies
 */
import { isEmpty, isNil } from 'lodash';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
const breakpointsWidthDictionary = {
	xxl: 1920,
	xl: 1920,
	l: 1366,
	m: 1024,
	s: 767,
	xs: 480,
};

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
	styleCard,
	styleCardPrefix = '',
	baseBreakpoint,
}) => {
	const response = {};

	const hoverStatus = obj[`${prefix}typography-status-hover`];
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

	const getLastBreakpointValue = (target, breakpoint, avoidSC = true) =>
		avoidSC
			? getLastBreakpointAttribute({
					target: `${prefix}${target}`,
					breakpoint,
					attributes: obj,
					isHover: !isCustomFormat && isHover,
			  })
			: getTypographyValue({
					prop: `${prefix}${target}`,
					breakpoint,
					typography: obj,
					isHover: !isCustomFormat && isHover,
					textLevel,
					blockStyle,
					styleCard,
					styleCardPrefix,
					prefix,
					avoidSC: !styleCard,
			  });

	const getPaletteColorStatus = breakpoint => {
		const paletteStatus = getLastBreakpointAttribute({
			target: `${prefix}palette-status`,
			breakpoint,
			attributes: { ...obj, ...normalTypography },
			isHover,
		});

		if (!isNil(paletteStatus)) return paletteStatus;

		return (
			isCustomFormat &&
			getLastBreakpointAttribute({
				target: `${prefix}palette-status`,
				breakpoint,
				attributes: customFormatTypography,
				isHover,
			})
		);
	};

	const getColorString = breakpoint => {
		const paletteStatus = getPaletteColorStatus(breakpoint);
		const paletteSCStatus = getLastBreakpointValue(
			'palette-sc-status',
			breakpoint
		);
		const paletteColor = getLastBreakpointValue(
			'palette-color',
			breakpoint
		);
		const paletteOpacity = getLastBreakpointValue(
			'palette-opacity',
			breakpoint
		);

		if (
			!paletteSCStatus &&
			paletteStatus &&
			(!isHover || hoverStatus || globalHoverStatus)
		)
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

		const color = getValue('color', breakpoint);
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
			forceUseBreakpoint: true,
		});

		if (!normalTypography || unit) return unit === '-' ? '' : unit;

		return getLastBreakpointAttribute({
			target: `${prefix}${prop}`,
			breakpoint,
			attributes: normalTypography,
		});
	};

	const calculateFontValuesForBreakpoints = () => {
		const fontValuesPerBreakpoint = {};
		let lastClampValues = {};
		let firstConsistentBreakpoint = null;

		for (const bp of breakpoints) {
			const clampStatus = getLastBreakpointValue(
				'font-size-clamp-status',
				bp,
				false
			);

			if (clampStatus) {
				const clampAutoStatus = getLastBreakpointValue(
					'font-size-clamp-auto-status',
					bp
				);

				const clampMin = getLastBreakpointValue(
					'font-size-clamp-min',
					bp
				);
				const clampPreferred = getLastBreakpointValue('font-size', bp);
				const clampMax = getLastBreakpointValue(
					'font-size-clamp-max',
					bp
				);
				const clampMinUnit = getLastBreakpointValue(
					'font-size-clamp-min-unit',
					bp
				);
				const clampPreferredUnit = getLastBreakpointValue(
					'font-size-unit',
					bp
				);
				const clampMaxUnit = getLastBreakpointValue(
					'font-size-clamp-max-unit',
					bp
				);

				const currentClampValues = {
					clampAutoStatus,
					clampMin,
					clampPreferred,
					clampMax,
					clampMinUnit,
					clampPreferredUnit,
					clampMaxUnit,
				};

				if (
					styleCard &&
					Object.values(currentClampValues).some(isNil)
				) {
					if (isNil(clampAutoStatus)) {
						currentClampValues.clampAutoStatus =
							getLastBreakpointValue(
								'font-size-clamp-auto-status',
								bp,
								false
							);
					}

					if (isNil(clampMin)) {
						currentClampValues.clampMin = getLastBreakpointValue(
							'font-size-clamp-min',
							bp,
							false
						);
					}

					if (isNil(clampPreferred)) {
						currentClampValues.clampPreferred =
							getLastBreakpointValue('font-size', bp, false);
					}

					if (isNil(clampMax)) {
						currentClampValues.clampMax = getLastBreakpointValue(
							'font-size-clamp-max',
							bp,
							false
						);
					}

					if (isNil(clampMinUnit)) {
						currentClampValues.clampMinUnit =
							getLastBreakpointValue(
								'font-size-clamp-min-unit',
								bp,
								false
							);
					}

					if (isNil(clampPreferredUnit)) {
						currentClampValues.clampPreferredUnit =
							getLastBreakpointValue('font-size-unit', bp, false);
					}

					if (isNil(clampMaxUnit)) {
						currentClampValues.clampMaxUnit =
							getLastBreakpointValue(
								'font-size-clamp-max-unit',
								bp,
								false
							);
					}
				}

				if (
					[
						'clampAutoStatus',
						'clampMin',
						'clampPreferred',
						'clampMax',
						'clampMinUnit',
						'clampPreferredUnit',
						'clampMaxUnit',
					].some(
						key => currentClampValues[key] !== lastClampValues[key]
					)
				) {
					lastClampValues = currentClampValues;
					firstConsistentBreakpoint =
						firstConsistentBreakpoint ||
						(bp === 'general' ? baseBreakpoint : bp);
				}

				fontValuesPerBreakpoint[bp] = {
					minViewportWidth:
						breakpointsWidthDictionary[
							bp === 'general' ? baseBreakpoint : bp
						],
					maxViewportWidth: firstConsistentBreakpoint
						? breakpointsWidthDictionary[firstConsistentBreakpoint]
						: breakpointsWidthDictionary.xxl,
					clampStatus,
					...lastClampValues,
				};
			} else {
				const fontSize = getValue('font-size', bp);
				const fontSizeUnit = getUnitValue('font-size-unit', bp);
				fontValuesPerBreakpoint[bp] = {
					fontSize,
					fontSizeUnit,
					clampStatus,
				};
			}
		}

		return fontValuesPerBreakpoint;
	};

	const getFontSizeValue = fontValues => {
		const { fontSize, clampStatus } = fontValues;

		if (!clampStatus) {
			if (isNil(fontSize)) return null;

			const { fontSizeUnit } = fontValues;

			return { 'font-size': `${fontSize}${fontSizeUnit}` };
		}

		const { clampMin, clampPreferred, clampMax } = fontValues;

		if ([clampMin, clampPreferred, clampMax].every(isNil)) return null;

		const {
			minViewportWidth,
			maxViewportWidth,
			clampAutoStatus,
			clampMinUnit,
			clampPreferredUnit,
			clampMaxUnit,
		} = fontValues;

		if (clampAutoStatus) {
			const preferredFontSize = `calc(${clampMin}${clampMinUnit} + (${clampMax}${clampMaxUnit} - ${clampMin}${clampMinUnit}) * ((100vw - ${minViewportWidth}px) / (${maxViewportWidth} - ${minViewportWidth})))`;

			return {
				'font-size': `clamp(${clampMin}${clampMinUnit}, ${preferredFontSize}, ${clampMax}${clampMaxUnit})`,
			};
		}

		return {
			'font-size': `clamp(${clampMin}${clampMinUnit}, ${clampPreferred}${clampPreferredUnit}, ${clampMax}${clampMaxUnit})`,
		};
	};
	console.log(styleCard);
	const fontValuesPerBreakpoint = calculateFontValuesForBreakpoints();
	console.log(fontValuesPerBreakpoint);

	breakpoints.forEach(breakpoint => {
		const typography = {
			...(!isNil(getValue('font-family', breakpoint)) && {
				'font-family': `"${getValue('font-family', breakpoint)}"`,
			}),
			...getColorString(breakpoint),
			...getFontSizeValue(fontValuesPerBreakpoint[breakpoint]),
			...(!isNil(getValue('line-height', breakpoint)) && {
				'line-height': `${getValue('line-height', breakpoint)}${
					getUnitValue('line-height-unit', breakpoint) || ''
				}`,
			}),
			...(!isNil(getValue('letter-spacing', breakpoint)) && {
				'letter-spacing': `${getValue(
					'letter-spacing',
					breakpoint
				)}${getUnitValue('letter-spacing-unit', breakpoint)}`,
			}),
			...(!isNil(getValue('font-weight', breakpoint)) && {
				'font-weight': getValue('font-weight', breakpoint),
			}),
			...(!isNil(getValue('text-transform', breakpoint)) && {
				'text-transform': getValue('text-transform', breakpoint),
			}),
			...(!isNil(getValue('font-style', breakpoint)) && {
				'font-style': getValue('font-style', breakpoint),
			}),
			...(!isNil(getValue('text-decoration', breakpoint)) && {
				'text-decoration': getValue('text-decoration', breakpoint),
			}),
			...(!isNil(getValue('text-indent', breakpoint)) && {
				'text-indent': `${getValue(
					'text-indent',
					breakpoint
				)}${getUnitValue('text-indent-unit', breakpoint)}`,
			}),
			...(!isNil(getValue('text-shadow', breakpoint)) && {
				'text-shadow': getValue('text-shadow', breakpoint),
			}),
			...(!isNil(getValue('vertical-align', breakpoint)) && {
				'vertical-align': getValue('vertical-align', breakpoint),
			}),
			...(!isNil(getValue('text-orientation', breakpoint)) && {
				'writing-mode':
					getValue('text-orientation', breakpoint) !== 'unset'
						? 'vertical-rl'
						: 'unset',
				'text-orientation': getValue('text-orientation', breakpoint),
			}),
			...(!isNil(getValue('text-direction', breakpoint)) && {
				direction: getValue('text-direction', breakpoint),
			}),
			...(!isNil(getValue('white-space', breakpoint)) && {
				'white-space': getValue('white-space', breakpoint),
			}),
			...(!isNil(getValue('word-spacing', breakpoint)) && {
				'word-spacing': `${getValue(
					'word-spacing',
					breakpoint
				)}${getUnitValue('word-spacing-unit', breakpoint)}`,
			}),
			...(!isNil(getValue('bottom-gap', breakpoint)) && {
				'margin-bottom': `${getValue(
					'bottom-gap',
					breakpoint
				)}${getUnitValue('bottom-gap-unit', breakpoint)}`,
			}),
			...(!isStyleCards && {
				...(!isNil(getValue('text-orientation', breakpoint)) && {
					'writing-mode':
						getValue('text-orientation', breakpoint) !== 'unset'
							? 'vertical-rl'
							: 'unset',
					'text-orientation': getValue(
						'text-orientation',
						breakpoint
					),
				}),
				...(!isNil(getValue('text-direction', breakpoint)) && {
					direction: getValue('text-direction', breakpoint),
				}),
			}),
		};

		if (!isEmpty(typography)) response[breakpoint] = typography;
	});

	return response;
};

export default getTypographyStyles;

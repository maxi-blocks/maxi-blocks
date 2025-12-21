/**
 * Internal dependencies
 */
import getColorRGBAString from '@extensions/styles/getColorRGBAString';
import getLastBreakpointAttribute from '@extensions/styles/getLastBreakpointAttribute';
import getAttributeKey from '@extensions/styles/getAttributeKey';
import getDefaultAttribute from '@extensions/styles/getDefaultAttribute';
import getBreakpoints from '@extensions/styles/helpers/getBreakpoints';


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
	disablePaletteDefaults = false,
	disableBottomGap = false,
	blockName,
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
	const getLastBreakpointValue = (target, breakpoint) =>
		getLastBreakpointAttribute({
			target: `${prefix}${target}`,
			breakpoint,
			attributes: obj,
			isHover: !isCustomFormat && isHover,
		});

	const getDefaultValue = target =>
		getDefaultAttribute(
			getAttributeKey(
				target,
				!isCustomFormat && isHover,
				prefix,
				'general'
			),
			null,
			false,
			blockName
		);

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

	const isDefaultOpacity = (opacity, defaultOpacity, breakpoint) =>
		opacity === defaultOpacity ||
		(isNil(opacity) && isNil(defaultOpacity)) ||
		(breakpoint === 'general' && opacity === 1); // supports reset on general

	const getColorString = breakpoint => {
		const paletteStatus = getPaletteColorStatus(breakpoint);
		const paletteColorValue = getLastBreakpointValue(
			'palette-color',
			breakpoint
		);

		if (paletteStatus) {
			if (isNil(paletteColorValue)) {
				return {};
			}

			const paletteOpacity = getLastBreakpointValue(
				'palette-opacity',
				breakpoint
			);

			if (disablePaletteDefaults) {
				const defaultPaletteColor = getDefaultValue('palette-color');
				const defaultPaletteOpacity =
					getDefaultValue('palette-opacity');

				if (
					paletteColorValue === defaultPaletteColor &&
					isDefaultOpacity(
						paletteOpacity,
						defaultPaletteOpacity,
						breakpoint
					)
				) {
					return {};
				}
			}

			const paletteSCStatus = getLastBreakpointValue(
				'palette-sc-status',
				breakpoint
			);

			const shouldUseTextLevel =
				!paletteSCStatus &&
				(!isHover || hoverStatus || globalHoverStatus);

			let colorIdentifier;
			if (
				typeof paletteColorValue === 'number' &&
				paletteColorValue >= 1000
			) {
				// For numeric custom color IDs (1000+), use the ID directly.
				// This matches the new CSS var names like --maxi-light-color-1000
				colorIdentifier = paletteColorValue;
			} else {
				// For standard palette numbers (1-8) or other values.
				colorIdentifier = paletteColorValue;
			}

			const firstVar = shouldUseTextLevel
				? `${textLevel}-color${isHover ? '-hover' : ''}`
				: `color-${colorIdentifier}`;

			return {
				color: getColorRGBAString({
					firstVar,
					...(shouldUseTextLevel && {
						secondVar: `color-${colorIdentifier}`,
					}),
					opacity: paletteOpacity,
					blockStyle,
				}),
			};
		}

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

	const breakpointWidths = getBreakpoints(obj);
	breakpoints.forEach(breakpoint => {
		const typography = {
			...(!isNil(getValue('font-family', breakpoint)) && {
				'font-family': `"${getValue('font-family', breakpoint)}"`,
			}),
			...getColorString(breakpoint),
			...(() => {
				const fontSize = getValue('font-size', breakpoint);
				const fontSizeUnit =
					getUnitValue('font-size-unit', breakpoint) || 'px';
				const clampEnabled = getLastBreakpointValue(
					'font-size-clamp-status',
					breakpoint
				);

				if (clampEnabled) {
					const minSize = getLastBreakpointValue('font-size-min', breakpoint);
					const preferredSize = getLastBreakpointValue(
						'font-size-preferred',
						breakpoint
					);
					const maxSize = getLastBreakpointValue('font-size-max', breakpoint);
					const minUnit =
						getUnitValue('font-size-min-unit', breakpoint) || 'rem';
					const preferredUnit =
						getUnitValue('font-size-preferred-unit', breakpoint) || 'vw';
					const maxUnit =
						getUnitValue('font-size-max-unit', breakpoint) || 'rem';

					if (!isNil(minSize) && !isNil(preferredSize) && !isNil(maxSize)) {
						if (breakpoint === 'general') {
							return {
								'font-size': `clamp(${minSize}${minUnit}, ${preferredSize}${preferredUnit}, ${maxSize}${maxUnit})`,
							};
						}



						return {
							'font-size': `clamp(${minSize}${minUnit}, ${preferredSize}${preferredUnit}, ${maxSize}${maxUnit})`,
						};
					}
				}

				if (!isNil(fontSize)) {
					return { 'font-size': `${fontSize}${fontSizeUnit}` };
				}
				return {};
			})(),
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

			...(!isNil(getValue('white-space', breakpoint)) && {
				'white-space': getValue('white-space', breakpoint),
			}),
			...(!isNil(getValue('word-spacing', breakpoint)) && {
				'word-spacing': `${getValue(
					'word-spacing',
					breakpoint
				)}${getUnitValue('word-spacing-unit', breakpoint)}`,
			}),
			...(!disableBottomGap &&
				!isNil(getValue('bottom-gap', breakpoint)) && {
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

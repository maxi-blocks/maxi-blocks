/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';
import getAttributeValue from '../getAttributeValue';
import getDefaultAttribute from '../getDefaultAttribute';

/**
 * External dependencies
 */
import { isBoolean, isNil, isNumber, round, isEmpty } from 'lodash';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getPrevBreakpoint = breakpoint =>
	breakpoints[breakpoints.indexOf(breakpoint) - 1];

/**
 * Generates size styles object
 *
 * @param {Object} obj Block size properties
 */
const getBoxShadowStyles = ({
	obj,
	isHover = false,
	dropShadow = false,
	prefix = '',
	blockStyle,
	forClipPath = false,
}) => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		let boxShadowString = '';

		const getValue = target => {
			const value = getAttributeValue({
				target,
				props: obj,
				isHover,
				prefix: `${prefix}box-shadow-`,
				breakpoint,
			});

			const defaultValue =
				breakpoint === 'general'
					? getDefaultAttribute(
							`${prefix}box-shadow-${target}-${breakpoint}`
					  )
					: getLastBreakpointAttribute({
							target: `${prefix}box-shadow-${target}`,
							breakpoint: getPrevBreakpoint(breakpoint),
							attributes: obj,
							isHover,
					  });

			return {
				value,
				defaultValue,
			};
		};

		const getClipPathValue = target => {
			const value = getAttributeValue({
				target,
				props: obj,
				isHover: false,
				breakpoint,
			});

			const defaultValue =
				breakpoint === 'general'
					? getDefaultAttribute(`${target}-${breakpoint}`)
					: getLastBreakpointAttribute({
							target,
							breakpoint: getPrevBreakpoint(breakpoint),
							attributes: obj,
							isHover: false,
					  });

			return {
				value,
				defaultValue,
			};
		};

		// clip-path
		const { value: clipPath, defaultValue: defaultClipPath } =
			getClipPathValue('clip-path');

		// clip-path-status
		const { value: clipPathStatus, defaultValue: defaultClipPathStatus } =
			getClipPathValue('clip-path-status');

		// Inset
		const { value: inset, defaultValue: defaultInset } = getValue('inset');

		// Horizontal
		const { value: horizontal, defaultValue: defaultHorizontal } =
			getValue('horizontal');

		// Vertical
		const { value: vertical, defaultValue: defaultVertical } =
			getValue('vertical');

		// Blur
		const { value: blur, defaultValue: defaultBlur } = getValue('blur');

		// Spread
		const { value: spread, defaultValue: defaultSpread } =
			getValue('spread');

		// Horizontal Unit
		const { value: horizontalUnit, defaultValue: defaultHorizontalUnit } =
			getValue('horizontal-unit');

		// Vertical Unit
		const { value: verticalUnit, defaultValue: defaultVerticalUnit } =
			getValue('vertical-unit');

		// Blur Unit
		const { value: blurUnit, defaultValue: defaultBlurUnit } =
			getValue('blur-unit');

		// Spread Unit
		const { value: spreadUnit, defaultValue: defaultSpreadUnit } =
			getValue('spread-unit');

		// Palette
		const paletteStatus = getLastBreakpointAttribute({
			target: `${prefix}box-shadow-palette-status`,
			breakpoint,
			attributes: obj,
			isHover,
		});

		// Color
		const { value: paletteColor, defaultValue: defaultPaletteColor } =
			paletteStatus ? getValue('palette-color') : getValue('color');
		const defaultColor = getColorRGBAString({
			firstVar: `color-${defaultPaletteColor}`,
			opacity: getValue('palette-opacity').defaultValue,
			blockStyle,
		});

		const color =
			paletteStatus && paletteColor
				? getColorRGBAString({
						firstVar: `color-${paletteColor}`,
						opacity: getValue('palette-opacity').value,
						blockStyle,
				  })
				: paletteColor;

		const isNotDefault =
			clipPath !== defaultClipPath ||
			clipPathStatus !== defaultClipPathStatus ||
			(isBoolean(inset) && inset !== defaultInset) ||
			(isNumber(horizontal) &&
				horizontal !== 0 &&
				horizontal !== defaultHorizontal) ||
			(isNumber(vertical) &&
				vertical !== 0 &&
				vertical !== defaultVertical) ||
			(isNumber(blur) && blur !== 0 && blur !== defaultBlur) ||
			(isNumber(spread) && spread !== 0 && spread !== defaultSpread) ||
			(!isNil(horizontalUnit) &&
				horizontalUnit !== defaultHorizontalUnit) ||
			(!isNil(verticalUnit) && verticalUnit !== defaultVerticalUnit) ||
			(!isNil(blurUnit) && blurUnit !== defaultBlurUnit) ||
			(!isNil(spreadUnit) && spreadUnit !== defaultSpreadUnit) ||
			(!isNil(color) && color !== defaultColor);

		const horizontalValue = isNumber(horizontal)
			? horizontal
			: defaultHorizontal;
		const verticalValue = isNumber(vertical) ? vertical : defaultVertical;

		const clipPathExists =
			getLastBreakpointAttribute({
				target: 'clip-path',
				breakpoint,
				attributes: obj,
			}) &&
			getLastBreakpointAttribute({
				target: 'clip-path-status',
				breakpoint,
				attributes: obj,
			});

		if (isNotDefault && dropShadow) {
			const blurValue = isNumber(blur)
				? round(blur / 3)
				: round(defaultBlur / 3);

			boxShadowString += `${horizontalValue || 0}${
				horizontalUnit || 'px'
			} `;
			boxShadowString += `${verticalValue || 0}${verticalUnit || 'px'} `;
			boxShadowString += `${blurValue || 0}${blurUnit || 'px'} `;
			boxShadowString += color || defaultColor;

			if (!(forClipPath && !clipPathExists && isEmpty(obj.SVGElement)))
				response[breakpoint] = {
					filter: `drop-shadow(${boxShadowString.trim()})`,
				};
		} else if (isNotDefault) {
			const blurValue = isNumber(blur) ? blur : defaultBlur;
			const spreadValue = isNumber(spread) ? spread : defaultSpread;
			const insetValue = isBoolean(inset) ? inset : defaultInset;

			boxShadowString +=
				isBoolean(insetValue) && insetValue ? 'inset ' : '';
			boxShadowString += `${horizontalValue || 0}${
				horizontalUnit || 'px'
			} `;
			boxShadowString += `${verticalValue || 0}${verticalUnit || 'px'} `;
			boxShadowString += `${blurValue || 0}${blurUnit || 'px'} `;
			boxShadowString += `${spreadValue || 0}${spreadUnit || 'px'} `;
			boxShadowString += color || defaultColor;

			if (
				!(
					prefix === 'image-' &&
					(clipPathExists || !isEmpty(obj.SVGElement))
				)
			)
				response[breakpoint] = {
					'box-shadow': `${boxShadowString.trim()}`,
				};
			else
				response[breakpoint] = {
					'box-shadow': 'none',
				};
		}
	});
	if (isHover && 'image-' && !forClipPath) console.log(response);

	return response;
};

export default getBoxShadowStyles;

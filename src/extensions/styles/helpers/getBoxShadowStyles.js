/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';
import getLastBreakpointAttribute from '../../attributes/getLastBreakpointAttribute';
import getAttributesValue from '../../attributes/getAttributesValue';
import getDefaultAttribute from '../../attributes/getDefaultAttribute';

/**
 * External dependencies
 */
import { isBoolean, isNil, isNumber, round, isEmpty } from 'lodash';
import getAttributeKey from '../../attributes/getAttributeKey';

/**
 * General
 */
const breakpoints = ['g', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

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
	isIB = false,
}) => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		let boxShadowString = '';

		const getValue = target => {
			const value = getAttributesValue({
				target,
				props: obj,
				isHover,
				prefix: `${prefix}bs`,
				breakpoint,
			});

			const defaultValue =
				breakpoint === 'g'
					? getDefaultAttribute(
							getAttributeKey({
								key: `bs${target}`,
								prefix,
								breakpoint,
							})
					  )
					: getLastBreakpointAttribute({
							target: `bs${target}`,
							prefix,
							breakpoint: getPrevBreakpoint(breakpoint),
							attributes: obj,
							isHover,
					  });

			return {
				value,
				defaultValue,
			};
		};

		const SVGElement = getAttributesValue({
			target: '_se',
			props: obj,
		});

		const clipPathExists =
			(getLastBreakpointAttribute({
				target: '_cp',
				breakpoint,
				attributes: obj,
			}) &&
				getLastBreakpointAttribute({
					target: '_cp.s',
					breakpoint,
					attributes: obj,
				})) ||
			!isEmpty(SVGElement);

		const defaultClipPathExists =
			breakpoint === 'g'
				? false
				: (getLastBreakpointAttribute({
						target: '_cp',
						breakpoint: getPrevBreakpoint(breakpoint),
						attributes: obj,
				  }) &&
						getLastBreakpointAttribute({
							target: '_cp.s',
							breakpoint: getPrevBreakpoint(breakpoint),
							attributes: obj,
						})) ||
				  !isEmpty(SVGElement);

		// Inset
		const { value: inset, defaultValue: defaultInset } = getValue('_in');

		// Horizontal
		const { value: horizontal, defaultValue: defaultHorizontal } =
			getValue('_ho');

		// Vertical
		const { value: vertical, defaultValue: defaultVertical } =
			getValue('_v');

		// Blur
		const { value: blur, defaultValue: defaultBlur } = getValue('_blu');

		// Spread
		const { value: spread, defaultValue: defaultSpread } = getValue('_sp');

		// Horizontal Unit
		const { value: horizontalUnit, defaultValue: defaultHorizontalUnit } =
			getValue('_ho.u');

		// Vertical Unit
		const { value: verticalUnit, defaultValue: defaultVerticalUnit } =
			getValue('_v.u');

		// Blur Unit
		const { value: blurUnit, defaultValue: defaultBlurUnit } =
			getValue('_blu.u');

		// Spread Unit
		const { value: spreadUnit, defaultValue: defaultSpreadUnit } =
			getValue('_sp.u');

		// Palette
		const paletteStatus = getLastBreakpointAttribute({
			target: 'bs_ps',
			prefix,
			breakpoint,
			attributes: obj,
			isHover,
		});

		// Color
		const { value: paletteColor, defaultValue: defaultPaletteColor } =
			paletteStatus ? getValue('_pc') : getValue('_cc');
		const defaultColor = getColorRGBAString({
			firstVar: `color-${defaultPaletteColor}`,
			opacity: getValue('_po').defaultValue,
			blockStyle,
		});

		const color =
			paletteStatus && paletteColor
				? getColorRGBAString({
						firstVar: `color-${paletteColor}`,
						opacity: getValue('_po').value,
						blockStyle,
				  })
				: paletteColor;

		const isNotDefault =
			(breakpoint === 'g' && isIB) ||
			(breakpoint !== 'g' &&
				clipPathExists !== defaultClipPathExists &&
				prefix === 'im-' &&
				clipPathExists) ||
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

			if (!(forClipPath && !clipPathExists))
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

			if (!(prefix === 'im-' && clipPathExists))
				response[breakpoint] = {
					'box-shadow': `${boxShadowString.trim()}`,
				};
			else
				response[breakpoint] = {
					'box-shadow': 'none',
				};
		}
	});

	return response;
};

export default getBoxShadowStyles;

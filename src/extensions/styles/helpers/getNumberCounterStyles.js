/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';
import getPaletteAttributes from '../../attributes/getPaletteAttributes';
import getAttributesValue from '../../attributes/getAttributesValue';
/**
 * External dependencies
 */
import { isNil } from 'lodash';
import getAttributeKey from '../../attributes/getAttributeKey';

const breakpoints = ['g', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getCircleBarStyles = (obj, blockStyle) => {
	const response = {
		label: 'Number Counter',
		g: {},
	};

	const getColor = breakpoint => {
		const { paletteStatus, paletteColor, paletteOpacity, color } =
			getPaletteAttributes({
				obj,
				prefix: 'nccba-',
				breakpoint,
			});
		if (!paletteStatus && !isNil(color)) {
			return color;
		}
		if (paletteStatus && paletteColor) {
			return getColorRGBAString({
				firstVar: `color-${paletteColor}`,
				opacity: paletteOpacity,
				blockStyle,
			});
		}
	};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {
			stroke: getColor(breakpoint),
		};
	});

	return { numberCounterCircleBar: response };
};

const getCircleBackgroundStyles = (obj, blockStyle) => {
	const response = {
		label: 'Number Counter',
		g: {},
	};

	const { paletteStatus, paletteColor, paletteOpacity, color } =
		getPaletteAttributes({
			obj,
			prefix: 'nccb-',
		});

	if (!paletteStatus && !isNil(color)) response.g.stroke = color;
	else if (paletteStatus && paletteColor)
		response.g.stroke = getColorRGBAString({
			firstVar: `color-${paletteColor}`,
			opacity: paletteOpacity,
			blockStyle,
		});

	return { numberCounterBackground: response };
};

const getTextStyles = (obj, blockStyle) => {
	const response = {
		label: 'Number Counter',
		g: {},
	};

	const typeOfStyle = getAttributesValue({
		target: 'nc-ci.s',
		obj,
	})
		? 'color'
		: 'fill';

	const getColor = breakpoint => {
		const { paletteStatus, paletteColor, paletteOpacity, color } =
			getPaletteAttributes({
				obj,
				prefix: 'nct-',
				breakpoint,
			});
		if (!paletteStatus && !isNil(color)) return color;
		if (paletteStatus && paletteColor)
			return getColorRGBAString({
				firstVar: `color-${paletteColor}`,
				opacity: paletteOpacity,
				blockStyle,
			});
	};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {
			...(!isNil(
				obj[getAttributeKey({ key: 'nc-ti_fs', breakpoint })]
			) && {
				'font-size': `${
					obj[getAttributeKey({ key: 'nc-ti_fs', breakpoint })]
				}px`,
			}),
			...(!isNil(obj[getAttributeKey({ key: '_ff', breakpoint })]) && {
				'font-family': `${
					obj[getAttributeKey({ key: '_ff', breakpoint })]
				}`,
			}),
			...(!isNil(obj[getAttributeKey({ key: '_fwe', breakpoint })]) && {
				'font-weight': `${
					obj[getAttributeKey({ key: '_fwe', breakpoint })]
				}`,
			}),
			[typeOfStyle]: getColor(breakpoint),
		};
	});

	return { numberCounterText: response };
};

const getSupStyles = obj => {
	const response = {
		label: 'Number Counter',
		g: {},
	};

	breakpoints.forEach(breakpoint => {
		if (!isNil(obj[getAttributeKey({ key: 'nc-ti_fs', breakpoint })]))
			response.g['font-size'] = `${
				obj[getAttributeKey({ key: 'nc-ti_fs', breakpoint })] / 1.5
			}px`;
	});

	return { numberCounterSup: response };
};

const getNumberCounterStyles = ({ obj, target, blockStyle }) => {
	const response = {
		[` ${target} .maxi-number-counter__box__circle`]: getCircleBarStyles(
			obj,
			blockStyle
		),
		[` ${target} .maxi-number-counter__box__background`]:
			getCircleBackgroundStyles(obj, blockStyle),
		[` ${target} .maxi-number-counter__box__text`]: getTextStyles(
			obj,
			blockStyle
		),
		[` ${target} .maxi-number-counter__box__text tspan`]: getSupStyles(
			obj,
			blockStyle
		),
	};

	return response;
};

export default getNumberCounterStyles;

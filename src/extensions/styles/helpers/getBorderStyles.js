/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';
import getLastBreakpointAttribute from '../../attributes/getLastBreakpointAttribute';
import getPaletteAttributes from '../../attributes/getPaletteAttributes';
import getAttributesValue from '../../attributes/getAttributesValue';
import getAttributeKey from '../../attributes/getAttributeKey';

/**
 * External dependencies
 */
import { isUndefined, isNil } from 'lodash';

/**
 * General
 */
const breakpoints = ['g', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
const getPrevBreakpoint = breakpoint =>
	breakpoints[breakpoints.indexOf(breakpoint) - 1] ?? 'g';

/**
 * Generates border styles object
 *
 * @param {Object} obj Block border properties
 */
const getBorderStyles = ({
	obj,
	isHover = false,
	isIB = false,
	prefix = '',
	blockStyle,
	isButton = false,
	scValues = {},
	borderColorProperty = 'border-color',
}) => {
	const response = {};

	const hoverStatus = getAttributesValue({
		target: 'bo.sh',
		props: obj,
		prefix,
	});

	const { 'h-bo_col.g': isActive, 'h-bo_col.a': affectAll } = scValues;
	const globalHoverStatus = isActive && affectAll;

	if (isHover && !isNil(hoverStatus) && !hoverStatus && !globalHoverStatus)
		return response;

	const widthKeys = ['.t', '.r', '.b', '.l'];
	const widthDictionary = {
		'.t': 'top',
		'.r': 'right',
		'.b': 'bottom',
		'.l': 'left',
	};
	const radiusKeys = ['.tl', '.tr', '.br', '.bl'];
	const radiusDictionary = {
		'.tl': 'top-left',
		'.tr': 'top-right',
		'.br': 'bottom-right',
		'.bl': 'bottom-left',
	};

	let omitBorderStyle = !isIB && !hoverStatus && !globalHoverStatus;
	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		const borderStyle = getLastBreakpointAttribute({
			target: 'bo_s',
			prefix,
			breakpoint,
			attributes: obj,
			isHover,
		});

		const isBorderNone = isUndefined(borderStyle) || borderStyle === 'none';
		omitBorderStyle = omitBorderStyle ? isBorderNone : false;

		const getValueAndUnit = (key, axis) => {
			const target = key + axis;
			const currentValue =
				obj[
					getAttributeKey({
						key: target,
						isHover,
						prefix,
						breakpoint,
					})
				];
			const currentUnit =
				obj[
					getAttributeKey({
						key: `${key}${axis}.u`,
						isHover,
						prefix,
						breakpoint,
					})
				] ??
				obj[
					getAttributeKey({
						key: `${key}.u`,
						isHover,
						prefix,
						breakpoint,
					})
				];

			const hasCurrent = !isNil(currentValue) || !isNil(currentUnit);

			if (!hasCurrent) return null;

			const lastValue = getLastBreakpointAttribute({
				target,
				prefix,
				breakpoint,
				attributes: obj,
				isHover,
			});

			if (isNil(lastValue)) return null;

			const lastUnit =
				(getLastBreakpointAttribute({
					target: `${key}${axis}.u`,
					prefix,
					breakpoint,
					attributes: obj,
					isHover,
				}) ??
					getLastBreakpointAttribute({
						target: `${key}.u`,
						prefix,
						breakpoint,
						attributes: obj,
						isHover,
					})) ||
				'px';

			return `${lastValue}${lastUnit}`;
		};

		const prevBreakpoint = getPrevBreakpoint(breakpoint);

		if (!isBorderNone) {
			const getColorString = () => {
				const currentColor = getAttributesValue({
					target: ['bo_ps', 'bo_pc', 'bo_po', 'bo_cc'],
					props: obj,
					isHover,
					prefix,
					breakpoint,
					returnObj: true,
				});

				const hasDifferentColorAttributes = Object.values(
					currentColor
				).some(value => !isNil(value));

				if (!hasDifferentColorAttributes) return null;

				const { paletteStatus, paletteColor, paletteOpacity, color } =
					getPaletteAttributes({
						obj,
						prefix: `${prefix}bo`,
						isHover,
						breakpoint,
					});

				if (paletteStatus)
					if (
						isButton &&
						(!isHover || hoverStatus || globalHoverStatus)
					)
						return getColorRGBAString({
							firstVar: `${
								isButton ? 'button-' : ''
							}border-color${isHover ? '-hover' : ''}`,
							secondVar: `color-${paletteColor}`,
							opacity: paletteOpacity,
							blockStyle,
						});
					else
						return getColorRGBAString({
							firstVar: `color-${paletteColor}`,
							opacity: paletteOpacity,
							blockStyle,
						});

				return color;
			};

			const currentBorderStyle =
				obj[
					getAttributeKey({
						key: 'bo_s',
						isHover,
						prefix,
						breakpoint,
					})
				];
			if (!isNil(currentBorderStyle))
				response[breakpoint]['border-style'] = borderStyle;

			const borderColor = getColorString();
			if (borderColor)
				response[breakpoint][borderColorProperty] = borderColor;

			widthKeys.forEach(axis => {
				const val = getValueAndUnit('bo_w', axis);
				const cssProperty = `border-${widthDictionary[axis]}-width`;
				const prevVal = response[prevBreakpoint][cssProperty];

				if (val && val !== prevVal)
					response[breakpoint][cssProperty] = val;
			});
		} else if (
			!isNil(
				obj[
					getAttributeKey({
						key: 'bo_s',
						isHover,
						prefix,
						breakpoint,
					})
				]
			) &&
			borderStyle === 'none'
		)
			response[breakpoint].border = 'none';

		// Border radius doesn't need border style
		radiusKeys.forEach(axis => {
			const val = getValueAndUnit('bo.ra', axis);
			const cssProperty = `border-${radiusDictionary[axis]}-radius`;
			const prevVal = response[prevBreakpoint][cssProperty];

			if (val && val !== prevVal) response[breakpoint][cssProperty] = val;
		});
	});

	return response;
};

export default getBorderStyles;

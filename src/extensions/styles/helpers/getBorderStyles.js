/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';
import getPaletteAttributes from '../getPaletteAttributes';
import getAttributesValue from '../getAttributesValue';
import getAttributeKey from '../getAttributeKey';

/**
 * External dependencies
 */
import { isUndefined, isNil } from 'lodash';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
const getPrevBreakpoint = breakpoint =>
	breakpoints[breakpoints.indexOf(breakpoint) - 1] ?? 'general';

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
		target: 'border-status-hover',
		props: obj,
		prefix,
	});

	const {
		'hover-border-color-global': isActive,
		'hover-border-color-all': affectAll,
	} = getAttributesValue({
		target: ['hover-border-color-global', 'hover-border-color-all'],
		props: scValues,
	});
	const globalHoverStatus = isActive && affectAll;

	if (isHover && !isNil(hoverStatus) && !hoverStatus && !globalHoverStatus)
		return response;

	const widthKeys = ['top', 'right', 'bottom', 'left'];
	const radiusKeys = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];

	let omitBorderStyle = !isIB && !hoverStatus && !globalHoverStatus;
	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		const borderStyle = getLastBreakpointAttribute({
			target: `${prefix}border-style`,
			breakpoint,
			attributes: obj,
			isHover,
		});

		const isBorderNone = isUndefined(borderStyle) || borderStyle === 'none';
		omitBorderStyle = omitBorderStyle ? isBorderNone : false;

		const getValueAndUnit = target => {
			const currentValue =
				obj[getAttributeKey(target, isHover, prefix, breakpoint)];
			const currentUnit =
				obj[
					getAttributeKey(
						`${target}-unit`,
						isHover,
						prefix,
						breakpoint
					)
				];

			const hasCurrent = !isNil(currentValue) || !isNil(currentUnit);

			if (!hasCurrent) return null;

			const lastValue = getLastBreakpointAttribute({
				target: `${prefix}${target}`,
				breakpoint,
				attributes: obj,
				isHover,
			});

			if (isNil(lastValue)) return null;

			const lastUnit =
				getLastBreakpointAttribute({
					target: `${prefix}${target}-unit`,
					breakpoint,
					attributes: obj,
					isHover,
				}) || 'px';

			return `${lastValue}${lastUnit}`;
		};

		const prevBreakpoint = getPrevBreakpoint(breakpoint);

		if (!isBorderNone) {
			const getColorString = () => {
				const currentColor = getAttributesValue({
					target: [
						'border-palette-status',
						'border-palette-color',
						'border-palette-opacity',
						'border-color',
					],
					props: obj,
					isHover,
					prefix,
					breakpoint,
				});

				const hasDifferentColorAttributes = Object.values(
					currentColor
				).some(value => !isNil(value));

				if (!hasDifferentColorAttributes) return null;

				const { paletteStatus, paletteColor, paletteOpacity, color } =
					getPaletteAttributes({
						obj,
						prefix: `${prefix}border-`,
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
					getAttributeKey('border-style', isHover, prefix, breakpoint)
				];
			if (!isNil(currentBorderStyle))
				response[breakpoint]['border-style'] = borderStyle;

			const borderColor = getColorString();
			if (borderColor)
				response[breakpoint][borderColorProperty] = borderColor;

			widthKeys.forEach(axis => {
				const val = getValueAndUnit(`border-width-${axis}`);
				const prevVal =
					response[prevBreakpoint][`border-${axis}-width`];

				if (val && val !== prevVal)
					response[breakpoint][`border-${axis}-width`] = val;
			});
		} else if (
			!isNil(
				obj[
					getAttributeKey('border-style', isHover, prefix, breakpoint)
				]
			) &&
			borderStyle === 'none'
		)
			response[breakpoint].border = 'none';

		// Border radius doesn't need border style
		radiusKeys.forEach(axis => {
			const val = getValueAndUnit(`border-radius-${axis}`);
			const prevVal = response[prevBreakpoint][`border-${axis}-radius`];

			if (val && val !== prevVal)
				response[breakpoint][`border-${axis}-radius`] = val;
		});
	});

	return response;
};

export default getBorderStyles;

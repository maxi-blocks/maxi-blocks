/**
 * Internal dependencies
 */
import getColorRGBAString from '@extensions/styles/getColorRGBAString';
import getLastBreakpointAttribute from '@extensions/styles/getLastBreakpointAttribute';
import getPaletteAttributes from '@extensions/styles/getPaletteAttributes';

/**
 * External dependencies
 */
import { isNil, isNumber } from 'lodash';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getDividerStyles = (
	obj,
	target,
	blockStyle,
	isHover = false,
	prefix = '',
	useBottomBorder = false
) => {
	const response = {
		label: 'Divider',
		general: {},
	};

	const getColor = breakpoint => {
		const {
			paletteStatus,
			paletteSCStatus,
			paletteColor,
			paletteOpacity,
			color,
		} = getPaletteAttributes({
			obj,
			prefix: `${prefix}divider-border-`,
			breakpoint,
			isHover,
		});

		if (paletteStatus && isNumber(paletteColor))
			return {
				'border-color': getColorRGBAString(
					paletteSCStatus
						? {
								firstVar: `color-${paletteColor}`,
								opacity: paletteOpacity,
								blockStyle,
						  }
						: {
								firstVar: `${prefix}divider-color`,
								secondVar: `color-${paletteColor}`,
								opacity: paletteOpacity,
								blockStyle,
						  }
				),
			};

		return { 'border-color': color };
	};

	const getPrevBreakpoint = breakpoint =>
		breakpoints[breakpoints.indexOf(breakpoint) - 1] ?? 'general';

	breakpoints.forEach(breakpoint => {
		if (target === 'line') {
			const isHorizontal =
				getLastBreakpointAttribute({
					target: `${prefix}line-orientation`,
					breakpoint,
					attributes: obj,
					isHover,
				}) === 'horizontal';

			const dividerBorderStyle = getLastBreakpointAttribute({
				target: `${prefix}divider-border-style`,
				breakpoint,
				attributes: obj,
				isHover,
			});

			const positionHorizontal = useBottomBorder ? 'bottom' : 'top';
			const positionVertical = 'right';

			const dividerLineWeight = isHorizontal
				? getLastBreakpointAttribute({
						target: `${prefix}divider-border-top-width`,
						breakpoint,
						attributes: obj,
						isHover,
				  })
				: getLastBreakpointAttribute({
						target: `${prefix}divider-border-${positionVertical}-width`,
						breakpoint,
						attributes: obj,
						isHover,
				  });
			const dividerLineWeightUnit =
				getLastBreakpointAttribute({
					target: isHorizontal
						? `${prefix}divider-border-top-unit`
						: `${prefix}divider-border-${positionVertical}-unit`,
					breakpoint,
					attributes: obj,
					isHover,
				}) ?? 'px';

			const dividerSize = isHorizontal
				? getLastBreakpointAttribute({
						target: `${prefix}divider-width`,
						breakpoint,
						attributes: obj,
						isHover,
				  })
				: getLastBreakpointAttribute({
						target: `${prefix}divider-height`,
						breakpoint,
						attributes: obj,
						isHover,
				  });
			const dividerSizeUnit =
				getLastBreakpointAttribute({
					target: `${prefix}divider-width-unit`,
					breakpoint,
					attributes: obj,
					isHover,
				}) ?? 'px';

			const dividerBorderRadius = getLastBreakpointAttribute({
				target: `${prefix}divider-border-radius`,
				breakpoint,
				attributes: obj,
				isHover,
			});

			response[breakpoint] = {
				...getColor(breakpoint),
				...(dividerBorderStyle === 'solid' &&
					(dividerBorderRadius
						? {
								'border-radius': '20px',
						  }
						: getLastBreakpointAttribute({
								target: `${prefix}divider-border-radius`,
								breakpoint: getPrevBreakpoint(breakpoint),
								attributes: obj,
								isHover,
						  }) && {
								'border-radius': '0px',
						  })),

				...(isHorizontal && {
					[`border-${positionHorizontal}-style`]: dividerBorderStyle,
					[`border-${positionVertical}-style`]: 'none',
					...(!isNil(dividerLineWeight) && {
						[`border-${positionHorizontal}-width`]: `${dividerLineWeight}${dividerLineWeightUnit}`,
						height: `${dividerLineWeight}${dividerLineWeightUnit}`,
					}),
					...(!isNil(dividerSize) && {
						width: `${dividerSize}${dividerSizeUnit}`,
					}),
				}),

				...(!isHorizontal && {
					[`border-${positionHorizontal}-style`]: 'none',
					[`border-${positionVertical}-style`]: dividerBorderStyle,
					...(!isNil(dividerLineWeight) && {
						[`border-${positionVertical}-width`]: `${dividerLineWeight}${dividerLineWeightUnit}`,
						width: `${dividerLineWeight}${dividerLineWeightUnit}`,
					}),
					...(!isNil(dividerSize) && { height: `${dividerSize}%` }),
				}),
			};
		} else {
			response[breakpoint] = {
				'flex-direction': 'row',
				'align-items': obj[`line-vertical-${breakpoint}`]
					? obj[`line-vertical-${breakpoint}`]
					: getLastBreakpointAttribute({
							target: `${prefix}line-vertical`,
							breakpoint,
							attributes: obj,
							isHover,
					  }),
				'justify-content': obj[`line-horizontal-${breakpoint}`]
					? obj[`line-horizontal-${breakpoint}`]
					: getLastBreakpointAttribute({
							target: `${prefix}line-horizontal`,
							breakpoint,
							attributes: obj,
							isHover,
					  }),
			};
		}
	});

	return response;
};

export default getDividerStyles;
